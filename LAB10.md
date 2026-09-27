# Lab 10 — Design an output contract

Lab 10 builds on the saved tutor preset from [Lab 07](LAB07.md). A study-plan form asks the agent for a precise JSON shape. The server validates the completed answer before the browser displays it as a plan.

## Learning goals

1. Write session instructions that define exact fields, types, day count, and time limits.
2. Treat model output as untrusted text. Parse JSON and validate the full application contract.
3. Explain why valid JSON can still be an invalid plan.
4. Show a rejected answer, its specific errors, one repair request, and the result of revalidation.

## Run the lab

Run `npm ci`, put `OPENAI_API_KEY` in a private `.env` file, and start the app with `npm run dev`. Save a tutor preset in Lab 07. Open **Design an output contract** from the sidebar.

Choose a topic, learning goal, 3–7 days, and 15–120 minutes per day. **Generate and validate plan** creates a new session from the saved agent with session-specific output instructions. The saved agent is not modified. The server captures the completed text, validates it, and only renders a plan after every check passes.

If the first answer fails, the UI displays its raw text and validation errors. The server asks for one corrected complete JSON object in the same session. It validates the second answer and stops, whether accepted or rejected. A failed API turn or broken stream is reported separately from a contract failure. Do not treat a partially streamed draft as a validated plan.

The **Validation playground** needs no API key. Load the malformed sample, validate it, and inspect the missing-day and time-budget errors. Load the valid 3-day sample to see acceptance. Change the form to 4 days to see that the same sample then fails. You can edit either sample and validate your own candidate.

Open **View code** for four snippets and explanations. **Viva voice · Read aloud** speaks each explanation using browser speech synthesis; it does not call an audio API.

## Contract

```json
{
  "title": "TypeScript foundations",
  "goal": "Build a typed React component",
  "days": [
    { "day": 1, "focus": "Types", "activity": "Write three typed functions", "minutes": 30 }
  ]
}
```

The example shows one day for brevity. A real accepted plan must contain exactly the requested number of days, numbered consecutively from 1. `title`, `goal`, `focus`, and `activity` must be nonempty strings within their length limits. `minutes` must be an integer from 1 through the requested daily budget. Unknown fields, missing fields, Markdown fences, and non-JSON text fail validation.

## Code map

| File | Role |
| --- | --- |
| `server/lab10Contract.ts` | Builds the output instructions and validates JSON, field types, day order, and limits. |
| `server/lab10.ts` | Handles live generation, one repair turn, and the offline validation endpoint. |
| `server/index.ts` | Routes `POST /api/lab10/run` and `POST /api/lab10/validate`. |
| `src/Lab10.tsx` | Shows the form, streamed draft, attempt evidence, accepted plan, playground, code snippets, and Viva voice. |
| `src/App.tsx` | Adds desktop and mobile Lab 10 navigation. |

## Student challenge

First, make the malformed sample pass by adding the missing days and reducing the over-budget time. Then run a live plan, change one contract limit, and explain why each answer was accepted or rejected using the exact validation evidence. Show the session ID and turn IDs for any live repair.

See [OpenAI Docs: Configuring Agents](https://developers.openai.com/api/docs/guides/agents-api/configuration) for session-specific instructions and [Run and continue sessions](https://developers.openai.com/api/docs/guides/agents-api/sessions) for follow-up turns.
