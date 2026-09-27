# Lab 08 — Override one session

Lab 08 builds on [Lab 07](LAB07.md). Start two new sessions from one saved agent. The baseline inherits its configuration; the second session adds an instruction without updating the saved agent.

## Learning goals

1. Use `agent_id` alone to create a baseline session.
2. Add `agent: { instructions }` beside `agent_id` for one session. These instructions append to the saved base instructions.
3. Compare two separate session IDs and the resulting answers to the same question.
4. Retrieve the saved agent again to verify its name, model, and instructions are unchanged.

## Run the lab

Run `npm ci`, set `OPENAI_API_KEY` in a private `.env` file, and run `npm run dev`. In Lab 07, save a tutor preset. Open **Override one session** under **TypeScript & Configuration**. Lab 08 reads the Lab 07 agent ID from local storage and retrieves the preset from the server.

## Exercise

1. Review the saved agent ID and base instructions. Enter one question for both sessions.
2. Keep or edit the additional instruction. For a clear comparison, request Spanish in the override while the saved preset has no language instruction.
3. Select **Run baseline**, then **Run override**. The app creates two fresh sessions with the same `agent_id` and displays their separate session IDs.
4. Select **Verify saved preset**. The server retrieves the agent again; the app compares its saved ID, name, model, and instructions with the snapshot loaded before the runs.
5. Open **View code** to inspect four snippets and their explanations. Use **Viva voice · Read aloud** to hear each explanation through browser speech synthesis. This does not call an audio API.
6. Change the extra instruction and repeat. Editing either input resets the displayed comparison so both results refer to the same question and instruction.

Model output is variable; answer wording alone does not prove an override. The request fields and retrieval of the saved preset are the configuration evidence. The local course app has no user accounts; a multi-user version would authorize access to saved agent IDs and sessions on the server.

## Code map

| File | Role |
| --- | --- |
| `server/lab8.ts` | Validates inputs and streams a baseline or overridden session. |
| `server/index.ts` | Routes `POST /api/lab8/run`. |
| `src/Lab8.tsx` | Loads the Lab 07 preset, compares sessions, verifies the saved fields, and presents the teaching section with Viva voice. |
| `src/App.tsx` | Adds Lab 08 navigation. |
| `src/styles.css` | Styles the comparison and lesson. |

See [OpenAI Docs: Configuring Agents](https://developers.openai.com/api/docs/guides/agents-api/configuration) for session-specific overrides.
