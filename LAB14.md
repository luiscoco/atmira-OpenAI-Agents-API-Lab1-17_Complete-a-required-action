# Lab 14 — Cancel and steer a turn

Lab 13 showed that a closed stream does not stop the agent. Lab 14 adds the controls that act on a turn while it runs. **Cancel** is an input event that ends the turn. **Steer** is an ordinary message sent while the turn is active, and it joins that turn. **Stop reading** closes only the page's stream, and the agent keeps working. The API answers 202 Accepted to a cancel or a steer, but that confirms receipt only. The page reads the saved turn to show what each control really did.

## Learning goals

1. Cancel the active turn with `agent.session.input.cancel`, and explain why the session stays usable afterwards.
2. Steer a running turn by sending `agent.session.input.message` while it is active, with an `Idempotency-Key` so that a retried click is not a second message.
3. Keep reading the stream until the session is idle, because a steer can add a second answer to the same turn or start a new turn.
4. Treat 202 Accepted as receipt, not effect, and classify each control from the saved turn status and items.
5. Distinguish a cancel from closing the stream, which sends nothing and leaves the turn running and billed.

## Run the lab

Run `npm ci`, put `OPENAI_API_KEY` in a private `.env` file, and start the app with `npm run dev`. Open **Cancel and steer a turn** in the sidebar (`#lab14`).

**Live run.** Ask for something long, such as the default 300-word explanation. While it streams, use one of the three controls:

| Control | What it sends | What to expect |
| --- | --- | --- |
| **Cancel turn** | `agent.session.input.cancel` | The turn ends as `cancelled`. Text that streamed but was not published is abandoned. |
| **Steer with this message** | `agent.session.input.message` (Idempotency-Key = control ID) | The message is saved **inside the running turn**. The agent finishes its current message, then answers the steer in the same turn. |
| **Stop reading** | Nothing. The browser aborts its own fetch. | The turn keeps running. **Follow the turn again** reattaches without sending anything. |

The page shows:

- a **run state** strip: idle, running, steer sent, cancel sent, not watching, completed, cancelled, failed;
- each streamed assistant message, marked with the point where a control left the page and how much text streamed after it;
- the **saved turns**, rebuilt from saved items, with a steer message labelled *steer, same turn* and a note when a cancelled turn saved no answer;
- a **verdict card** for each control, with its evidence;
- a timestamped event log.

Try each control late too, after the turn finished. A late cancel is **Too late**, and a late steer becomes a **New turn**.

**Control playground (no API key needed).** Pick a case and step through its events until the saved state is read:

| Case | Verdict |
| --- | --- |
| Cancel while the answer streams | Cancelled: no assistant message saved. |
| Steer while the answer streams | Steered: one turn, two user messages, two answers. |
| Cancel after the turn finished | Too late: 202 Accepted, turn still completed. |
| Steer after the turn finished | New turn: the message became a follow-up. |
| The turn cannot be steered | Rejected: `active_turn_not_steerable`. |
| Stop reading is not a cancel | Kept running: the full answer was saved. |

The event order in the cases follows runs observed while building this lab. The IDs and text are fixtures. The *cannot be steered* case is built from the error code documented in the SDK; this lab did not trigger it with environment type `none`, and the page labels it that way. The live run and the playground use the same `classifyControl` function.

Open **View code** for six snippets and explanations. **Viva voice · Read aloud** reads one explanation, and **Viva voice · Read all six** reads them in order. Both use browser speech synthesis and do not call an audio API.

## Observed behaviour

These results come from runs made while building the lab with `environment: { type: 'none' }`:

```text
cancel mid-answer   → 202; turn.cancelled ~10–25 ms later; items: user message only; session idle
steer mid-answer    → 202; the current assistant message kept streaming to its end;
                      then item.added (user, SAME turn) → a second assistant message → turn.completed
                      turns: 1 · saved messages: user, assistant, user (steer), assistant
cancel after done   → 202; no event; turn stays completed
stop reading        → nothing sent; the turn stayed in_progress, then completed with its answer saved
```

A steer does not interrupt the output being written. The agent reads it at the next step boundary. With the model's speed, a steer sent early may still see the whole first answer finish.

## Verdict rules

```ts
rejected by the API                    → rejected (active_turn_not_steerable: wait, or cancel first)
stop reading, turn still active        → still_running (reattach, or cancel)
stop reading, turn ended               → kept_running (the answer was produced and saved)
cancel, no active turn known           → nothing_to_cancel
cancel, turn cancelled                 → cancelled
cancel, turn completed or failed       → too_late
cancel, turn still active              → cancel_pending
steer, text saved in the target turn   → steered
steer, text saved in another turn      → new_turn
steer, not saved, turn active          → steer_pending
steer, not saved, turn ended           → not_saved (resend with the same Idempotency-Key)
```

## Code map

| File | Role |
| --- | --- |
| `src/lab14Controls.ts` | Pure functions: the control record, `classifyControl`, verdict labels, and `runState` for the state strip. Reuses the Lab 13 snapshot types. |
| `src/lab14Scenarios.ts` | Six scripted timelines and saved states for the playground. |
| `server/lab14.ts` | `runLab14` streams a question (or, with `follow`, reattaches) and reads until the session is idle. `controlLab14` sends a cancel or a steer and reports a refusal as data. |
| `server/index.ts` | Routes `POST /api/lab14/run` and `POST /api/lab14/control`. `GET /api/lab14/snapshot` reuses the Lab 13 read-only snapshot handler. |
| `src/Lab14.tsx` | Live run, control panel, run state strip, stream markers, saved turns, verdict cards, playground, code snippets, and Viva voice. |
| `src/App.tsx` | Adds Lab 14 to the Streaming and React stage. |
| `tsconfig.lab6.json` | Type-checks the control logic and scenarios in strict mode. |

## Student challenge

Run the same long question three times. In the first run, press **Cancel turn** after the first sentence. In the second, press **Steer with this message**. In the third, press **Stop reading**. For each run, show the verdict card and the saved turns. Explain three results:

- why the cancelled turn has no saved answer;
- why the steered run still has only one turn;
- why the unwatched turn still produced a full answer.

Finally, press **Cancel turn** after a turn has completed and explain the **Too late** verdict.

See [OpenAI Docs: Sessions](https://developers.openai.com/api/docs/guides/agents-api/sessions) ("A message sent during an active turn steers that turn") and [Events and items](https://developers.openai.com/api/docs/guides/agents-api/sessions/events).
