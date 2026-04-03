# Continue — User Demand Report

**Week:** 2026-W14
**Generated:** 2026-04-03
**Issues analyzed:** 38 (34 included)
**Need clusters:** 7

## Top 10 User Needs

| Rank | Need | Issues | Score | Category | Examples |
| --- | --- | --- | --- | --- | --- |
| 1 | Bug Fixes and Documentation for Multi-Provider Integration | 11 | 2.1 | Developer Experience | [#11999](https://github.com/continuedev/continue/issues/11999), [#11985](https://github.com/continuedev/continue/issues/11985), [#11978](https://github.com/continuedev/continue/issues/11978) |
| 2 | Document config profiles and improve API error handling | 7 | 1.9 | Developer Experience | [#12026](https://github.com/continuedev/continue/issues/12026), [#12004](https://github.com/continuedev/continue/issues/12004), [#11968](https://github.com/continuedev/continue/issues/11968) |
| 3 | Fix API Provider Authentication and Key Configuration | 4 | 1.9 | Configuration | [#12008](https://github.com/continuedev/continue/issues/12008), [#11961](https://github.com/continuedev/continue/issues/11961), [#11956](https://github.com/continuedev/continue/issues/11956) |
| 4 | Fix Response Streaming and Error Handling Bugs | 4 | 1.9 | Reliability | [#11994](https://github.com/continuedev/continue/issues/11994), [#11983](https://github.com/continuedev/continue/issues/11983), [#11926](https://github.com/continuedev/continue/issues/11926) |
| 5 | Fix IDE stability and reliability issues | 3 | 1.4 | Reliability | [#11959](https://github.com/continuedev/continue/issues/11959), [#11932](https://github.com/continuedev/continue/issues/11932), [#11919](https://github.com/continuedev/continue/issues/11919) |
| 6 | Fix Tool Calling Reliability Across AI Providers | 3 | 0.0 | Reliability | [#11976](https://github.com/continuedev/continue/issues/11976), [#11964](https://github.com/continuedev/continue/issues/11964), [#11929](https://github.com/continuedev/continue/issues/11929) |
| 7 | Fix IntelliJ extension resource limits and CPU usage | 2 | 0.0 | Performance | [#11977](https://github.com/continuedev/continue/issues/11977), [#11966](https://github.com/continuedev/continue/issues/11966) |

## Rising Needs

| Need | Rising Score | This Week | Category |
| --- | --- | --- | --- |
| Document config profiles and improve API error handling | 8.0x | 7 | Developer Experience |
| Fix API Provider Authentication and Key Configuration | 5.0x | 4 | Configuration |
| Fix IntelliJ extension resource limits and CPU usage | 3.0x | 2 | Performance |
| Bug Fixes and Documentation for Multi-Provider Integration | 1.6x | 11 | Developer Experience |
| Fix IDE stability and reliability issues | 1.5x | 3 | Reliability |

## Category Breakdown

- **Reliability**: 3 clusters
- **Developer Experience**: 2 clusters
- **Configuration**: 1 clusters
- **Performance**: 1 clusters

## All Need Clusters

### 1. Bug Fixes and Documentation for Multi-Provider Integration

Users are requesting various bug fixes to improve reliability across different LLM providers (OpenAI, Ollama, LM Studio, OpenRouter) and IDE integrations (IntelliJ/JetBrains). These issues affect core functionality like streaming, tool calls, file editing, and process management. Additionally, users need documentation for CLI commands and provider-specific API headers.

- **Volume:** 11 issues (7 open, 4 closed)
- **Demand Score:** 2.1
- **Avg Reactions:** 0.3 | **Avg Comments:** 0.3
- **Example issues:** [#11999](https://github.com/continuedev/continue/issues/11999), [#11985](https://github.com/continuedev/continue/issues/11985), [#11978](https://github.com/continuedev/continue/issues/11978), [#11962](https://github.com/continuedev/continue/issues/11962), [#11960](https://github.com/continuedev/continue/issues/11960)

### 2. Document config profiles and improve API error handling

Users need comprehensive documentation for the `.continue/configs/` directory feature that supports local configuration profiles, making it easier to discover and use this functionality. Additionally, users want better error handling and visibility for API-related issues including maxTokens edge cases near context limits, API usage limits, and proxy connection failures so they are warned rather than experiencing silent failures.

- **Volume:** 7 issues (6 open, 1 closed)
- **Demand Score:** 1.9
- **Avg Reactions:** 0 | **Avg Comments:** 0.3
- **Example issues:** [#12026](https://github.com/continuedev/continue/issues/12026), [#12004](https://github.com/continuedev/continue/issues/12004), [#11968](https://github.com/continuedev/continue/issues/11968), [#11963](https://github.com/continuedev/continue/issues/11963), [#11944](https://github.com/continuedev/continue/issues/11944)

### 3. Fix API Provider Authentication and Key Configuration

Users are experiencing issues with API authentication across multiple providers (Gemini, Anthropic, continue-proxy). Issues include authentication errors, API key configuration lookup failures, and the system not properly using user-provided keys over proxy credits. Users need reliable API key handling and support for custom request headers to successfully connect to external AI providers.

- **Volume:** 4 issues (4 open, 0 closed)
- **Demand Score:** 1.9
- **Avg Reactions:** 0 | **Avg Comments:** 1
- **Example issues:** [#12008](https://github.com/continuedev/continue/issues/12008), [#11961](https://github.com/continuedev/continue/issues/11961), [#11956](https://github.com/continuedev/continue/issues/11956), [#11952](https://github.com/continuedev/continue/issues/11952)

### 4. Fix Response Streaming and Error Handling Bugs

Users are encountering multiple bugs that affect the reliability of the application: incorrect item emission ordering when using reasoning-enabled models, premature close errors during streaming, unhelpful 'Unknown error' messages for API quota issues, and 404 errors with certain Claude models. These issues cause unexpected failures and poor user experience during normal operation.

- **Volume:** 4 issues (2 open, 2 closed)
- **Demand Score:** 1.9
- **Avg Reactions:** 0 | **Avg Comments:** 0.5
- **Example issues:** [#11994](https://github.com/continuedev/continue/issues/11994), [#11983](https://github.com/continuedev/continue/issues/11983), [#11926](https://github.com/continuedev/continue/issues/11926), [#11925](https://github.com/continuedev/continue/issues/11925)

### 5. Fix IDE stability and reliability issues

Users are experiencing critical reliability issues when using the IDE including crashes while editing files, rendering problems in Firefox with code-server, and document tracking errors when switching between text editors. These bugs prevent users from effectively using the IDE in various environments and workflows.

- **Volume:** 3 issues (3 open, 0 closed)
- **Demand Score:** 1.4
- **Avg Reactions:** 0.3 | **Avg Comments:** 0.3
- **Example issues:** [#11959](https://github.com/continuedev/continue/issues/11959), [#11932](https://github.com/continuedev/continue/issues/11932), [#11919](https://github.com/continuedev/continue/issues/11919)

### 6. Fix Tool Calling Reliability Across AI Providers

Users are experiencing critical failures when using tool calling features across different AI providers (OpenAI o1/o3-mini, Claude Opus 4.6) and environments (JetBrains IDEs, Android Studio). Issues include 500 API errors, execution hangs, and message sequencing problems that prevent tools from working properly. These reliability issues block developers from using essential functionality in their workflows.

- **Volume:** 3 issues (2 open, 1 closed)
- **Demand Score:** 0.0
- **Avg Reactions:** 0 | **Avg Comments:** 0
- **Example issues:** [#11976](https://github.com/continuedev/continue/issues/11976), [#11964](https://github.com/continuedev/continue/issues/11964), [#11929](https://github.com/continuedev/continue/issues/11929)

### 7. Fix IntelliJ extension resource limits and CPU usage

Users are experiencing the IntelliJ extension becoming unresponsive due to high CPU usage and unbounded file search results causing token overflow. These resource consumption issues make the extension unreliable and unusable during development. Users want fixes to prevent resource exhaustion and maintain stable extension performance.

- **Volume:** 2 issues (2 open, 0 closed)
- **Demand Score:** 0.0
- **Avg Reactions:** 0 | **Avg Comments:** 0
- **Example issues:** [#11977](https://github.com/continuedev/continue/issues/11977), [#11966](https://github.com/continuedev/continue/issues/11966)

---

*This report analyzes public GitHub issues only. It represents a signal from public issue discussions, not the full user base.*

*Generated by [ReadYourUsers](https://github.com/study8677/ReadYourUsers)*