# OpenAI Agents API with React — 50 hands-on labs

This is a proposed Udemy course sequence, from a first agent run to a production-ready application. **Labs 01–17 are implemented in this repository. Labs 18–50 are planned.** The Claude curriculum pasted in the conversation did not include lesson titles, so this roadmap is based on the current OpenAI Agents API rather than a lesson-by-lesson Claude mapping.

## Course approach

- **One evolving application:** students build on a React 19.3 + Vite interface and a server-side Node application. Lab 06 introduces TypeScript so later labs can teach typed API events and tool schemas.
- **One concept per lab:** explain the API feature, run a small example, inspect the resulting session or event, change one input, and verify the effect.
- **Visible evidence:** every lab ends with a screen, artifact, trace, or test result students can show in a course submission.
- **Secrets stay on the server:** the browser calls the course backend; it never receives the OpenAI API key.
- **API scope:** this course focuses on the managed **Agents API** (`client.beta.agents` in the current JavaScript SDK). The Agents SDK, Responses API, and ChatKit are related products, but their APIs and orchestration patterns should not be presented as interchangeable.

The Agents API is evolving. Before recording a lesson, verify model access, permissions, request fields, and examples against the [Agents API overview](https://developers.openai.com/api/docs/guides/agents-api/overview) and [quickstart](https://developers.openai.com/api/docs/guides/agents-api/quickstart). Use a model available to the student's project; do not rely on one model name throughout the course.

## Stage 1 — First run and conversation (Labs 01–05)

**Checkpoint:** a two-turn tutor chat that shows session state and handles a failed run. Reference: [sessions](https://developers.openai.com/api/docs/guides/agents-api/sessions) and [events and items](https://developers.openai.com/api/docs/guides/agents-api/sessions/events).

| Lab | What students learn | What they build or verify |
| --- | --- | --- |
| **01. Create your first agent** *(implemented)* | Configure a model and instructions; create a session with `environment.type: "none"`; stream the first turn. | The current programming-tutor app shows a streamed Markdown answer and completion state. |
| **02. Continue and customize** *(implemented)* | Send a follow-up to the **same** session; start a **new** session to compare different instructions. | A conversation view and a side-by-side explanation of why instructions require a new session. |
| **03. Inspect the lifecycle** *(implemented)* | Distinguish session, turn, event, and saved item IDs; recognize idle, completed, failed, and cancelled states. | A small event inspector beside the chat. |
| **04. Handle interrupted work** *(implemented)* | Show API errors, turn failures, cancellation, and a stream that disconnects before completion. | An error/retry panel that retrieves saved state before offering another run. |
| **05. Manage sessions** *(implemented)* | List, retrieve, and delete sessions; explain what should be retained. | A session history page with a working delete action. |

## Stage 2 — Reusable configuration and TypeScript (Labs 06–10)

**Checkpoint:** a typed tutor with reusable agent presets. Reference: [configuring agents](https://developers.openai.com/api/docs/guides/agents-api/configuration).

| Lab | What students learn | What they build or verify |
| --- | --- | --- |
| **06. Move the app to TypeScript** *(implemented)* | Type React state, backend requests, streamed events, and validation boundaries. | The same Lab 05 app builds with TypeScript checks. |
| **07. Save and reuse an agent** *(implemented)* | Create a saved agent and use its `agent_id` in new sessions. | A named tutor preset used by two separate sessions. |
| **08. Override one session** *(implemented)* | Apply a session-specific override without changing the saved agent. | Two sessions with different behavior from one saved preset. |
| **09. Compare models and reasoning settings** *(implemented)* | Change supported model and reasoning settings for later turns; measure quality and latency. | A comparison worksheet populated by real runs. |
| **10. Design an output contract** *(implemented)* | Give precise instructions and validate the returned data in application code. | A study-plan form that rejects malformed results and explains the repair path. |

## Stage 3 — Streaming and the React experience (Labs 11–15)

**Checkpoint:** a resilient chat interface that displays exactly what happened during a turn. Reference: [events and items](https://developers.openai.com/api/docs/guides/agents-api/sessions/events) and [session management](https://developers.openai.com/api/docs/guides/agents-api/sessions/manage).

| Lab | What students learn | What they build or verify |
| --- | --- | --- |
| **11. Render text events correctly** *(implemented)* | Combine output text deltas and replace partial buffers with completed content parts. | A response panel that handles multiple output parts without duplicated text. |
| **12. Build a turn timeline** *(implemented)* | Group status and item events by turn and display their order. | A visual timeline of one agent run. |
| **13. Recover after a disconnect** *(implemented)* | Reconnect, retrieve the session, and read saved items without blindly repeating input. | A refresh-safe answer recovery flow. |
| **14. Cancel and steer a turn** *(implemented)* | Distinguish cancellation from a message sent while work is active. | Cancel and steer controls with visible outcome states. |
| **15. Show usage and duration** *(implemented)* | Read best-effort usage and timing, treating missing usage as unknown. | A run summary with tokens, duration, and error details. |

## Stage 4 — Function tools and human control (Labs 16–20)

**Checkpoint:** a task assistant that calls server functions safely. Reference: [function tools](https://developers.openai.com/api/docs/guides/agents-api/tools/functions).

| Lab | What students learn | What they build or verify |
| --- | --- | --- |
| **16. Declare a function tool** *(implemented)* | Define a tool name, description, and input schema. | An agent that requests a course-calendar lookup. |
| **17. Complete a required action** *(implemented)* | Detect `agent.session.requires_action`, execute the function on the server, and return its result. | A full request → tool call → result → answer trace. |
| **18. Validate tool inputs** | Reject invalid arguments and handle timeouts and exceptions. | A tool test page with both valid and failing cases. |
| **19. Connect a read-only service** | Wrap a real external API in a narrow, typed function. | An agent answer grounded in live service data. |
| **20. Approve a write action** | Pause before a consequential operation and record the user's decision. | An approval screen for a simulated calendar change. |

## Stage 5 — Search, MCP, plugins, and credentials (Labs 21–25)

**Checkpoint:** a documentation assistant that can cite sources and use a controlled MCP tool set. References: [web search](https://developers.openai.com/api/docs/guides/agents-api/tools/web-search), [MCP connections](https://developers.openai.com/api/docs/guides/agents-api/tools/mcp), [plugins](https://developers.openai.com/api/docs/guides/agents-api/tools/plugins), and [vaults](https://developers.openai.com/api/docs/guides/agents-api/tools/vaults).

| Lab | What students learn | What they build or verify |
| --- | --- | --- |
| **21. Add web search** | Give the agent current information and inspect its citations. | A sourced answer with links students can open. |
| **22. Connect a public MCP server** | Add an HTTP MCP server and observe tool discovery and calls. | A docs assistant using the OpenAI documentation MCP. |
| **23. Restrict MCP tools** | Choose connection origin and limit discoverable tools with `allowed_tools`. | An allowlist test showing what the agent can and cannot call. |
| **24. Add private MCP authentication** | Attach a vault-backed credential where supported; avoid exposing secrets in React. | A private-data lookup with credential rotation notes. |
| **25. Package a reusable plugin** | Bundle a skill and MCP configuration for reuse. | A small, documented course plugin used in a new session. |

## Stage 6 — OpenAI-hosted environments and artifacts (Labs 26–30)

**Checkpoint:** an agent creates a report from an input file and the user downloads the artifact. References: [OpenAI-hosted sandboxes](https://developers.openai.com/api/docs/guides/agents-api/environments/openai-hosted) and [files and artifacts](https://developers.openai.com/api/docs/guides/agents-api/environments/files).

| Lab | What students learn | What they build or verify |
| --- | --- | --- |
| **26. Choose an environment** | Compare `none` with `openai_hosted` for question answering versus file and command work. | A two-task demonstration with the appropriate environment for each. |
| **27. Provide input files** | Stage a sample CSV or text file in a hosted environment. | A report that uses the provided file and names its source. |
| **28. Configure packages and network** | Set dependencies and disabled or restricted network access. | A reproducible run with a documented network policy. |
| **29. Create and download artifacts** | List, identify, and download a generated file. | A downloadable report in the React app. |
| **30. Clean up sandbox resources** | Understand environment lifecycle, retention, and cleanup. | A cleanup checklist verified against a completed session. |

## Stage 7 — Self-hosted environments and security (Labs 31–35)

**Checkpoint:** a file task runs in an isolated environment with explicit access limits. References: [self-hosted sandboxes](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted) and [sandbox security](https://developers.openai.com/api/docs/guides/agents-api/environments/security).

| Lab | What students learn | What they build or verify |
| --- | --- | --- |
| **31. Connect a self-hosted environment** | Supply an executor and observe the environment connection lifecycle. | A file-listing task in a disposable local sandbox. |
| **32. Limit filesystem access** | Give the agent only the files and paths needed for its task. | An access test that succeeds in the workspace and fails outside it. |
| **33. Run an environment-origin MCP server** | Connect a private or local MCP server from the environment. | A tool call that cannot be made from the public network. |
| **34. Recover an environment failure** | Handle connection loss, setup errors, and resumable session state. | A clear retry or recovery path in the UI. |
| **35. Build a guarded file assistant** | Combine scoped files, tool limits, and user review. | A proposed file change with a visible diff and approval step. |

## Stage 8 — Multi-agent work (Labs 36–40)

**Checkpoint:** a lead agent delegates two independent tasks and combines their results. Reference: [multi-agent](https://developers.openai.com/api/docs/guides/agents-api/multi-agent).

| Lab | What students learn | What they build or verify |
| --- | --- | --- |
| **36. Enable subagents** | Turn on multi-agent orchestration and identify root versus subagent work. | A root agent that delegates a bounded research task. |
| **37. Run independent tasks in parallel** | Delegate separate questions and wait for both results. | A two-source comparison assembled by the root agent. |
| **38. Display subagent progress** | Interpret subagent events without ending the UI on a child turn's completion. | A progress panel for each subagent. |
| **39. Coordinate reviewer and writer** | Assign distinct outputs and avoid shared-file conflicts. | A draft and a review report with an explicit revision step. |
| **40. Compare single and multi-agent runs** | Measure quality, duration, and token usage on the same task. | A short evidence-based recommendation on when delegation helps. |

## Stage 9 — Observability and operations (Labs 41–45)

**Checkpoint:** a deployed-like app can explain a failed run and account for its use. References: [observability and usage](https://developers.openai.com/api/docs/guides/agents-api/observability), [tracing](https://developers.openai.com/api/docs/guides/agents-api/tracing), and [session webhooks](https://developers.openai.com/api/docs/guides/agents-api/sessions/webhooks).

| Lab | What students learn | What they build or verify |
| --- | --- | --- |
| **41. Receive a webhook** | Verify signatures and handle session outcome notifications. | A server endpoint with a replay-safe event log. |
| **42. Read an agent trace** | Inspect sessions, turns, model generations, and tool spans. | A trace walkthrough for one successful and one failed run. |
| **43. Record usage carefully** | Store available token counts without treating `null` as zero or a final bill. | A usage dashboard with unknown values labeled honestly. |
| **44. Add limits and retries** | Handle rate limits, transient failures, and application spending controls. | A bounded retry policy and a per-user request budget. |
| **45. Protect user sessions** | Add authentication, ownership checks, and server-side session mapping. | A test showing one user cannot access another user's session. |

## Stage 10 — Evaluation, deployment, and capstone (Labs 46–50)

**Checkpoint:** students ship a domain-specific agent app and show evidence that it works. References: [Agents API tracing](https://developers.openai.com/api/docs/guides/agents-api/tracing), [production best practices](https://developers.openai.com/api/docs/guides/production-best-practices), and [Agents API overview](https://developers.openai.com/api/docs/guides/agents-api/overview). Labs 46–47 use a course-owned evaluation harness so the course does not depend on the [legacy Evals platform](https://developers.openai.com/api/docs/guides/evals).

| Lab | What students learn | What they build or verify |
| --- | --- | --- |
| **46. Build an evaluation dataset** | Write representative prompts, expected behaviors, and failure cases. | A versioned JSON dataset with at least 20 realistic examples. |
| **47. Run regression checks** | Use a small Node evaluation script to compare agent settings on the same examples and inspect failures. | A before-and-after report with reproducible runs. |
| **48. Test safety and tool boundaries** | Probe prompt injection, unauthorized tool use, and unsafe outputs. | A documented red-team report and fixes. |
| **49. Deploy the React and Node app** | Set secrets, health checks, logging, and access limits in a hosted environment. | A deployed app with a deployment checklist. |
| **50. Capstone: teach a domain expert** | Combine sessions, tools, files, evaluation, and observability where useful. | A working domain-specific agent, demo video, architecture diagram, and evaluation report. |

## Recording checklist for every lab

1. State the learning objective and prerequisite lab.
2. Show the exact file and API call students will change.
3. Run a successful case and one meaningful failure case.
4. Inspect the session, event, tool call, artifact, or trace that proves the feature worked.
5. Give a short student challenge and an observable completion criterion.

Some advanced labs require additional permissions, infrastructure, or API access. Provide a mock or a read-only variant where students cannot use the live resource, and label that variant clearly.

