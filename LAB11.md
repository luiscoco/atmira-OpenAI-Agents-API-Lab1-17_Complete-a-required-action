# Lab 11 — Render text events correctly

Lab 11 opens the **Streaming and React** stage. Earlier labs rendered streamed text with a small map inside the server. This lab moves that logic into a pure, typed reducer in the browser. It then compares the reducer with a naive renderer that appends everything it receives.

## Learning goals

1. Explain the text event sequence for one message: `item.added`, `content_part.added`, `output_text.delta`, `output_text.done`, `content_part.done`, and `item.done`.
2. Keep a separate buffer for each content part, keyed by `item_id` and `content_index`.
3. Append deltas to their own part and skip an event ID that was already applied.
4. Replace a part's streamed buffer with its completed text instead of appending the completed text.
5. Render parts by `output_index` and `content_index`, not by arrival order, and show `commentary` messages apart from the `final_answer`.

## Run the lab

Run `npm ci`, put `OPENAI_API_KEY` in a private `.env` file, and start the app with `npm run dev`. Open **Render text events** in the sidebar.

**Live run.** Enter a question and choose **Run and compare**. The server creates a session, forwards the root turn's message and text events, and stops on `turn.completed`. Panel A (naive append) adds every delta and every `output_text.done` text in arrival order. Panel B (keyed buffer) runs the reducer. After the turn completes, the content-part table shows each part's key, phase, delta count, and whether its completed text matched the deltas or replaced them. Choose **Replay this run step by step** to load the recorded events into the replayer.

**Step-through replay (no API key needed).** Choose a scripted sequence and apply one event at a time:

| Sequence | What it shows |
| --- | --- |
| Two content parts, interleaved | Deltas from parts 0 and 1 alternate. Panel A mixes them; panel B keeps them separate and in order. |
| Commentary, then the final answer | Two message items with different phases. Panel B shows commentary as working notes. |
| Replayed delta, missing delta | One delta arrives twice and one never arrives. Panel B skips the replay by event ID, and the completed text repairs the missing words. |

The sequences are scripted teaching fixtures in the same shape the server forwards, not recordings. A live answer often has one message with one content part, so use the fixtures to see multi-part behavior.

Open **View code** for five snippets and explanations. **Viva voice · Read aloud** reads one explanation; **Viva voice · Read all five** reads them in order. Both use browser speech synthesis and do not call an audio API.

## Rendering rules

```ts
key     = `${itemId}:${contentIndex}`        // one buffer per content part
delta   → part.text += delta                  // once per event ID, only while streaming
done    → part.text  = completed text         // output_text.done, content_part.done, item.done
render  → sort by outputIndex, contentIndex   // join parts of one message, blank line between messages
```

The done events are authoritative. Appending both the deltas and the completed text is the duplicated-text bug shown in panel A. If the stream closes before `turn.completed`, the rendered text may be partial. Lab 13 covers recovering saved items after a disconnect.

## Code map

| File | Role |
| --- | --- |
| `src/lab11TextBuffer.ts` | Pure reducer: event validation, part keys, delta append, replay check, replacement, ordering, and phase-aware rendering. Also computes the naive output for comparison. |
| `src/lab11Scenarios.ts` | Three scripted event sequences for the replayer. |
| `server/lab11.ts` | Streams a session and forwards only the root turn's message and text fields as NDJSON. |
| `server/index.ts` | Routes `POST /api/lab11/run`. |
| `src/Lab11.tsx` | Live run, side-by-side comparison, content-part table, step-through replayer, code snippets, and Viva voice. |
| `src/App.tsx` | Adds the Streaming and React sidebar stage and Lab 11 navigation. |
| `tsconfig.lab6.json` | Type-checks the reducer and scenarios in strict mode. |

## Student challenge

Step through **Replayed delta, missing delta** and explain, event by event, why panels A and B differ. Then change `finalizePart` in `src/lab11TextBuffer.ts` to append instead of replace, and confirm that panel B now duplicates text too. Revert the change, run a live answer, and show that panel B matches the completed text in the content-part table. Record the session ID and root turn ID.

See [OpenAI Docs: Events and items](https://developers.openai.com/api/docs/guides/agents-api/sessions/events) for the event reference.
