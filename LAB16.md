# Lab 16 — Declare a function tool

Stage 4 gives the agent functions it can call on your server. Lab 16 is the first step: **declare** a function tool and watch the agent **ask** for it. A tool is a declaration with three parts: a name, a description, and a JSON Schema for its arguments. The model sees only that declaration, never your code. When it wants the function, it emits a `function_call` item. The session then moves to `requires_action`, and the turn waits for a result. Sending that result is Lab 17.

## Learning goals

1. Declare a function tool as `{ type: 'function', name, description, parameters }` and attach it through `agent.tools` when the session is created.
2. Write a description that says what the tool does, when to use it, and when not to. The instructions never name the tool, so the description has to do this work.
3. Write a parameters schema with `type: 'object'`, a description for each argument, `required`, an `enum` where the values are fixed, and `additionalProperties: false`.
4. Recognize the request in the stream: a `function_call` item with `name`, `call_id`, and `arguments`, followed by `agent.session.requires_action`.
5. Treat `arguments` as `unknown`: parse it as an object or a JSON string, then compare it with the schema.
6. Read the waiting request back from the saved session (`status: 'requires_action'`, `required_actions`), and cancel the turn when no result will be sent.

## Run the lab

Run `npm ci`, put `OPENAI_API_KEY` in a private `.env` file, and start the app with `npm run dev`. Open **Declare a function tool** in the sidebar (`#lab16`). It is in the new **Function tools & human control** section.

**Tool declaration.** Choose a preset, then edit the name, description, or parameters:

| Preset | What it shows |
| --- | --- |
| **Well described** | `lookup_course_calendar`, with a description that says when and when not to use it, and a strict schema (`topic`, `kind` enum, optional `from_date`). |
| **Vague** | `lookup`, described as "Looks things up.", with one free-text argument. |
| **Loose schema** | A good description, but no enum, no `required`, and extra fields allowed. |
| **No tool** | The session is created without `agent.tools`. |

The linter blocks errors (an invalid name, an empty description, a broken schema, or `required` naming an unknown field). It only warns about weak wording, so you can run a weak tool and compare the results. The panel shows exactly what the server sends in `agent.tools`. The server lints the declaration again before it sends anything.

**Live run.** Pick a question (needs the calendar, needs two lookups, general, or mixed), then choose what happens when the agent asks for the tool:

| Option | What the server does |
| --- | --- |
| **Capture it, then cancel** (default) | Records the request, then sends `agent.session.input.cancel`, because Lab 16 never sends a result. The turn ends `cancelled`. |
| **Leave it waiting** | Stops reading at `requires_action`. Use **Read the saved session** to see `required_actions`, then **Cancel the waiting turn**. |

The result shows a verdict (tool requested or answered directly), the numbered event list, and a card for each requested call. Each card has its `call_id`, its arguments as received, and a comparison with the schema. It also has a preview of what the function would return, which is computed in the browser and not sent. The run history lets you compare the same question across declarations.

**Tool playground (no API key needed).** Six scripted cases use the same components and functions: a schedule question, a general question, a vague description, a loose schema, arguments sent as a JSON string, and two calls in one turn. The event types and fields come from the SDK's types (`openai` 7.23.0). What the model chose to do in each case is illustrative, not recorded.

Open **View code** for six snippets and explanations. **Viva voice · Read aloud** reads one explanation, and **Viva voice · Read all six** reads them in order. Both use browser speech synthesis and do not call an audio API.

## What a live run showed

These runs used `gpt-5.6-terra` while the lab was being built. Run them again before recording, because model behaviour can change.

- **"When is the Lab 17 session?" with the well-described tool:** `turn.item.added` (a `function_call` with `status: in_progress` and `arguments: {"kind":"lab","topic":"17"}`) arrived before `requires_action`. The arguments were an **object**, not a string, and the `call_id` started with `exec_`. The saved session had `status: requires_action` and one entry in `required_actions`. After a cancel, a re-read showed `idle` and no required actions.
- **"When is the live Q&A about function tools, and when is the Stage 4 project due?":** the agent made **one** call, not two. With the default option, the turn ended `cancelled`.
- **"What is a JavaScript closure?" with the tool:** answered directly, and no call was made.
- **"When is the Lab 17 session?" with no tool:** the agent answered that it has no access to the course schedule. It did not invent a date.

## Rules the page follows

```text
declaration error (name, empty description, bad schema)  → blocked in the browser and on the server
weak wording (short description, no "when", no enum)     → warning; the run is allowed so you can compare
function_call item or required_actions entry             → "tool requested"; show name, call_id, arguments
arguments                                                → unknown: an object or a JSON string, else invalid
completed turn with no call                              → "answered directly"
Lab 16 never sends a tool result                         → cancel the waiting turn, or leave it and read the session
```

## Code map

| File | Role |
| --- | --- |
| `src/lab16Tool.ts` | Pure functions shared by the server and the page: `courseCalendarTool`, `toolPresets`, `lintTool`, `parseArguments`, `checkArguments`, `classifyRun`, `parseToolRun` (the runtime boundary), and `lookupCourseCalendar` with its fixture calendar. |
| `src/lab16Scenarios.ts` | Six scripted runs for the playground. |
| `server/lab16.ts` | `runLab16` creates a session with the declared tool, streams a compact log, captures `function_call` items and `requires_action`, and optionally cancels. `sessionLab16` reads the saved session. `cancelLab16` cancels a waiting turn. |
| `server/index.ts` | Routes `POST /api/lab16/run`, `GET /api/lab16/session`, and `POST /api/lab16/cancel`. |
| `src/Lab16.tsx` | Declaration editor and linter, live run, result and history, playground, code snippets, and Viva voice. |
| `src/App.tsx` | Adds the Function tools & human control stage and Lab 16. |
| `tsconfig.lab6.json` | Type-checks the tool logic and scenarios in strict mode. |

## Student challenge

Ask **When is the Lab 17 session?** three times: with **Well described**, with **Vague**, and with **No tool**. Then ask **What is a JavaScript closure?** with the well-described tool. Show the run history and explain:

- which runs requested the tool, and why;
- what the arguments were, and how they compare with the schema;
- why the general question did not need the tool.

Finally, run once with **Leave it waiting** and show the saved session's `required_actions`.

See [OpenAI Docs: Function tools](https://developers.openai.com/api/docs/guides/agents-api/tools/functions) and [Events and items](https://developers.openai.com/api/docs/guides/agents-api/sessions/events).
