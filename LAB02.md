# Lab 02 — Continue and customize

Lab 02 builds on [Lab 01](README.md). Students ask follow-up questions in one Agents API session, then start a new session with different agent instructions. Both lessons are available from the React sidebar.

## Learning goals

1. Distinguish a session from a turn.
2. Reuse a session ID for a follow-up message.
3. Open the event stream before submitting the next message.
4. Explain why editing instructions requires a new session.
5. Compare answers from different instruction sets.

## Run on Windows

Open PowerShell or Windows Terminal in this directory:

```powershell
npm ci
Copy-Item .env.example .env
notepad .env
npm run dev
```

Put your own API key in `.env` and open <http://localhost:5173>. Select either Lab 02 item in the sidebar. If `.env` already exists, keep it and run `npm run dev` directly.

## Step 1: Start a conversation

Ask “Explain what an API is in simple terms.” The server creates a session using the instructions currently applied in the editor:

```js
stream = await client.beta.agents.sessions.create({
  agent: { ...agent, instructions },
  environment: { type: 'none' },
  input: prompt,
  stream: true,
});
```

The stream provides a session ID. The server forwards it to React, which displays it above the conversation. The first answer is turn 1.

## Step 2: Send a follow-up

Ask “Can you show a JavaScript example?” React sends the saved session ID with the prompt. The server opens the session event stream before submitting a new user message:

```js
stream = await client.beta.agents.sessions.events.stream(sessionId);
await client.beta.agents.sessions.events.create(sessionId, {
  events: [{
    type: 'agent.session.input.message',
    input: [{ role: 'user', content: [{ type: 'input_text', text: prompt }] }],
  }],
});
```

The next message starts another turn in the **same** session, so the tutor can use the earlier conversation as context. Opening the stream first captures early events. The server forwards text and completion events to React. See [OpenAI Docs: run and continue sessions](https://developers.openai.com/api/docs/guides/agents-api/sessions).

## Step 3: Customize instructions

Select **Customize instructions** and change the tutor's response style. For example, ask it to explain programming to a 12-year-old in two short sentences. Click **Apply & start new session**. The app clears its local conversation and session ID:

```js
setActiveInstructions(draftInstructions.trim());
sessionRef.current = '';
setSessionId('');
setMessages([]);
```

The next question creates a new session with the edited instructions. The previous session keeps its original instructions. The session settings endpoint does not update instructions on an existing session. See [OpenAI Docs: configuring agents](https://developers.openai.com/api/docs/guides/agents-api/configuration).

## Step 4: Compare the answers

Ask the same opening question again and compare the answers. Record or copy the old answer before applying instructions, because this lab clears the visible conversation when it starts a new one.

## Code map

| File | Responsibility |
| --- | --- |
| `server/index.ts` | Validate input, start a session or send a follow-up, and forward stream events. |
| `src/Lab2.tsx` | Keep the visible session ID and conversation, edit instructions, and render answers. |
| `src/App.tsx` | Switch between Lab 01 and the two Lab 02 lessons. |
| `src/styles.css` | Style the conversation, editor, comparison, and teaching cards. |
| `src/speech.js` | Choose an available narrator voice for code explanations. |

The **View code** dropdown shows three explained excerpts. Each card includes a **Viva voice** read-aloud button. Read-aloud uses browser speech synthesis; it does not call OpenAI.

## Check your work

- The displayed session ID stays the same after a follow-up.
- The turn count increases after each question.
- **New conversation** clears the local session ID; the next prompt creates another session.
- Applying instructions starts a fresh local conversation; the next answer follows the new instructions.
- Lab 01 remains available from the sidebar.
