# Continue — 用户需求报告

**周:** 2026-W14
**生成日期:** 2026-04-03
**分析 Issue 数:** 38 (34 纳入分析)
**需求簇:** 7

## Top 10 用户需求

| 排名 | 需求 | Issue 数 | 得分 | 分类 | 示例 |
| --- | --- | --- | --- | --- | --- |
| 1 | Bug Fixes and Documentation for Multi-Provider Integration | 11 | 2.1 | Developer Experience | [#11999](https://github.com/continuedev/continue/issues/11999), [#11985](https://github.com/continuedev/continue/issues/11985), [#11978](https://github.com/continuedev/continue/issues/11978) |
| 2 | Document config profiles and improve API error handling | 7 | 1.9 | Developer Experience | [#12026](https://github.com/continuedev/continue/issues/12026), [#12004](https://github.com/continuedev/continue/issues/12004), [#11968](https://github.com/continuedev/continue/issues/11968) |
| 3 | Fix API Provider Authentication and Key Configuration | 4 | 1.9 | Configuration | [#12008](https://github.com/continuedev/continue/issues/12008), [#11961](https://github.com/continuedev/continue/issues/11961), [#11956](https://github.com/continuedev/continue/issues/11956) |
| 4 | Fix Response Streaming and Error Handling Bugs | 4 | 1.9 | Reliability | [#11994](https://github.com/continuedev/continue/issues/11994), [#11983](https://github.com/continuedev/continue/issues/11983), [#11926](https://github.com/continuedev/continue/issues/11926) |
| 5 | Fix IDE stability and reliability issues | 3 | 1.4 | Reliability | [#11959](https://github.com/continuedev/continue/issues/11959), [#11932](https://github.com/continuedev/continue/issues/11932), [#11919](https://github.com/continuedev/continue/issues/11919) |
| 6 | Fix Tool Calling Reliability Across AI Providers | 3 | 0.0 | Reliability | [#11976](https://github.com/continuedev/continue/issues/11976), [#11964](https://github.com/continuedev/continue/issues/11964), [#11929](https://github.com/continuedev/continue/issues/11929) |
| 7 | Fix IntelliJ extension resource limits and CPU usage | 2 | 0.0 | Performance | [#11977](https://github.com/continuedev/continue/issues/11977), [#11966](https://github.com/continuedev/continue/issues/11966) |

## 上升最快的需求

| 需求 | 上升倍率 | 本周 | 分类 |
| --- | --- | --- | --- |
| Document config profiles and improve API error handling | 8.0x | 7 | Developer Experience |
| Fix API Provider Authentication and Key Configuration | 5.0x | 4 | Configuration |
| Fix IntelliJ extension resource limits and CPU usage | 3.0x | 2 | Performance |
| Bug Fixes and Documentation for Multi-Provider Integration | 1.6x | 11 | Developer Experience |
| Fix IDE stability and reliability issues | 1.5x | 3 | Reliability |

## 分类分布

- **Reliability**: 3 个簇
- **Developer Experience**: 2 个簇
- **Configuration**: 1 个簇
- **Performance**: 1 个簇

## 所有需求簇

### 1. Bug Fixes and Documentation for Multi-Provider Integration

Users are requesting various bug fixes to improve reliability across different LLM providers (OpenAI, Ollama, LM Studio, OpenRouter) and IDE integrations (IntelliJ/JetBrains). These issues affect core functionality like streaming, tool calls, file editing, and process management. Additionally, users need documentation for CLI commands and provider-specific API headers.

- **数量:** 11 条 issue (7 未关闭, 4 已关闭)
- **需求得分:** 2.1
- **平均反应:** 0.3 | **平均评论:** 0.3
- **示例 Issue:** [#11999](https://github.com/continuedev/continue/issues/11999), [#11985](https://github.com/continuedev/continue/issues/11985), [#11978](https://github.com/continuedev/continue/issues/11978), [#11962](https://github.com/continuedev/continue/issues/11962), [#11960](https://github.com/continuedev/continue/issues/11960)

### 2. Document config profiles and improve API error handling

Users need comprehensive documentation for the `.continue/configs/` directory feature that supports local configuration profiles, making it easier to discover and use this functionality. Additionally, users want better error handling and visibility for API-related issues including maxTokens edge cases near context limits, API usage limits, and proxy connection failures so they are warned rather than experiencing silent failures.

- **数量:** 7 条 issue (6 未关闭, 1 已关闭)
- **需求得分:** 1.9
- **平均反应:** 0 | **平均评论:** 0.3
- **示例 Issue:** [#12026](https://github.com/continuedev/continue/issues/12026), [#12004](https://github.com/continuedev/continue/issues/12004), [#11968](https://github.com/continuedev/continue/issues/11968), [#11963](https://github.com/continuedev/continue/issues/11963), [#11944](https://github.com/continuedev/continue/issues/11944)

### 3. Fix API Provider Authentication and Key Configuration

Users are experiencing issues with API authentication across multiple providers (Gemini, Anthropic, continue-proxy). Issues include authentication errors, API key configuration lookup failures, and the system not properly using user-provided keys over proxy credits. Users need reliable API key handling and support for custom request headers to successfully connect to external AI providers.

- **数量:** 4 条 issue (4 未关闭, 0 已关闭)
- **需求得分:** 1.9
- **平均反应:** 0 | **平均评论:** 1
- **示例 Issue:** [#12008](https://github.com/continuedev/continue/issues/12008), [#11961](https://github.com/continuedev/continue/issues/11961), [#11956](https://github.com/continuedev/continue/issues/11956), [#11952](https://github.com/continuedev/continue/issues/11952)

### 4. Fix Response Streaming and Error Handling Bugs

Users are encountering multiple bugs that affect the reliability of the application: incorrect item emission ordering when using reasoning-enabled models, premature close errors during streaming, unhelpful 'Unknown error' messages for API quota issues, and 404 errors with certain Claude models. These issues cause unexpected failures and poor user experience during normal operation.

- **数量:** 4 条 issue (2 未关闭, 2 已关闭)
- **需求得分:** 1.9
- **平均反应:** 0 | **平均评论:** 0.5
- **示例 Issue:** [#11994](https://github.com/continuedev/continue/issues/11994), [#11983](https://github.com/continuedev/continue/issues/11983), [#11926](https://github.com/continuedev/continue/issues/11926), [#11925](https://github.com/continuedev/continue/issues/11925)

### 5. Fix IDE stability and reliability issues

Users are experiencing critical reliability issues when using the IDE including crashes while editing files, rendering problems in Firefox with code-server, and document tracking errors when switching between text editors. These bugs prevent users from effectively using the IDE in various environments and workflows.

- **数量:** 3 条 issue (3 未关闭, 0 已关闭)
- **需求得分:** 1.4
- **平均反应:** 0.3 | **平均评论:** 0.3
- **示例 Issue:** [#11959](https://github.com/continuedev/continue/issues/11959), [#11932](https://github.com/continuedev/continue/issues/11932), [#11919](https://github.com/continuedev/continue/issues/11919)

### 6. Fix Tool Calling Reliability Across AI Providers

Users are experiencing critical failures when using tool calling features across different AI providers (OpenAI o1/o3-mini, Claude Opus 4.6) and environments (JetBrains IDEs, Android Studio). Issues include 500 API errors, execution hangs, and message sequencing problems that prevent tools from working properly. These reliability issues block developers from using essential functionality in their workflows.

- **数量:** 3 条 issue (2 未关闭, 1 已关闭)
- **需求得分:** 0.0
- **平均反应:** 0 | **平均评论:** 0
- **示例 Issue:** [#11976](https://github.com/continuedev/continue/issues/11976), [#11964](https://github.com/continuedev/continue/issues/11964), [#11929](https://github.com/continuedev/continue/issues/11929)

### 7. Fix IntelliJ extension resource limits and CPU usage

Users are experiencing the IntelliJ extension becoming unresponsive due to high CPU usage and unbounded file search results causing token overflow. These resource consumption issues make the extension unreliable and unusable during development. Users want fixes to prevent resource exhaustion and maintain stable extension performance.

- **数量:** 2 条 issue (2 未关闭, 0 已关闭)
- **需求得分:** 0.0
- **平均反应:** 0 | **平均评论:** 0
- **示例 Issue:** [#11977](https://github.com/continuedev/continue/issues/11977), [#11966](https://github.com/continuedev/continue/issues/11966)

---

*本报告仅分析公开 GitHub Issues，代表的是公开讨论中的需求信号，并非全部用户的声音。*

*由 [ReadYourUsers](https://github.com/study8677/ReadYourUsers) 生成*