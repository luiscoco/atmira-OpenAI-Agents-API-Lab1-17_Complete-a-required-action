# Lab 12 — Build a turn timeline

Lab 11 rendered the text of one answer. Lab 12 shows the whole run: every session, turn, item, and text event, grouped by the turn it belongs to and numbered in arrival order. The result is a visual timeline of one agent run, and of later turns in the same session.

## Learning goals

1. Separate session-level events (`agent.session.*` status, environment, and subagent lifecycle) from turn-level events (`turn.*`, `turn.item.*`, text and reasoning events).
2. Assign each event to a turn: use its `turn_id`, and when a text event has none, use the turn in which its item started.
3. Number events in arrival order, skip an event ID that was already placed, and record when the server received each event.
4. Flag events that are out of place: a turn first seen without `turn.created`, or an item or text event after its turn ended.
5. End a run on the **root** turn's `completed`, `failed`, or `cancelled` event, not on a subagent turn, and observe `agent.session.idle` after it.

## Run the lab

Run `npm ci`, put `OPENAI_API_KEY` in a private `.env` file, and start the app with `npm run dev`. Open **Build a turn timeline** in the sidebar.

**Live run.** Enter a question and choose **Run and record**. The server creates a session and forwards every event as metadata only: type, event ID, turn ID, item ID and type, status, and a short detail such as `+12 chars`. It does not forward prompt or answer text in these events. After the root turn ends, the server keeps reading for up to three seconds to capture `agent.session.idle`. Choose **Send follow-up (same session)** to add a second root turn. The timeline then shows one session lane and two turn lanes.

The timeline has three views of the same data:

| View | What it shows |
| --- | --- |
| Summary tiles | Events placed, root and subagent turns, replays skipped, and the latest root outcome. |
| Swimlanes | One lane per turn plus a session lane. Each dot is an event at its sequence position; the bar shows a turn's span. |
| Turn cards | Every event in the lane with its sequence number, time since the first event, type, and metadata. Consecutive deltas can be collapsed into one row. |

**Step-through replay (no API key needed).** Choose a scripted sequence and place one event at a time:

| Sequence | What it shows |
| --- | --- |
| One turn, start to finish | Session events around one root turn. Text deltas have no `turn_id` and are placed by their item. |
| Two turns in one session | A follow-up adds a second root turn; session events sit between the turns. |
| A subagent inside the root turn | The subagent turn completes first. The run ends only when the root turn completes. |
| Failed turn, replayed and late events | One event arrives twice and is skipped; a delta after `turn.failed` is flagged. |

The sequences are scripted teaching fixtures in the same shape the server forwards, not recordings. Choose **Replay these events step by step** after a live run to replay your own session.

Open **View code** for six snippets and explanations. **Viva voice · Read aloud** reads one explanation; **Viva voice · Read all six** reads them in order. Both use browser speech synthesis and do not call an audio API.

## Timeline rules

```ts
seen(eventId)        → skip, count as a replay
turnId               = event.turn_id ?? turnOfItem[event.item_id] ?? null   // null → session lane
seq                  = arrival order after replays are skipped
run outcome          = root turn completed | failed | cancelled             // subagent turns do not end the run
after the outcome    → wait briefly for agent.session.idle
```

Times are when the **server received** each event. Stream events carry no timestamp of their own, so use these times to compare phases of one run, not as exact model latency. Lab 15 covers usage and duration.

## Code map

| File | Role |
| --- | --- |
| `src/lab12Timeline.ts` | Pure functions: event categories, turn assignment, replay skipping, sequence numbers, order warnings, delta collapsing, and runtime validation. |
| `src/lab12Scenarios.ts` | Four scripted event sequences for the replayer. |
| `server/lab12.ts` | Normalizes each SDK event to timeline metadata, forwards it as NDJSON, ends on the root turn outcome, and waits for idle. For follow-ups, it lists earlier turns first so a replayed outcome cannot end the new run. |
| `server/index.ts` | Routes `POST /api/lab12/run`. |
| `src/Lab12.tsx` | Live run and follow-up, summary tiles, swimlanes, turn cards, step-through replayer, code snippets, and Viva voice. |
| `src/App.tsx` | Adds Lab 12 to the Streaming and React stage. |
| `tsconfig.lab6.json` | Type-checks the timeline and scenarios in strict mode. |

## Student challenge

Step through **A subagent inside the root turn** and explain why the run is not finished when the subagent turn completes. Then run a live question and a follow-up in the same session. Show that the timeline has one session lane and two root turns, record both turn IDs, and name the event that ended each turn. Finally, remove the `?? fromItem` fallback in `buildTimeline`, replay **One turn, start to finish**, and explain where the text deltas went. Revert the change.

See [OpenAI Docs: Events and items](https://developers.openai.com/api/docs/guides/agents-api/sessions/events) for the event reference.
