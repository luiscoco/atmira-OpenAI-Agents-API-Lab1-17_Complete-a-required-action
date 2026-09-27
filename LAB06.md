# Lab 06 — Move the app to TypeScript

Lab 06 builds on [Lab 05](LAB05.md). The React pages and Node server now use `.tsx` and `.ts` source files. The build runs TypeScript checks before Vite bundles the app.

## Learning goals

1. Describe a browser request and a streamed event with TypeScript types.
2. Narrow a discriminated event union by its `type` field.
3. Treat parsed JSON as `unknown` and validate it before updating React state.
4. Run a typecheck and explain the difference between build-time and runtime checks.

## Run the lab

Use Node.js 22 or newer. Run `npm ci`, add `OPENAI_API_KEY` to a private `.env` file, then run `npm run dev`. Open <http://localhost:5173> and select **Move to TypeScript**. The live tutor uses the existing server route and keeps the API key on the server.

Run `npm run typecheck` to check the full application and the Lab 06 teaching files under strict mode. Run `npm run build` to typecheck and create the production bundle.

## Exercises

1. Run the default tutor question. Watch the typed `status`, `session`, `text`, and `complete` events appear under the answer.
2. In the runtime boundary panel, select **Missing text**. The JSON is syntactically valid, but `parseRunEvent` rejects it because a text event needs a string `text` field.
3. Open **View code**. Read the four snippets and use **Viva voice · Read aloud** to hear each explanation through browser speech synthesis. No audio API call is made.
4. In `src/lab6Protocol.ts`, temporarily change the returned text event to use `message` instead of `text`. Run `npm run typecheck`, observe the error, and undo the change.
5. Explain why the compiler catches the edit in step 4 but only the runtime parser can reject the malformed JSON in step 2.

## Code map

| File | Role |
| --- | --- |
| `src/lab6Protocol.ts` | Defines the typed request and event union, validates unknown stream values, and reads NDJSON. |
| `src/Lab6.tsx` | Uses typed React state and event narrowing; renders the exercises, snippets, and VivaVoice controls. |
| `src/App.tsx` | Adds Lab 06 navigation. |
| `server/index.ts` | Keeps the Agents API request and streaming logic on the server. |
| `tsconfig.json`, `tsconfig.lab6.json` | Check the whole app and apply strict checking to the Lab 06 teaching files. |

See [OpenAI Docs: Events and items](https://developers.openai.com/api/docs/guides/agents-api/sessions/events) for the underlying Agents API event stream. The browser receives a smaller, course-specific event union from this app's server.
