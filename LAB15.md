# Lab 15 — Show usage and duration

Labs 11–14 showed what happened during a turn. Lab 15 ends every run with a **run summary** a person can trust. The summary shows how many tokens the run used, how long it took, and what went wrong. Usage in the Agents API is *best effort*: it can be `null`, and recorded usage may change after the stream ends. So the page shows missing usage as **unknown**, never as 0. It leaves unknown runs out of totals and re-reads the saved turn before trusting a number.

## Learning goals

1. Read `usage` from the root turn's terminal event (`turn.completed`, `turn.failed`, or `turn.cancelled`), falling back to the turn object's own `usage`.
2. Parse usage at the browser's runtime boundary. `null` or malformed usage stays unknown. Cached tokens are part of input, and reasoning tokens are part of output.
3. Measure three clocks and say which is which: wall time and time to first text on our server, and queued and working time from the turn's `created_at`, `started_at`, and `completed_at`, which are whole Unix seconds.
4. Re-read the saved turn and session with `turns.retrieve` and `sessions.retrieve`, because recorded usage may change. Reading sends nothing.
5. Sum usage across runs without pretending: count unknown runs, and label the known sum as a floor (`≥`).
6. Explain an error by where it happened (HTTP request, turn, or stream), its status or stable code, and whether a retry can help.

## Run the lab

Run `npm ci`, put `OPENAI_API_KEY` in a private `.env` file, and start the app with `npm run dev`. Open **Show usage and duration** in the sidebar (`#lab15`).

**Live run.** Choose how the run should end, then press **Run and measure**:

| Mode | What the server does | What the summary should show |
| --- | --- | --- |
| **Normal run** | Runs one turn to its outcome. | `completed`, tokens from the event, then from the saved turn. |
| **Cancel after 160 characters** | Sends `agent.session.input.cancel` once 160 characters have streamed. | `cancelled`, a short working time, and the tokens used before the cancel. |
| **Unknown model** | Creates a new session with the model `lab15-no-such-model`. | `rejected` with the HTTP status and code if the request is refused, or `failed` with the turn's error code if the turn starts and then fails. |
| **Stop reading early** | Stops reading after 160 characters and sends nothing. | `unknown` outcome and unknown tokens, until a re-read shows the saved turn's real status and usage. |

Each run adds a row to the **run history**. The page re-reads the saved turn 1.5 s after each run; **Re-read saved usage** reads it again. The summary shows:

- **Tokens**: input, cached (of input), output, reasoning (of output), and total. It names the source (turn event or saved turn) and when the value was read.
- **Duration**: a bar showing where the time went, plus wall time, first text, start-up, queued (API), and working (API).
- **Checks**, such as `total = input + output`, cached ≤ input, and whether the event and the saved turn agree.
- **Error details**: where it happened, status, code, message, and retry advice.
- **Log line**: a one-line summary that never says 0 for an unknown value.

The history footer shows the **honest total** (for example `≥ 4,289`, 3 runs unknown) next to the **naive total**, which adds `null` as 0. It also shows the session's own `usage` from the latest re-read. **Download JSON** saves every run summary.

**Usage playground (no API key needed).** Pick a case and turn **Re-read the saved turn** on or off:

| Case | Lesson |
| --- | --- |
| Completed, usage reported | Cached and reasoning tokens are breakdowns, not extra tokens. |
| Completed, usage unknown | `null` is not 0. Show unknown and keep it out of sums. |
| Usage changed after the event | Store the latest read and when it was read. |
| Cancelled mid-answer | A cancelled turn is not free. |
| Failed: rate limited | Show the code and message, and say whether retrying can help (`rate_limit_exceeded`: retry later). |
| Rejected: model not available | No turn ran, so there is no usage. That is different from unknown usage. |
| Stopped reading early | Unknown now is not unknown forever: re-read the saved turn. |

The field names and error codes come from the SDK's types (`TokenUsage`, `Turn`, and `SessionTurnError` in `openai` 7.23.0). The numbers, IDs, and timings are fixtures, not recordings, and the page says so. The live run and the playground use the same functions from `src/lab15Usage.ts`.

Open **View code** for six snippets and explanations. **Viva voice · Read aloud** reads one explanation, and **Viva voice · Read all six** reads them in order. Both use browser speech synthesis and do not call an audio API.

## Before recording

This lab was built from the SDK's type definitions and was **not run against the live API** while it was built. Before recording a lesson, run each mode once and check:

- whether `usage` is present on `turn.completed`, and whether it is also present on `turn.cancelled` and `turn.failed`;
- whether a re-read a few seconds later reports a different total;
- whether the unknown model is refused at session creation (HTTP) or fails inside the turn, and which status and code it returns.

Update the tables above with what you observe. The page handles every combination, but the lesson should describe the one students will see.

## Rules the summary follows

```text
usage null or malformed          → "unknown" (never 0), left out of sums, counted as unknown
request refused before a session → outcome rejected, usage "none (no turn ran)"
stream ended without an outcome  → outcome unknown; re-read the saved turn before retrying
event usage and saved usage      → trust the saved turn; show both when they differ
total across runs                → "≥ known sum" when any run is unknown
cached / reasoning tokens        → shown inside input / output, never added again
API timestamps                   → whole seconds; a duration is shown only when both ends are known
```

## Code map

| File | Role |
| --- | --- |
| `src/lab15Usage.ts` | Pure functions: `parseUsage`, `bestUsage`, `durations`, `sumUsage` and `totalLabel`, `usageChecks`, `explainError`, `summaryLine`, and `parseServerSummary`, the runtime boundary. |
| `src/lab15Scenarios.ts` | Seven scripted runs for the playground, and `beforeReread`, which shows what the stream alone reported. |
| `server/lab15.ts` | `runLab15` runs one measured turn in one of four modes and ends with a summary line (clocks, API timestamps, raw usage, error). `usageLab15` re-reads the saved turn and session. |
| `server/index.ts` | Routes `POST /api/lab15/run` and `GET /api/lab15/usage`. |
| `src/Lab15.tsx` | Live run, run summary, time bar, history with honest and naive totals, playground, code snippets, and Viva voice. |
| `src/App.tsx` | Adds Lab 15 to the Streaming and React stage. |
| `tsconfig.lab6.json` | Type-checks the usage logic and scenarios in strict mode. |

## Student challenge

In one session, make four runs: **Normal run**, **Cancel after 160 characters**, **Stop reading early**, and **Unknown model**. Show the history table and explain four results:

- why the cancelled run still used tokens;
- why the stopped run was unknown until you re-read it;
- why the unknown-model run has no usage at all;
- why the naive total can be lower than the honest one.

See [OpenAI Docs: Observability and usage](https://developers.openai.com/api/docs/guides/agents-api/observability), [Session management](https://developers.openai.com/api/docs/guides/agents-api/sessions/manage#inspect-session-turns), and [Events and items](https://developers.openai.com/api/docs/guides/agents-api/sessions/events).
