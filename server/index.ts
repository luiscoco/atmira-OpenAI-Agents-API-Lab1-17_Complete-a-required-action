import { createServer as createHttpServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, join, resolve, sep } from 'node:path';
import OpenAI from 'openai';
import { runLab4, recoverLab4, cancelLab4 } from './lab4.ts';
import { listLab5, retrieveLab5, deleteLab5 } from './lab5.ts';
import { createLab7Agent, retrieveLab7Agent, runLab7 } from './lab7.ts';
import { runLab8 } from './lab8.ts';
import { runLab9 } from './lab9.ts';
import { runLab10, validateLab10 } from './lab10.ts';
import { runLab11 } from './lab11.ts';
import { runLab12 } from './lab12.ts';
import { sendLab13, snapshotLab13, attachLab13 } from './lab13.ts';
import { runLab14, controlLab14 } from './lab14.ts';
import { runLab15, usageLab15 } from './lab15.ts';
import { runLab16, sessionLab16, cancelLab16 } from './lab16.ts';
import { runLab17, resolveLab17, itemsLab17 } from './lab17.ts';

const root = resolve(import.meta.dirname, '..');
const dist = join(root, 'build');

// Node 22+ loads .env without sending its contents to the browser.
if (existsSync(join(root, '.env'))) {
  process.loadEnvFile(join(root, '.env'));
}

// Lab 01 deliberately starts a fresh, single-turn session for every prompt.
// Session continuation is introduced in a later lab.
const agent = {
  model: process.env.OPENAI_MODEL || 'gpt-5.6-terra',
  instructions:
    'You are a friendly programming tutor. Answer clearly and concisely. ' +
    'When useful, include one short example. If you are unsure, say so.',
};

const port = Number(process.env.PORT || 5173);
const isProduction = process.env.NODE_ENV === 'production' || process.argv.includes('--production');

const vite = isProduction
  ? null
  : await (await import('vite')).createServer({
      configFile: join(root, 'vite.config.js'),
      server: { middlewareMode: true },
    });

function sendJson(response, status, body) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(body));
}

async function readJson(request): Promise<unknown> {
  let text = '';
  for await (const chunk of request) {
    text += chunk;
    if (text.length > 12_000) throw new Error('Request is too large.');
  }
  return JSON.parse(text);
}

function requestFields(value: unknown): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error('Request body must be an object.');
  }
  return value as Record<string, unknown>;
}

function writeEvent(response, event) {
  response.write(`${JSON.stringify(event)}\n`);
}

async function handleRun(request, response, lab2 = false, inspect = false) {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_api_key_here') {
    sendJson(response, 503, { error: 'Add OPENAI_API_KEY to .env, then restart the server.' });
    return;
  }

  let prompt;
  let sessionId;
  let instructions;
  try {
    const body = requestFields(await readJson(request));
    prompt = typeof body.prompt === 'string' ? body.prompt.trim() : '';
    if (lab2) {
      sessionId = typeof body.sessionId === 'string' ? body.sessionId.trim() : '';
      instructions = typeof body.instructions === 'string' ? body.instructions.trim() : '';
    }
  } catch {
    sendJson(response, 400, { error: 'Send a valid JSON request with a prompt.' });
    return;
  }
  if (!prompt || prompt.length > 2000) {
    sendJson(response, 400, { error: 'Prompt must be between 1 and 2,000 characters.' });
    return;
  }
  if (lab2 && sessionId && (sessionId.length > 200 || !/^sess_[A-Za-z0-9_-]+$/.test(sessionId))) {
    sendJson(response, 400, { error: 'Invalid session ID.' });
    return;
  }
  if (lab2 && !sessionId && (!instructions || instructions.length > 4000)) {
    sendJson(response, 400, { error: 'Instructions must be between 1 and 4,000 characters.' });
    return;
  }

  response.writeHead(200, {
    'Content-Type': 'application/x-ndjson; charset=utf-8',
    'Cache-Control': 'no-cache',
    'X-Content-Type-Options': 'nosniff',
  });

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  let stream;
  let completed = false;
  let sessionSent = false;
  const parts = new Map();
  const partKey = (event) => `${event.item_id}:${event.output_index}:${event.content_index}`;

  try {
    if (lab2 && sessionId) {
      writeEvent(response, { type: 'session', sessionId });
      sessionSent = true;
      writeEvent(response, { type: 'status', label: 'Continuing the same session' });
      // Open the event stream before sending input so the first events are captured.
      stream = await client.beta.agents.sessions.events.stream(sessionId);
      await client.beta.agents.sessions.events.create(sessionId, {
        events: [{
          type: 'agent.session.input.message',
          input: [{ role: 'user', content: [{ type: 'input_text', text: prompt }] }],
        }],
      });
    } else {
      writeEvent(response, { type: 'status', label: 'Starting agent session' });
      stream = await client.beta.agents.sessions.create({
        agent: lab2 ? { ...agent, instructions } : agent,
        environment: { type: 'none' },
        input: prompt,
        stream: true,
      });
    }

    for await (const event of stream) {
      if (response.destroyed) break;
      if (inspect) {
        // Forward identifiers and lifecycle metadata, never prompt or answer content.
        writeEvent(response, {
          type: 'inspect',
          event: {
            type: event.type,
            eventId: event.event_id || null,
            sessionId: event.session_id || sessionId || null,
            turnId: event.turn_id || event.turn?.id || event.item?.turn_id || null,
            itemId: event.item_id || event.item?.id || null,
            turnStatus: event.turn?.status || null,
            sessionStatus: event.session?.status || null,
            rootTurn: event.turn?.subagent_id == null,
          },
        });
      }
      if (lab2 && !sessionSent && event.session_id) {
        sessionId = event.session_id;
        sessionSent = true;
        writeEvent(response, { type: 'session', sessionId });
      }
      if (event.type === 'agent.session.turn.output_text.delta') {
        const key = partKey(event);
        parts.set(key, (parts.get(key) || '') + event.delta);
        writeEvent(response, { type: 'text', text: [...parts.values()].join('\n') });
      } else if (event.type === 'agent.session.turn.output_text.done') {
        parts.set(partKey(event), event.text);
        writeEvent(response, { type: 'text', text: [...parts.values()].join('\n') });
      } else if (event.type === 'agent.session.turn.completed' && event.turn?.subagent_id == null) {
        completed = true;
        writeEvent(response, { type: 'complete' });
        break;
      } else if (event.type === 'agent.session.turn.failed' && event.turn?.subagent_id == null) {
        throw new Error(event.turn.error?.message || 'The agent turn failed.');
      } else if (event.type === 'agent.session.turn.cancelled' && event.turn?.subagent_id == null) {
        throw new Error('The agent turn was cancelled.');
      } else if (event.type === 'error') {
        throw new Error(event.error?.message || 'The agent returned an error.');
      } else if (event.type === 'agent.session.failed' || event.type === 'agent.session.environment.failed') {
        throw new Error('The agent session failed.');
      }
    }
    if (!completed && !response.destroyed) throw new Error('The connection closed before the turn completed.');
    if (lab2 && completed && !sessionSent) throw new Error('The session finished without a session ID.');
  } catch (error) {
    if (!response.destroyed) {
      writeEvent(response, { type: 'error', message: error.message || 'Something went wrong.' });
    }
  } finally {
    stream?.controller?.abort();
    if (!response.destroyed) response.end();
  }
}

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const server = createHttpServer(async (request, response) => {
  const path = new URL(request.url, 'http://localhost').pathname;
  if (path === '/api/health' && request.method === 'GET') {
    sendJson(response, 200, {
      configured: Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_api_key_here'),
      model: agent.model,
    });
    return;
  }
  if (path === '/api/run' && request.method === 'POST') {
    await handleRun(request, response);
    return;
  }
  if (path === '/api/lab2/run' && request.method === 'POST') {
    await handleRun(request, response, true);
    return;
  }
  if (path === '/api/lab3/run' && request.method === 'POST') {
    await handleRun(request, response, true, true);
    return;
  }
  if (path === '/api/lab4/run' && request.method === 'POST') {
    await runLab4(request, response, agent);
    return;
  }
  if (path === '/api/lab4/recover' && request.method === 'GET') {
    await recoverLab4(request, response);
    return;
  }
  if (path === '/api/lab4/cancel' && request.method === 'POST') {
    await cancelLab4(request, response);
    return;
  }
  if (path === '/api/lab5/sessions' && request.method === 'GET') {
    await listLab5(request, response);
    return;
  }
  if (path === '/api/lab5/session' && request.method === 'GET') {
    await retrieveLab5(request, response);
    return;
  }
  if (path === '/api/lab5/session' && request.method === 'DELETE') {
    await deleteLab5(request, response);
    return;
  }
  if (path === '/api/lab7/agent' && request.method === 'POST') {
    await createLab7Agent(request, response, agent.model);
    return;
  }
  if (path === '/api/lab7/agent' && request.method === 'GET') {
    await retrieveLab7Agent(request, response);
    return;
  }
  if (path === '/api/lab7/run' && request.method === 'POST') {
    await runLab7(request, response);
    return;
  }
  if (path === '/api/lab8/run' && request.method === 'POST') {
    await runLab8(request, response);
    return;
  }
  if (path === '/api/lab9/run' && request.method === 'POST') {
    await runLab9(request, response);
    return;
  }
  if (path === '/api/lab10/run' && request.method === 'POST') {
    await runLab10(request, response);
    return;
  }
  if (path === '/api/lab10/validate' && request.method === 'POST') {
    await validateLab10(request, response);
    return;
  }
  if (path === '/api/lab11/run' && request.method === 'POST') {
    await runLab11(request, response, agent);
    return;
  }
  if (path === '/api/lab12/run' && request.method === 'POST') {
    await runLab12(request, response, agent);
    return;
  }
  if (path === '/api/lab13/send' && request.method === 'POST') {
    await sendLab13(request, response, agent);
    return;
  }
  if (path === '/api/lab13/snapshot' && request.method === 'GET') {
    await snapshotLab13(request, response);
    return;
  }
  if (path === '/api/lab13/attach' && request.method === 'POST') {
    await attachLab13(request, response);
    return;
  }
  if (path === '/api/lab14/run' && request.method === 'POST') {
    await runLab14(request, response, agent);
    return;
  }
  if (path === '/api/lab14/control' && request.method === 'POST') {
    await controlLab14(request, response);
    return;
  }
  // Lab 14 reads saved turns and items exactly as Lab 13 does. Reading sends nothing.
  if (path === '/api/lab14/snapshot' && request.method === 'GET') {
    await snapshotLab13(request, response);
    return;
  }
  if (path === '/api/lab15/run' && request.method === 'POST') {
    await runLab15(request, response, agent);
    return;
  }
  // Lab 15 re-reads the saved turn and session usage. Reading sends nothing.
  if (path === '/api/lab15/usage' && request.method === 'GET') {
    await usageLab15(request, response);
    return;
  }
  if (path === '/api/lab16/run' && request.method === 'POST') {
    await runLab16(request, response, agent);
    return;
  }
  // Lab 16 reads the saved session, where a waiting tool request is kept. Reading sends nothing.
  if (path === '/api/lab16/session' && request.method === 'GET') {
    await sessionLab16(request, response);
    return;
  }
  if (path === '/api/lab16/cancel' && request.method === 'POST') {
    await cancelLab16(request, response);
    return;
  }
  if (path === '/api/lab17/run' && request.method === 'POST') {
    await runLab17(request, response, agent);
    return;
  }
  // Step-through: the server reads the waiting calls from the saved session, runs them, and sends the results.
  if (path === '/api/lab17/resolve' && request.method === 'POST') {
    await resolveLab17(request, response);
    return;
  }
  // Lab 17 reads the saved items, where the calls and their outputs are kept. Reading sends nothing.
  if (path === '/api/lab17/items' && request.method === 'GET') {
    await itemsLab17(request, response);
    return;
  }
  // Cancelling a waiting turn works exactly as in Lab 16.
  if (path === '/api/lab17/cancel' && request.method === 'POST') {
    await cancelLab16(request, response);
    return;
  }
  if (path.startsWith('/api/')) {
    sendJson(response, 404, { error: 'API route not found.' });
    return;
  }
  if (vite) {
    vite.middlewares(request, response, () => {});
    return;
  }
  const file = resolve(dist, `.${path === '/' ? '/index.html' : path}`);
  if (file !== dist && !file.startsWith(dist + sep)) {
    sendJson(response, 403, { error: 'Forbidden.' });
    return;
  }
  try {
    const content = await readFile(file);
    response.writeHead(200, { 'Content-Type': mime[extname(file)] || 'application/octet-stream' });
    response.end(content);
  } catch {
    sendJson(response, 404, { error: 'Page not found.' });
  }
});

server.listen(port, () => console.log(`Agent Labs running at http://localhost:${port}`));
