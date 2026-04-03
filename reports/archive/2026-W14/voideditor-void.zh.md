# Void — 用户需求报告

**周:** 2026-W14
**生成日期:** 2026-04-03
**分析 Issue 数:** 50 (42 纳入分析)
**需求簇:** 11

## Top 10 用户需求

| 排名 | 需求 | Issue 数 | 得分 | 分类 | 示例 |
| --- | --- | --- | --- | --- | --- |
| 1 | Enhanced AI provider configuration and authentication | 3 | 0.7 | Configuration | [#952](https://github.com/voideditor/void/issues/952), [#892](https://github.com/voideditor/void/issues/892), [#886](https://github.com/voideditor/void/issues/886) |
| 2 | Fix UI rendering and interaction bugs | 3 | 0.6 | UI/UX | [#939](https://github.com/voideditor/void/issues/939), [#938](https://github.com/voideditor/void/issues/938), [#914](https://github.com/voideditor/void/issues/914) |
| 3 | Expand AI Provider Integration and Capabilities | 9 | 0.4 | Integration | [#906](https://github.com/voideditor/void/issues/906), [#894](https://github.com/voideditor/void/issues/894), [#891](https://github.com/voideditor/void/issues/891) |
| 4 | MCP Server Integration Fixes and Features | 6 | 0.3 | Integration | [#945](https://github.com/voideditor/void/issues/945), [#907](https://github.com/voideditor/void/issues/907), [#899](https://github.com/voideditor/void/issues/899) |
| 5 | Critical Bug Fixes for Core Functionality | 4 | 0.3 | Developer Experience | [#924](https://github.com/voideditor/void/issues/924), [#898](https://github.com/voideditor/void/issues/898), [#890](https://github.com/voideditor/void/issues/890) |
| 6 | Build environment and tooling configuration | 2 | 0.2 | Developer Experience | [#931](https://github.com/voideditor/void/issues/931), [#882](https://github.com/voideditor/void/issues/882) |
| 7 | Enhanced AI provider and model configuration options | 4 | 0.2 | Configuration | [#905](https://github.com/voideditor/void/issues/905), [#904](https://github.com/voideditor/void/issues/904), [#887](https://github.com/voideditor/void/issues/887) |
| 8 | Improve IDE interface controls and interactions | 4 | 0.2 | Developer Experience | [#934](https://github.com/voideditor/void/issues/934), [#895](https://github.com/voideditor/void/issues/895), [#872](https://github.com/voideditor/void/issues/872) |
| 9 | Chat Panel UI Enhancements and Bug Fixes | 2 | 0.2 | UI/UX | [#925](https://github.com/voideditor/void/issues/925), [#877](https://github.com/voideditor/void/issues/877) |
| 10 | Fix Gemini API integration bugs | 2 | 0.2 | Integration | [#902](https://github.com/voideditor/void/issues/902), [#874](https://github.com/voideditor/void/issues/874) |

## 上升最快的需求

| 需求 | 上升倍率 | 本周 | 分类 |
| --- | --- | --- | --- |
| Enhanced AI provider configuration and authentication | 2.0x | 3 | Configuration |

## 分类分布

- **Configuration**: 3 个簇
- **Integration**: 3 个簇
- **Developer Experience**: 3 个簇
- **UI/UX**: 2 个簇

## 所有需求簇

### 1. Enhanced AI provider configuration and authentication

Users want more flexible options for connecting to AI model providers, including support for multiple provider profiles, API key authentication for servers like vLLM, and the ability to connect to endpoints with self-signed SSL/TLS certificates. These enhancements would enable integration with a wider variety of AI services and deployment scenarios.

- **数量:** 3 条 issue (1 未关闭, 2 已关闭)
- **需求得分:** 0.7
- **平均反应:** 0 | **平均评论:** 0.7
- **示例 Issue:** [#952](https://github.com/voideditor/void/issues/952), [#892](https://github.com/voideditor/void/issues/892), [#886](https://github.com/voideditor/void/issues/886)

### 2. Fix UI rendering and interaction bugs

Users are experiencing multiple UI rendering failures where content appears blank white, dropdowns don't expand when clicked, and the editor fails to render properly on startup or when opening folders. These issues prevent users from effectively interacting with and using the editor interface.

- **数量:** 3 条 issue (3 未关闭, 0 已关闭)
- **需求得分:** 0.6
- **平均反应:** 0.3 | **平均评论:** 2
- **示例 Issue:** [#939](https://github.com/voideditor/void/issues/939), [#938](https://github.com/voideditor/void/issues/938), [#914](https://github.com/voideditor/void/issues/914)

### 3. Expand AI Provider Integration and Capabilities

Users want to add support for new AI providers including LLaMa, Mistral, nano-gpt.com, kimi 2k, Claude Code, and automatic OpenRouter free tier fetching. They also want internet search and web scraping capabilities for AI models, along with fixes for existing AI features like file search and Unicode character handling.

- **数量:** 9 条 issue (7 未关闭, 2 已关闭)
- **需求得分:** 0.4
- **平均反应:** 1 | **平均评论:** 1.6
- **示例 Issue:** [#906](https://github.com/voideditor/void/issues/906), [#894](https://github.com/voideditor/void/issues/894), [#891](https://github.com/voideditor/void/issues/891), [#885](https://github.com/voideditor/void/issues/885), [#876](https://github.com/voideditor/void/issues/876)

### 4. MCP Server Integration Fixes and Features

Users are experiencing issues with MCP (Model Context Protocol) server connectivity, tool invocation with local LLMs, and SSE-based server support for decorated Python functions. They also want new capabilities like dynamic LLM model switching via API hooks and prompt inspection through request proxying. These issues collectively indicate a need for improved MCP integration robustness and extended functionality.

- **数量:** 6 条 issue (6 未关闭, 0 已关闭)
- **需求得分:** 0.3
- **平均反应:** 0 | **平均评论:** 1.2
- **示例 Issue:** [#945](https://github.com/voideditor/void/issues/945), [#907](https://github.com/voideditor/void/issues/907), [#899](https://github.com/voideditor/void/issues/899), [#873](https://github.com/voideditor/void/issues/873), [#868](https://github.com/voideditor/void/issues/868)

### 5. Critical Bug Fixes for Core Functionality

Users are reporting multiple bugs that need to be addressed to ensure the application works correctly. These include agent output formatting problems, security vulnerabilities in dependencies, path handling issues on Windows systems, and bundling errors with the Excalidraw integration. Fixing these issues will improve application reliability and developer experience.

- **数量:** 4 条 issue (3 未关闭, 1 已关闭)
- **需求得分:** 0.3
- **平均反应:** 0.3 | **平均评论:** 1
- **示例 Issue:** [#924](https://github.com/voideditor/void/issues/924), [#898](https://github.com/voideditor/void/issues/898), [#890](https://github.com/voideditor/void/issues/890), [#869](https://github.com/voideditor/void/issues/869)

### 6. Build environment and tooling configuration

Users need proper build environment setup for smooth development workflows. This includes adding support for new IDE versions like Visual Studio 2026 and resolving PATH issues that prevent tools like tailwindcss from being accessible during builds.

- **数量:** 2 条 issue (2 未关闭, 0 已关闭)
- **需求得分:** 0.2
- **平均反应:** 0.5 | **平均评论:** 2.5
- **示例 Issue:** [#931](https://github.com/voideditor/void/issues/931), [#882](https://github.com/voideditor/void/issues/882)

### 7. Enhanced AI provider and model configuration options

Users want more flexibility to customize their AI integration experience. This includes UI customization options like hiding floating widgets, configurable provider endpoints for custom proxies, per-model routing support for providers like OpenRouter, and the ability to manage custom model tags without modifying core files. These features would give users greater control over their AI setup and reduce the need for manual code modifications.

- **数量:** 4 条 issue (2 未关闭, 2 已关闭)
- **需求得分:** 0.2
- **平均反应:** 0.3 | **平均评论:** 2
- **示例 Issue:** [#905](https://github.com/voideditor/void/issues/905), [#904](https://github.com/voideditor/void/issues/904), [#887](https://github.com/voideditor/void/issues/887), [#884](https://github.com/voideditor/void/issues/884)

### 8. Improve IDE interface controls and interactions

Users want improvements to the IDE interface, including direct numeric input for reasoning budget settings, better popup menu positioning that doesn't interfere with text selection, browser-based IDE support for Void Agent settings, and expanded model support for qwen3-coder in file editing. These changes aim to enhance usability and functionality of the development environment.

- **数量:** 4 条 issue (3 未关闭, 1 已关闭)
- **需求得分:** 0.2
- **平均反应:** 2.5 | **平均评论:** 4.8
- **示例 Issue:** [#934](https://github.com/voideditor/void/issues/934), [#895](https://github.com/voideditor/void/issues/895), [#872](https://github.com/voideditor/void/issues/872), [#857](https://github.com/voideditor/void/issues/857)

### 9. Chat Panel UI Enhancements and Bug Fixes

Users want improvements to the chat panel interface, including fixing a CSS bug where file drag-and-drop overlays fail to display due to missing positioning. Additionally, they want new UI features like parallel tool calling, web search integration, image attachments, thinking process visualization, tool call pending animations, and improved search functionality.

- **数量:** 2 条 issue (2 未关闭, 0 已关闭)
- **需求得分:** 0.2
- **平均反应:** 1 | **平均评论:** 1
- **示例 Issue:** [#925](https://github.com/voideditor/void/issues/925), [#877](https://github.com/voideditor/void/issues/877)

### 10. Fix Gemini API integration bugs

Users are experiencing bugs in the Gemini API integration including broken request handling when proxying through OpenAI-compatible endpoints with specific settings, and invalid function name generation when .voidrules is empty. These issues prevent proper functionality in AI provider integrations.

- **数量:** 2 条 issue (2 未关闭, 0 已关闭)
- **需求得分:** 0.2
- **平均反应:** 0.5 | **平均评论:** 1
- **示例 Issue:** [#902](https://github.com/voideditor/void/issues/902), [#874](https://github.com/voideditor/void/issues/874)

### 11. LLM Provider Configuration and Model Support

Users need improved support and configuration options for various LLM providers including Gemini, GPT-OSS, and LM Studio. These issues involve fixing model selection, supporting non-standard model tags, and enabling file access for local models. This improves flexibility for users working with different LLM ecosystems.

- **数量:** 3 条 issue (0 未关闭, 3 已关闭)
- **需求得分:** 0.1
- **平均反应:** 1 | **平均评论:** 1
- **示例 Issue:** [#893](https://github.com/voideditor/void/issues/893), [#889](https://github.com/voideditor/void/issues/889), [#865](https://github.com/voideditor/void/issues/865)

---

*本报告仅分析公开 GitHub Issues，代表的是公开讨论中的需求信号，并非全部用户的声音。*

*由 [ReadYourUsers](https://github.com/study8677/ReadYourUsers) 生成*