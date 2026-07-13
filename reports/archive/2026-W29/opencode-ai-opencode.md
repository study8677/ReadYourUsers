# OpenCode — User Demand Report

**Week:** 2026-W29
**Generated:** 2026-07-13
**Issues analyzed:** 62 (59 included)
**Need clusters:** 10

## Top 10 User Needs

| Rank | Need | Issues | Score | Category | Examples |
| --- | --- | --- | --- | --- | --- |
| 1 | Model Provider Configuration and Integration Fixes | 14 | 0.3 | Integration | [#352](https://github.com/opencode-ai/opencode/issues/352), [#351](https://github.com/opencode-ai/opencode/issues/351), [#349](https://github.com/opencode-ai/opencode/issues/349) |
| 2 | Improve Installation, Configuration, and CLI Flexibility | 12 | 0.1 | Configuration | [#339](https://github.com/opencode-ai/opencode/issues/339), [#322](https://github.com/opencode-ai/opencode/issues/322), [#319](https://github.com/opencode-ai/opencode/issues/319) |
| 3 | Provider Integration, Model Support, and Tool Improvements | 13 | 0.1 | Integration | [#353](https://github.com/opencode-ai/opencode/issues/353), [#334](https://github.com/opencode-ai/opencode/issues/334), [#313](https://github.com/opencode-ai/opencode/issues/313) |
| 4 | Expand AI Provider Support and Error Handling | 6 | 0.1 | Integration | [#318](https://github.com/opencode-ai/opencode/issues/318), [#305](https://github.com/opencode-ai/opencode/issues/305), [#300](https://github.com/opencode-ai/opencode/issues/300) |
| 5 | Ollama Local LLM Integration Support | 2 | 0.1 | Integration | [#326](https://github.com/opencode-ai/opencode/issues/326), [#296](https://github.com/opencode-ai/opencode/issues/296) |
| 6 | Enhanced Authentication Methods and CLI Support | 4 | 0.1 | Developer Experience | [#343](https://github.com/opencode-ai/opencode/issues/343), [#335](https://github.com/opencode-ai/opencode/issues/335), [#275](https://github.com/opencode-ai/opencode/issues/275) |
| 7 | Terminal Integration and Compatibility Issues | 2 | 0.1 | Integration | [#345](https://github.com/opencode-ai/opencode/issues/345), [#331](https://github.com/opencode-ai/opencode/issues/331) |
| 8 | Fix text input and file search usability issues | 2 | 0.0 | Developer Experience | [#292](https://github.com/opencode-ai/opencode/issues/292), [#273](https://github.com/opencode-ai/opencode/issues/273) |
| 9 | Fix external LLM model provider integrations | 2 | 0.0 | Integration | [#279](https://github.com/opencode-ai/opencode/issues/279), [#252](https://github.com/opencode-ai/opencode/issues/252) |
| 10 | Windows Installation and Extraction Compatibility Fixes | 2 | 0.0 | Platform Support | [#320](https://github.com/opencode-ai/opencode/issues/320), [#306](https://github.com/opencode-ai/opencode/issues/306) |

## Category Breakdown

- **Integration**: 6 clusters
- **Developer Experience**: 2 clusters
- **Configuration**: 1 clusters
- **Platform Support**: 1 clusters

## All Need Clusters

### 1. Model Provider Configuration and Integration Fixes

Users want improved configuration support for various AI model providers including OpenRouter, Ollama, Kimi K2, GCP Anthropic, and Azure OpenAI. They also need fixes for issues with environment variables, endpoint configuration, and provider selection loops that prevent smooth integration with these providers.

- **Volume:** 14 issues (10 open, 4 closed)
- **Demand Score:** 0.3
- **Avg Reactions:** 1.3 | **Avg Comments:** 1.6
- **Example issues:** [#352](https://github.com/opencode-ai/opencode/issues/352), [#351](https://github.com/opencode-ai/opencode/issues/351), [#349](https://github.com/opencode-ai/opencode/issues/349), [#342](https://github.com/opencode-ai/opencode/issues/342), [#340](https://github.com/opencode-ai/opencode/issues/340)

### 2. Improve Installation, Configuration, and CLI Flexibility

Users are experiencing installation and setup issues across different platforms (npm, WSL/Linux) while also seeking more flexibility in how they configure and interact with the CLI. Key requests include adding alternative installation methods, fixing 'agent coder not found' errors, improving model configuration options, and enhancing input handling for special characters and multiline content.

- **Volume:** 12 issues (10 open, 2 closed)
- **Demand Score:** 0.1
- **Avg Reactions:** 1.6 | **Avg Comments:** 2.7
- **Example issues:** [#339](https://github.com/opencode-ai/opencode/issues/339), [#322](https://github.com/opencode-ai/opencode/issues/322), [#319](https://github.com/opencode-ai/opencode/issues/319), [#299](https://github.com/opencode-ai/opencode/issues/299), [#298](https://github.com/opencode-ai/opencode/issues/298)

### 3. Provider Integration, Model Support, and Tool Improvements

Users want expanded support for AI providers (GitHub Models, Kimi k2, Ollama, Copilot) along with fixes for tool calling, shell timeouts, and install scripts. These improvements address integration gaps and configuration limitations that prevent smooth operation across different environments and use cases.

- **Volume:** 13 issues (10 open, 3 closed)
- **Demand Score:** 0.1
- **Avg Reactions:** 0.2 | **Avg Comments:** 2
- **Example issues:** [#353](https://github.com/opencode-ai/opencode/issues/353), [#334](https://github.com/opencode-ai/opencode/issues/334), [#313](https://github.com/opencode-ai/opencode/issues/313), [#293](https://github.com/opencode-ai/opencode/issues/293), [#288](https://github.com/opencode-ai/opencode/issues/288)

### 4. Expand AI Provider Support and Error Handling

Users are requesting expanded support for new AI models and tools (Claude WebSearch, Sonnet 4, Opus 4 in Vertex AI) while also asking for better error handling and robustness (MCP timeouts, token limit handling, Ollama validation fixes). These needs focus on improving integrations with various AI providers and preventing application failures during provider interactions.

- **Volume:** 6 issues (6 open, 0 closed)
- **Demand Score:** 0.1
- **Avg Reactions:** 0.2 | **Avg Comments:** 0.3
- **Example issues:** [#318](https://github.com/opencode-ai/opencode/issues/318), [#305](https://github.com/opencode-ai/opencode/issues/305), [#300](https://github.com/opencode-ai/opencode/issues/300), [#290](https://github.com/opencode-ai/opencode/issues/290), [#285](https://github.com/opencode-ai/opencode/issues/285)

### 5. Ollama Local LLM Integration Support

Users want official support for using Ollama as a local LLM provider, enabling privacy-focused and cost-effective AI capabilities. They also need graceful handling when Ollama models don't support tool/function calling, rather than experiencing errors or unexpected behavior.

- **Volume:** 2 issues (2 open, 0 closed)
- **Demand Score:** 0.1
- **Avg Reactions:** 1 | **Avg Comments:** 1
- **Example issues:** [#326](https://github.com/opencode-ai/opencode/issues/326), [#296](https://github.com/opencode-ai/opencode/issues/296)

### 6. Enhanced Authentication Methods and CLI Support

Users want more flexible and secure authentication options across different services. This includes supporting environment variable authentication (OPENROUTER_API_KEY), Google Auth tokens for Gemini API, and encrypting stored credentials in auth.json. Additionally, users prefer authentication commands that work directly from the terminal instead of opening a separate UI.

- **Volume:** 4 issues (4 open, 0 closed)
- **Demand Score:** 0.1
- **Avg Reactions:** 1.5 | **Avg Comments:** 2.8
- **Example issues:** [#343](https://github.com/opencode-ai/opencode/issues/343), [#335](https://github.com/opencode-ai/opencode/issues/335), [#275](https://github.com/opencode-ai/opencode/issues/275), [#265](https://github.com/opencode-ai/opencode/issues/265)

### 7. Terminal Integration and Compatibility Issues

Users are experiencing rendering and keybinding issues when using opencode's terminal with popular terminal emulators (iTerm2) and multiplexers (tmux), as well as alternative shells (fish). These compatibility problems disrupt developer workflows and prevent seamless integration with existing terminal environments.

- **Volume:** 2 issues (2 open, 0 closed)
- **Demand Score:** 0.1
- **Avg Reactions:** 0 | **Avg Comments:** 1
- **Example issues:** [#345](https://github.com/opencode-ai/opencode/issues/345), [#331](https://github.com/opencode-ai/opencode/issues/331)

### 8. Fix text input and file search usability issues

Users are encountering usability issues with basic interactions in the development tool. One issue involves text input behavior where Shift+Enter should create new lines but doesn't work as expected. The second issue relates to file search functionality opening from the wrong directory (/home/ instead of the project directory), making it difficult to find relevant files. Both issues impact developer productivity and workflow efficiency.

- **Volume:** 2 issues (1 open, 1 closed)
- **Demand Score:** 0.0
- **Avg Reactions:** 0 | **Avg Comments:** 0.5
- **Example issues:** [#292](https://github.com/opencode-ai/opencode/issues/292), [#273](https://github.com/opencode-ai/opencode/issues/273)

### 9. Fix external LLM model provider integrations

Users are encountering bugs when integrating with external LLM model providers like OpenRouter and Ollama. Issues include Zod validation errors and incorrect API endpoint paths that prevent these providers from working correctly. Fixing these integration issues will allow users to successfully use their preferred model providers.

- **Volume:** 2 issues (1 open, 1 closed)
- **Demand Score:** 0.0
- **Avg Reactions:** 1 | **Avg Comments:** 2.5
- **Example issues:** [#279](https://github.com/opencode-ai/opencode/issues/279), [#252](https://github.com/opencode-ai/opencode/issues/252)

### 10. Windows Installation and Extraction Compatibility Fixes

Users are experiencing installation issues on Windows and need better support for bsdtar extraction by avoiding the --wildcards option. These issues stem from cross-platform compatibility problems that prevent smooth installation and extraction on Windows systems using bsdtar.

- **Volume:** 2 issues (1 open, 1 closed)
- **Demand Score:** 0.0
- **Avg Reactions:** 0 | **Avg Comments:** 0
- **Example issues:** [#320](https://github.com/opencode-ai/opencode/issues/320), [#306](https://github.com/opencode-ai/opencode/issues/306)

---

*This report analyzes public GitHub issues only. It represents a signal from public issue discussions, not the full user base.*

*Generated by [ReadYourUsers](https://github.com/study8677/ReadYourUsers)*