# Lab 17 — Complete a required action

In Lab 16 the agent asked for `lookup_course_calendar` and the turn waited. Lab 17 answers the request. The server detects `agent.session.requires_action` and runs the function itself. It then sends the result back as `agent.session.input.tool_result` with the same `call_id`, and follows the **same turn** to the agent's final answer. The result is a full trace: request → tool call → result → answer.

## Learning goals

1. Detect the pause: `agent.session.requires_action` carries the session, and `session.required_actions` lists the waiting calls. Keep only `type: 'function_call'`, and skip calls you have already answered.
2. Run the function **on the server**. Refuse names the server does not implement. Parse `arguments` (typed `unknown`) and check them against the schema before calling the real function.
3. Send one `tool_result` per call with `call_id`, `turn_id`, `success`, and either `output` (a string, here JSON) or `error`. One `events.create` request can carry several results.
4. Report failures honestly. Send `success: false` with a short error message. Never leave a call unanswered, and never fake an output.
5. Keep reading the same stream. The turn resumes after the results arrive, and it can pause again for more calls. Cap the number of rounds.
6. Resume from the saved session (step-through mode), and read the full trace back with `sessions.items.list`: `message` → `function_call` → `function_call_output` → `message`.

## Run the lab

Run `npm ci`, put `OPENAI_API_KEY` in a private `.env` file, and start the app with `npm run dev`. Open **Complete a required action** in the sidebar (`#lab17`), under **Function tools & human control**.

**The loop.** Five stages (Prompt, `function_call`, `requires_action`, `tool_result`, Answer) light up as a run reaches them.

**Live run.** Pick a question (one lookup, two lookups, likely retry, no tool needed), then choose:

| Option | What the server does |
| --- | --- |
| **Run the function** (default) | Runs `lookupCourseCalendar` and sends `success: true` with the output as a JSON string. |
| **Report a failure** | Simulates a calendar outage and sends `success: false` with an error message. |
| **Answer automatically** (default) | Answers every pause on the same stream and reads on to the end. After 4 rounds it cancels the turn instead. |
| **Step through** | Stops reading at `requires_action`. A **Waiting for your server** card shows each call and a preview of the result. **Run the function and send the result** calls `/api/lab17/resolve`, which reads the calls from the saved session, answers them, and follows the turn. You can also **Cancel the turn instead**. |

The result shows a verdict, the flow, a timed trace, and each call paired with the exact `tool_result` event that answered it, matched by `call_id`. It also shows the answer and all the events. **Read the saved items** lists the session's items, including the `function_call_output` the session kept. The run history compares runs by mode and calls answered.

**Function bench (no API key needed).** Edit a call's name and arguments, or pick a preset: valid, wrong enum, missing topic, extra field, JSON string, or unknown function. The bench runs the same `executeCall` and `toolResultEvent` the server uses and shows the exact input event.

**Loop playground (no API key needed).** Six scripted turns: one call, two calls in one batch, a failing function, rejected arguments followed by a retry, step-through waiting, and a missing result. The results are computed by the server's `executeCall`. What the model chose to do and say is illustrative, not recorded.

Open **View code** for six snippets and explanations. **Viva voice · Read aloud** reads one explanation, and **Viva voice · Read all six** reads them in order. Both use browser speech synthesis and do not call an audio API.

## What a live run showed

These runs used `gpt-5.6-terra` while the lab was being built. Run them again before recording, because model behaviour can change.

- **"When is the live Q&A about function tools, and when is the Stage 4 project due?" (automatic):** the agent asked for the two lookups **one after the other**, not together. The turn paused twice (2 rounds), each call was answered with its own `exec_…` call ID, and the turn completed with "October 14, 2026" and "October 23, 2026".
- **The `function_call` item can arrive after `requires_action`.** In the run above, `turn.item.done` for the call came after the pause. The server records a call the first time it sees it, from either the item or `required_actions`.
- **"When is the Lab 17 session?" (step through):** the first request ended with the turn `waiting`. The resolve request opened `events.stream`, read the call from `session.required_actions`, sent the result, and followed the same turn to `completed`. The saved items then showed the user message, reasoning items, a commentary message ("I'm checking the course calendar…"), the `function_call`, the `function_call_output`, and the final answer.
- **"When is the Lab 17 session?" (report a failure):** the saved `function_call` had `status: failed`, and the agent answered "I can't check right now—the course calendar service is unavailable." It did not invent a date.

## Rules the page follows

```text
requires_action                         → answer only function_call actions whose call_id has no result yet
unknown function name                   → success: false, "Unknown function"; the server never runs it
arguments invalid (parse or schema)     → success: false with the reasons (Lab 18 goes further)
valid call, "Run the function"          → success: true, output = JSON.stringify(lookupCourseCalendar(args))
valid call, "Report a failure"          → success: false, error = simulated outage
after sending                           → keep reading the same stream until the turn ends
more than 4 pauses in one turn          → cancel the turn
step-through resume                     → read the calls from the saved session, never from the browser
```

## Code map

| File | Role |
| --- | --- |
| `src/lab17Action.ts` | Pure functions shared by the server and the page: `executeCall`, `toolResultEvent`, `pairCalls`, `classifyActionRun`, `mergeRuns`, and `parseActionRun` (the runtime boundary). |
| `src/lab17Scenarios.ts` | Six scripted turns for the playground, with results computed by `executeCall`. |
| `server/lab17.ts` | `runLab17` creates the session with the tool and follows it. `resolveLab17` answers a waiting session in step-through mode. `itemsLab17` reads the saved items. A shared `follow()` loop answers each `requires_action`. |
| `server/index.ts` | Routes `POST /api/lab17/run`, `POST /api/lab17/resolve`, `GET /api/lab17/items`, and `POST /api/lab17/cancel` (reuses Lab 16's cancel). |
| `src/Lab17.tsx` | Flow, live run, waiting card, result and trace, saved items, run history, function bench, playground, code snippets, and Viva voice. |
| `src/lab16Tool.ts` | Reused: `courseCalendarTool`, `parseArguments`, `checkArguments`, and `lookupCourseCalendar`. |
| `src/App.tsx`, `src/styles.css`, `tsconfig.lab6.json` | Sidebar entry, Lab 17 styles, and strict type-checking of the new logic. |

## Student challenge

1. Ask **When is the Lab 17 session?** with **Run the function**. Show the trace, and point to the same `call_id` in the `function_call` and in the `tool_result`.
2. Ask it again with **Report a failure**. Compare the two answers and explain why `success: false` is better than no result or a made-up output.
3. Run **Two lookups** with **Step through**. Show the waiting card, send the results (more than once, if the turn pauses again), and open **Read the saved items** to show the `function_call_output` items.
4. In the function bench, send **Wrong enum** and **Unknown function**, and explain what the server refuses to run.

See [OpenAI Docs: Function tools](https://developers.openai.com/api/docs/guides/agents-api/tools/functions) and [Session events](https://developers.openai.com/api/docs/guides/agents-api/sessions/events).
