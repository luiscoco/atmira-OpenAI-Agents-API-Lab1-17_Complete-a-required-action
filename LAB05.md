# Lab 05 — Manage sessions

Lab 05 builds on [Lab 04](LAB04.md). Browse sessions in the configured OpenAI project, retrieve the current state of one session, and delete a session after reviewing its ID.

## Learning goals

1. List sessions in pages rather than assuming the first response contains every session.
2. Retrieve one session to inspect its current status, agent, model, environment, and required action count.
3. Decide when a session ID should be retained for a follow-up and when a session can be deleted.
4. Verify that deletion removes the session from the API history.

## Run on Windows

Use Node.js 22 or newer. Run `npm ci`, set your own `OPENAI_API_KEY` in the environment or a private `.env` file, and run `npm run dev`. Open <http://localhost:5173> and choose **Manage sessions**. The browser never receives the API key.

## Exercises

1. In Lab 02, create two separate conversations. Open Lab 05 and select **Refresh**. Find both IDs in **Recent sessions**.
2. Select one ID. Compare its list status with the retrieved status and note its model, environment, and last active time. A list row can become stale until refreshed.
3. If **Load more sessions** appears, click it. Explain why the request passes the last ID from the previous page as `after`.
4. Select a disposable session and click **Delete session…**. Verify the exact ID, then choose **Yes, delete session**. Confirm it disappears from the refreshed history. Keep a session that you still need for a follow-up.
5. Open **View code**. Read the four snippets and their explanations. Each has a **Viva voice · Read aloud** button that uses browser speech synthesis and makes no audio API call.

Deletion removes a session from the public API; physical cleanup may continue asynchronously. This course app has no user accounts and shows the configured project's sessions. A production application must authenticate users and check ownership before listing, retrieving, or deleting their sessions.

## Code map

| File | Role |
| --- | --- |
| `server/lab5.ts` | Validates IDs, lists paginated sessions, retrieves selected fields, and deletes a session. |
| `server/index.ts` | Routes Lab 05 API requests. |
| `src/Lab5.tsx` | Renders history, details, confirmation, teaching snippets, and Viva voice controls. |
| `src/App.tsx` | Adds Lab 05 navigation. |
| `src/styles.css` | Styles the history and detail panels for desktop and mobile. |

See [OpenAI Docs: Manage sessions](https://developers.openai.com/api/docs/guides/agents-api/sessions/manage) for the list, retrieve, and delete API calls.
