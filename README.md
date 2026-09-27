# OpenAI Agents API: Labs 01–17

This React and Node app introduces the OpenAI Agents API through seventeen hands-on labs. The Node server keeps the API key private and streams agent responses to the browser.

## Lab 01 — Create your first agent

Build a programming tutor with a model and instructions. Each question creates a new session, and the app displays the answer as events arrive. The lab introduces agents, sessions, turns, and streaming, with code explanations in the interface. See [LAB01.md](LAB01.md) for the implementation walkthrough and key code snippets.

## Lab 02 — Continue and customize

Ask follow-up questions in the same session so the tutor can use earlier messages as context. Then edit the tutor's instructions and start a new session to compare its answers. See [LAB02.md](LAB02.md) for the walkthrough.

## Lab 03 — Inspect the lifecycle

Use the live event inspector to compare session, turn, event, and saved item IDs, and read the turn outcome. See [LAB03.md](LAB03.md) for the exercise.

## Lab 04 — Handle interrupted work

Inspect API errors, cancellation, and a simulated stream disconnect. Retrieve saved session state before retrying. See [LAB04.md](LAB04.md) for the walkthrough.

## Lab 05 — Manage sessions

List, retrieve, and delete sessions in a paginated history view. The teaching section includes explained code snippets and Viva voice read-aloud controls. See [LAB05.md](LAB05.md) for the walkthrough.


## Lab 06 — Move to TypeScript

Run the typed tutor, inspect validated streamed events, and test a malformed event at the runtime boundary. The teaching section has four explained snippets and Viva voice read-aloud controls. See [LAB06.md](LAB06.md) for the walkthrough.

## Lab 07 — Save and reuse an agent

Create a named tutor preset, retrieve it after a reload, and use its `agent_id` for two new sessions. The teaching section has explained code snippets and Viva voice controls. See [LAB07.md](LAB07.md) for the walkthrough.

## Lab 08 — Override one session

Use the same saved agent for a baseline session and a session with appended instructions. Compare their results, then retrieve the saved preset to verify it is unchanged. The teaching section has explained code snippets and Viva voice controls. See [LAB08.md](LAB08.md) for the walkthrough.

## Lab 09 — Compare models and reasoning settings

Run the same setup and follow-up prompts in two sessions. Update one session's model and reasoning effort before its follow-up, then compare answers, latency, and available usage in a downloadable worksheet. The teaching section includes explained code snippets and Viva voice controls. See [LAB09.md](LAB09.md) for the walkthrough.

## Lab 10 — Design an output contract

Generate a study plan from a saved tutor preset, validate every field on the server, and inspect one repair attempt when output is malformed. An offline playground demonstrates both rejection and acceptance. The teaching section includes explained code snippets and Viva voice controls. See [LAB10.md](LAB10.md) for the walkthrough.

## Lab 11 — Render text events correctly

Stream one answer through a naive renderer and a keyed text buffer side by side. Deltas are kept per content part, replayed events are skipped, and each part is replaced by its completed text. A step-through replayer needs no API key and shows interleaved parts, commentary, and a replayed delta. The teaching section includes five explained snippets and Viva voice controls. See [LAB11.md](LAB11.md) for the walkthrough.

## Lab 12 — Build a turn timeline

Record every event of a live session as metadata and group it by turn: a session lane, one lane per root or subagent turn, and numbered events in arrival order. Send a follow-up to add a second turn to the same session. A step-through replayer needs no API key and shows text deltas without a `turn_id`, two turns in one session, a subagent turn inside the root turn, and a failed turn with replayed and late events. The teaching section includes six explained snippets and Viva voice controls. See [LAB12.md](LAB12.md) for the walkthrough.

## Lab 13 — Recover after a disconnect

Break a live stream with a simulated drop, the Disconnect button, or a page reload, and recover without repeating input. The page saves a pending request with a request ID before sending. The server tags the work with that ID, using session metadata or an `Idempotency-Key`. After a disconnect, the page reads the saved session, turns, and items. It then reattaches to a running turn, shows a saved answer, or sends again with the same ID. A recovery playground needs no API key and walks through six cases, including a blind retry that duplicated a question. The teaching section includes six explained snippets and Viva voice controls. See [LAB13.md](LAB13.md) for the walkthrough.

## Lab 14 — Cancel and steer a turn

Start a long answer, then act on it while it streams. **Cancel turn** sends `agent.session.input.cancel`, and the turn ends as cancelled with its unpublished text abandoned. **Steer** sends an ordinary message while the turn is active, and it joins the same turn instead of starting a new one. **Stop reading** only closes the page's stream: the agent keeps working, and **Follow the turn again** reattaches without sending anything. The API answers 202 Accepted to a cancel or a steer, so the page reads the saved turn and gives each control a verdict: cancelled, too late, steered, new turn, rejected, or kept running. A run state strip and stream markers show where each control landed. A control playground needs no API key and steps through six cases. The teaching section includes six explained snippets and Viva voice controls. See [LAB14.md](LAB14.md) for the walkthrough.

## Lab 15 — Show usage and duration

End every run with a summary a person can trust. Choose how a run ends: normal, cancelled after 160 characters, an unknown model, or stopped reading early. The summary then shows its tokens (input, cached, output, reasoning, total), where the time went, consistency checks, and error details with retry advice. Usage is best effort, so missing usage is shown as **unknown**, never 0. The page re-reads the saved turn because recorded usage may change. The run history sets an honest total (`≥`, with unknown runs counted) beside a naive total that adds `null` as 0. A playground needs no API key and walks through seven runs. The teaching section includes six explained snippets and Viva voice controls. See [LAB15.md](LAB15.md) for the walkthrough.

## Lab 16 — Declare a function tool

Give the agent a course-calendar lookup it can ask for. Edit a function tool's name, description, and JSON Schema. A linter blocks errors and warns about weak wording, and the page shows exactly what the server sends in `agent.tools`. Then run a question and watch the agent's request arrive: a `function_call` item with a `call_id` and arguments, followed by `agent.session.requires_action`. The page parses the arguments and compares them with the schema. The run is then cancelled, or left waiting so you can read the saved session's `required_actions`. Compare well-described, vague, loose, and absent tools in a run history. A playground needs no API key and walks through six cases. The teaching section includes six explained snippets and Viva voice controls. See [LAB16.md](LAB16.md) for the walkthrough.

## Lab 17 — Complete a required action

Finish the loop Lab 16 started. The server detects `agent.session.requires_action`, reads the waiting calls from `required_actions`, checks each name and its arguments, runs the course-calendar lookup, and sends `agent.session.input.tool_result` with the same `call_id` and `turn_id`. It then keeps reading the same stream until the agent answers. Choose **Run the function** or **Report a failure** (`success: false` with an error), and **Answer automatically** or **Step through**, which stops at the pause until you press the button. The result shows a five-stage flow, a timed trace (prompt → call → result → answer), each call paired with the event that answered it, and the saved session items. A function bench and a six-case playground need no API key. The teaching section includes six explained snippets and Viva voice controls. See [LAB17.md](LAB17.md) for the walkthrough.
