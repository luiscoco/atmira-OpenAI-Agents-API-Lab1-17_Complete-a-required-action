# Lab 03 — Inspect the lifecycle

Lab 03 adds a live event inspector beside the programming tutor chat. It builds on [Lab 02](LAB02.md): a follow-up stays in the same session and starts another turn.

## Learning goals

1. Identify the session ID, root turn ID, event ID, and saved item ID.
2. Read event order as an agent works.
3. Distinguish a session's idle state from a turn's completed, failed, or cancelled outcome.

## Run

Use Node.js 22 or newer. In Windows Terminal, run `npm ci`, provide your own `OPENAI_API_KEY` through the environment or a private `.env` file, then run `npm run dev`. Open <http://localhost:5173> and choose **Inspect the lifecycle**.

## Exercise

1. Ask “What is a JavaScript function?” Watch events appear as the response streams.
2. Find the session ID, latest root turn ID, latest event ID, and latest saved item ID in the inspector.
3. Ask “Show me an example.” The session ID should stay the same. A new root turn ID should appear.
4. Compare two text events that share an item ID. Each event has its own event ID.

Open **View code** below the inspector to follow four explained excerpts: capturing events, connecting text updates to items, deciding the root turn outcome, and showing IDs in React. Each excerpt has a **Viva voice · Read aloud** button. Read-aloud uses browser speech synthesis and does not make an OpenAI API call.

The inspector shows the latest 120 events while retaining the total count. It forwards metadata rather than raw event payloads, so prompts and response text do not appear in the inspector. The session state is labeled **observed** because the live stream may close on a completed turn before an idle event arrives. An idle event alone is not evidence of success; use the root turn's completion, failure, or cancellation event.

## Code map

| File | Role |
| --- | --- |
| `server/index.ts` | Streams agent events and forwards compact lifecycle metadata from `/api/lab3/run`. |
| `src/Lab3.tsx` | Renders the conversation, IDs, event list, turn outcome, code lessons, and read-aloud controls. |
| `src/App.tsx` | Adds the Lab 03 navigation item. |
| `src/styles.css` | Lays out the chat and inspector side by side. |

See [OpenAI Docs: Events and items](https://developers.openai.com/api/docs/guides/agents-api/sessions/events) for event fields and [Run and continue sessions](https://developers.openai.com/api/docs/guides/agents-api/sessions) for turn outcomes.
