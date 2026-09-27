# Lab 09 — Compare models and reasoning settings

Lab 09 builds on [Lab 07](LAB07.md) and [Lab 08](LAB08.md). It uses one saved tutor agent to start two independent sessions with identical prompts. After each setup turn, the baseline keeps its inherited configuration; the updated session changes its model and reasoning effort before the same follow-up question.

## Learning goals

1. Explain that a saved agent supplies initial session settings and that `sessions.update` affects subsequent turns in one existing session.
2. Change `model` and `reasoning.effort` together when needed. A `null` effort requests the selected model's default.
3. Compare the resulting answers with a consistent human quality score, measured follow-up latency, and best-effort token usage.
4. Record the effective settings and session and turn IDs as evidence. Recognize that one run is insufficient to establish a general model ranking.

## Run the lab

Run `npm ci`, set `OPENAI_API_KEY` in a private `.env` file, and start the app with `npm run dev`. Save a tutor preset in Lab 07, then open **Compare models & reasoning** in the sidebar. The model must be available to your project, and supported reasoning efforts vary by model. The API reports an incompatible setting as an error.

## Exercise

1. Keep the two shared prompts identical. The first is a setup turn in each new session. The second is the follow-up whose answer and time you compare.
2. Choose the model and effort for the updated run. To isolate reasoning effort, keep the saved model name and change only effort. To study a model switch, enter another supported model and choose **Model default** initially.
3. Run the baseline and updated configurations. Each run creates its own session, completes the setup turn, and then sends the follow-up. The updated run calls `sessions.update` between turns.
4. Inspect the effective model and effort, session and measured turn IDs, answer, elapsed time, and available input and output tokens. A missing token count displays **unknown**.
5. Score both answers from 1 to 5 using the same accuracy, clarity, and usefulness rubric. Record concrete evidence in the notes fields and download the CSV worksheet.
6. Open **View code** for four snippets and explanations. **Viva voice · Read aloud** speaks the explanations through browser speech synthesis; it does not call an audio API.

The timer begins immediately before the follow-up input request and ends when the root turn completes. It excludes the setup turn and configuration update, but includes network and server waiting time. Outputs can vary between identical runs. Repeat a pair before drawing a strong conclusion about latency or quality. A failed update leaves the baseline usable and shows the API error rather than a fabricated result.

## Code map

| File | Role |
| --- | --- |
| `server/lab9.ts` | Validates inputs, creates and completes a setup turn, updates one session, streams the follow-up, and reports metrics. |
| `server/index.ts` | Routes `POST /api/lab9/run`. |
| `src/Lab9.tsx` | Runs the comparison, renders the worksheet, exports CSV, and teaches the code with Viva voice. |
| `src/App.tsx` | Adds desktop and mobile Lab 09 navigation. |
| `src/styles.css` | Styles the inputs, results, and worksheet. |

See [OpenAI Docs: Configuring Agents](https://developers.openai.com/api/docs/guides/agents-api/configuration) for the rules on updating one session and [Run and continue sessions](https://developers.openai.com/api/docs/guides/agents-api/sessions) for follow-up turns.
