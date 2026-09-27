# Lab 07 — Save and reuse an agent

Lab 07 builds on [Lab 06](LAB06.md). Create a named programming tutor once, then use its saved `agent_id` to start two independent sessions. The browser stores only the agent ID; the server keeps the API key private.

## Learning goals

1. Create a reusable agent with a name, model, and instructions.
2. Retrieve that agent by ID after returning to the page.
3. Start two new sessions with the same `agent_id` and compare their different session IDs.
4. Explain the difference between shared configuration and separate conversation histories.

## Run the lab

Run `npm ci`, set `OPENAI_API_KEY` in a private `.env` file, and run `npm run dev`. Open <http://localhost:5173> and select **Save and reuse an agent** under **TypeScript & Configuration**. The server uses `OPENAI_MODEL` when set, otherwise its configured default.

## Exercise

1. Review the tutor's name and instructions, then select **Save tutor preset**. Record the returned agent ID.
2. Ask the same question in **Session A** and **Session B**. Both runs use the saved agent ID, but each creates a fresh session.
3. Compare the two session IDs. They should differ. The answers may also differ because model output can vary.
4. Reload the page. The browser reads the saved agent ID from local storage and the server retrieves its current configuration from the API.
5. Open **View code**. Read the four explained snippets and use **Viva voice · Read aloud** to hear each explanation through browser speech synthesis. No audio API call is made.
6. Change the instructions and choose **Save as a new preset**. This creates a second saved agent; it does not modify the first. Repeat the two-session comparison.

The local course app has no user accounts. In a multi-user app, the server must authenticate users and authorize access to saved agent IDs and session IDs. This lab intentionally creates presets but does not delete them; manage project resources according to your own retention policy.

## Code map

| File | Role |
| --- | --- |
| `server/lab7.ts` | Validates requests, creates and retrieves saved agents, and streams new sessions using `agent_id`. |
| `server/index.ts` | Routes the Lab 07 API calls. |
| `src/Lab7.tsx` | Renders the preset form, two sessions, comparison evidence, snippets, and VivaVoice controls. |
| `src/App.tsx` | Adds Lab 07 to desktop and mobile navigation. |
| `src/styles.css` | Styles white cards, session results, and code blocks. |

See [OpenAI Docs: Configuring Agents](https://developers.openai.com/api/docs/guides/agents-api/configuration) for saved-agent reuse. A saved agent supplies configuration; each session has its own conversation and work.
