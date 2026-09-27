# Lab 04 — Handle interrupted work

Lab 04 builds on [Lab 03](LAB03.md). It adds an error and recovery panel beside the tutor. Students can inspect an API error, request cancellation of a live turn, and simulate a stream that stops before the turn outcome arrives.

## Learning goals

1. Distinguish an HTTP or API error from a failed or cancelled agent turn.
2. Treat a stream that ends without a root turn outcome as uncertain.
3. Retrieve the session, recent turns, and saved messages before retrying.
4. Explain why a recovered completed turn should not be run again.

## Run on Windows

Use Node.js 22 or newer. In Windows Terminal, run npm ci, set your own OPENAI_API_KEY in the environment or a private .env file, and run npm run dev. Open <http://localhost:5173> and choose **Handle interrupted work**.

## Exercises

1. Choose **Simulated turn failure** to see a local failed outcome without an API call. Then choose **Simulated API error** and submit a question. The request is rejected before a session starts. The panel shows that no session ID exists, so retry is available.
2. Choose **Normal run** and submit a question. While it is running, click **Cancel turn**. This sends a real agent.session.input.cancel event. The turn may complete before the cancellation arrives; inspect the resulting outcome.
3. Choose **Simulated stream disconnect** and submit a question. The server stops forwarding events after answer text begins, without cancelling the agent turn. Click **Retrieve saved state**. If the turn is still active, wait and refresh. If it completed, the app displays the saved answer and does not offer a retry.
4. Open **View code** to read four explained snippets. Each has a **Viva voice · Read aloud** button, using browser speech synthesis.

A genuine API failure or failed turn may also appear during a normal run. The simulated API error, turn failure, and disconnect options exist so the lesson has repeatable cases. The turn-failure simulation is local and creates no remote session. The saved-state panel shows the first page of up to 100 message items and the 20 most recent root turns; it labels when more items exist.

## Code map

| File | Role |
| --- | --- |
| server/lab4.ts | Runs or cancels a turn and retrieves session, turn, and item state. |
| server/index.ts | Routes Lab 04 requests to the server module. |
| src/Lab4.tsx | Shows the run, recovery panel, retry rules, code snippets, and Viva voice controls. |
| src/App.tsx | Adds Lab 04 navigation. |
| src/styles.css | Styles the workspace, recovery panel, and responsive layout. |

See [OpenAI Docs: Events and items](https://developers.openai.com/api/docs/guides/agents-api/sessions/events) for turn outcomes and disconnect recovery, and [Manage sessions](https://developers.openai.com/api/docs/guides/agents-api/sessions/manage) for retrieving session state.

