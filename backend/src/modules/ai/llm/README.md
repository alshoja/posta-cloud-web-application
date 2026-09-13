# LLM

Resolves which model provider backs `LLM_CLIENT` for the rest of the AI module.

- Consumers inject `LLM_CLIENT` (typed as `LlmClient`), never a concrete
  provider service.
- The active provider is chosen once, at startup, from `AI_PROVIDER`
  (`ollama` by default, or `openai`).
- If `AI_PROVIDER=openai` and `OPENAI_API_KEY` is missing, startup fails with
  a clear error instead of falling back silently.
- Adding a new provider means implementing `LlmClient` in its own adapter
  folder (see `ollama/`, `openai/`) and adding one branch to the factory here
  — consumers do not change.
