# Roo Code — 用户需求报告

**周:** 2026-W14
**生成日期:** 2026-04-03
**分析 Issue 数:** 53 (52 纳入分析)
**需求簇:** 9

## Top 10 用户需求

| 排名 | 需求 | Issue 数 | 得分 | 分类 | 示例 |
| --- | --- | --- | --- | --- | --- |
| 1 | Provider and Model Configuration Enhancements | 17 | 7.8 | Configuration | [#12044](https://github.com/RooCodeInc/Roo-Code/issues/12044), [#12037](https://github.com/RooCodeInc/Roo-Code/issues/12037), [#12024](https://github.com/RooCodeInc/Roo-Code/issues/12024) |
| 2 | Expand AI Model Integrations and MCP Protocol Support | 8 | 4.2 | Integration | [#12050](https://github.com/RooCodeInc/Roo-Code/issues/12050), [#12035](https://github.com/RooCodeInc/Roo-Code/issues/12035), [#12016](https://github.com/RooCodeInc/Roo-Code/issues/12016) |
| 3 | Provider-specific API integration bug fixes | 6 | 3.3 | Integration | [#12045](https://github.com/RooCodeInc/Roo-Code/issues/12045), [#12042](https://github.com/RooCodeInc/Roo-Code/issues/12042), [#12006](https://github.com/RooCodeInc/Roo-Code/issues/12006) |
| 4 | AI Coding Assistant UX Improvements | 4 | 2.5 | Developer Experience | [#12032](https://github.com/RooCodeInc/Roo-Code/issues/12032), [#12028](https://github.com/RooCodeInc/Roo-Code/issues/12028), [#11987](https://github.com/RooCodeInc/Roo-Code/issues/11987) |
| 5 | Per-Context Settings and Model Provider Improvements | 8 | 2.2 | Configuration | [#12038](https://github.com/RooCodeInc/Roo-Code/issues/12038), [#12034](https://github.com/RooCodeInc/Roo-Code/issues/12034), [#12014](https://github.com/RooCodeInc/Roo-Code/issues/12014) |
| 6 | Chat Interface Visual Rendering Fixes | 3 | 2.1 | UI/UX | [#12030](https://github.com/RooCodeInc/Roo-Code/issues/12030), [#12026](https://github.com/RooCodeInc/Roo-Code/issues/12026), [#11986](https://github.com/RooCodeInc/Roo-Code/issues/11986) |
| 7 | Improve shell parsing and file exclusion reliability | 2 | 1.9 | Security | [#12040](https://github.com/RooCodeInc/Roo-Code/issues/12040), [#12023](https://github.com/RooCodeInc/Roo-Code/issues/12023) |
| 8 | CLI Feature Enhancements | 2 | 1.3 | Developer Experience | [#12003](https://github.com/RooCodeInc/Roo-Code/issues/12003), [#11974](https://github.com/RooCodeInc/Roo-Code/issues/11974) |
| 9 | Enhanced audio feedback and notification hooks | 2 | 1.2 | Integration | [#12047](https://github.com/RooCodeInc/Roo-Code/issues/12047), [#12025](https://github.com/RooCodeInc/Roo-Code/issues/12025) |

## 上升最快的需求

| 需求 | 上升倍率 | 本周 | 分类 |
| --- | --- | --- | --- |
| Improve shell parsing and file exclusion reliability | 3.0x | 2 | Security |
| Enhanced audio feedback and notification hooks | 3.0x | 2 | Integration |
| Chat Interface Visual Rendering Fixes | 1.5x | 3 | UI/UX |

## 分类分布

- **Integration**: 3 个簇
- **Configuration**: 2 个簇
- **Developer Experience**: 2 个簇
- **UI/UX**: 1 个簇
- **Security**: 1 个簇

## 所有需求簇

### 1. Provider and Model Configuration Enhancements

Users are requesting expanded model support across providers like Ollama, OpenRouter, and Z.ai, along with fixes for context management issues including token limit calculations and content truncation. These enhancements improve the system's flexibility and reliability when working with diverse AI models and configurations.

- **数量:** 17 条 issue (17 未关闭, 0 已关闭)
- **需求得分:** 7.8
- **平均反应:** 0.4 | **平均评论:** 3.9
- **示例 Issue:** [#12044](https://github.com/RooCodeInc/Roo-Code/issues/12044), [#12037](https://github.com/RooCodeInc/Roo-Code/issues/12037), [#12024](https://github.com/RooCodeInc/Roo-Code/issues/12024), [#12020](https://github.com/RooCodeInc/Roo-Code/issues/12020), [#12018](https://github.com/RooCodeInc/Roo-Code/issues/12018)

### 2. Expand AI Model Integrations and MCP Protocol Support

Users are requesting expanded support for various AI model providers (including xAI/grok-4.20, Gemini 3, and Claude via VS Code LM API) along with MCP protocol enhancements. Key needs include fixing tool calling failures, supporting new MCP server versions and protocol specs, enabling agent-to-agent communication via A2A, and providing per-mode MCP server restrictions to manage context bloat.

- **数量:** 8 条 issue (5 未关闭, 3 已关闭)
- **需求得分:** 4.2
- **平均反应:** 0 | **平均评论:** 2.9
- **示例 Issue:** [#12050](https://github.com/RooCodeInc/Roo-Code/issues/12050), [#12035](https://github.com/RooCodeInc/Roo-Code/issues/12035), [#12016](https://github.com/RooCodeInc/Roo-Code/issues/12016), [#12007](https://github.com/RooCodeInc/Roo-Code/issues/12007), [#12004](https://github.com/RooCodeInc/Roo-Code/issues/12004)

### 3. Provider-specific API integration bug fixes

Users are experiencing various integration issues with different AI providers, including response handling, configuration parameters, caching behavior, and deprecated API migrations. These fixes ensure reliable communication with Vertex AI, OpenAI-compatible endpoints, Mistral, AWS Bedrock, and Grok providers.

- **数量:** 6 条 issue (6 未关闭, 0 已关闭)
- **需求得分:** 3.3
- **平均反应:** 0.2 | **平均评论:** 3.2
- **示例 Issue:** [#12045](https://github.com/RooCodeInc/Roo-Code/issues/12045), [#12042](https://github.com/RooCodeInc/Roo-Code/issues/12042), [#12006](https://github.com/RooCodeInc/Roo-Code/issues/12006), [#11996](https://github.com/RooCodeInc/Roo-Code/issues/11996), [#11983](https://github.com/RooCodeInc/Roo-Code/issues/11983)

### 4. AI Coding Assistant UX Improvements

Users want improvements to the AI coding assistant's core interaction behaviors, including better visual feedback when operations fail, expanded slash command functionality in multiline inputs, automatic checkpoint features for code change recovery, and consistent adherence to user-defined preferences. These issues collectively address the assistant's reliability, usability, and alignment with developer workflows.

- **数量:** 4 条 issue (4 未关闭, 0 已关闭)
- **需求得分:** 2.5
- **平均反应:** 0 | **平均评论:** 2.8
- **示例 Issue:** [#12032](https://github.com/RooCodeInc/Roo-Code/issues/12032), [#12028](https://github.com/RooCodeInc/Roo-Code/issues/12028), [#11987](https://github.com/RooCodeInc/Roo-Code/issues/11987), [#11967](https://github.com/RooCodeInc/Roo-Code/issues/11967)

### 5. Per-Context Settings and Model Provider Improvements

Users want improved configuration management with per-project and per-mode settings persistence instead of global-only configurations, better handling of custom AI provider models (including context window detection and custom model names), and enhanced MCP server security with allowlist-based tool filtering. They also need initialization code that works reliably in offline/restricted environments without depending on proxy tool side effects.

- **数量:** 8 条 issue (8 未关闭, 0 已关闭)
- **需求得分:** 2.2
- **平均反应:** 0.1 | **平均评论:** 2.4
- **示例 Issue:** [#12038](https://github.com/RooCodeInc/Roo-Code/issues/12038), [#12034](https://github.com/RooCodeInc/Roo-Code/issues/12034), [#12014](https://github.com/RooCodeInc/Roo-Code/issues/12014), [#12002](https://github.com/RooCodeInc/Roo-Code/issues/12002), [#11999](https://github.com/RooCodeInc/Roo-Code/issues/11999)

### 6. Chat Interface Visual Rendering Fixes

Users are experiencing multiple visual display issues in the chat window interface, including missing icons on Windows 10, improperly formatted markdown tables that stretch instead of scroll, and unwanted jitter when updating content. These rendering problems negatively impact the polish and usability of the interface.

- **数量:** 3 条 issue (3 未关闭, 0 已关闭)
- **需求得分:** 2.1
- **平均反应:** 0 | **平均评论:** 3
- **示例 Issue:** [#12030](https://github.com/RooCodeInc/Roo-Code/issues/12030), [#12026](https://github.com/RooCodeInc/Roo-Code/issues/12026), [#11986](https://github.com/RooCodeInc/Roo-Code/issues/11986)

### 7. Improve shell parsing and file exclusion reliability

Users want the tool to replace regexp-based shell parsing with a true shell parser for more reliable command safety validation and allow/deny list enforcement. Additionally, they need consistent .rooignore exclusion behavior across all MCP tools to prevent inconsistent file filtering.

- **数量:** 2 条 issue (2 未关闭, 0 已关闭)
- **需求得分:** 1.9
- **平均反应:** 1 | **平均评论:** 1.5
- **示例 Issue:** [#12040](https://github.com/RooCodeInc/Roo-Code/issues/12040), [#12023](https://github.com/RooCodeInc/Roo-Code/issues/12023)

### 8. CLI Feature Enhancements

Users want improvements to the ClaudeCode CLI including fixing the auto-approve feature to work properly in code mode, and adding a /plugin command for installing, listing, and removing plugins. These enhancements would improve workflow automation and extensibility for CLI users.

- **数量:** 2 条 issue (2 未关闭, 0 已关闭)
- **需求得分:** 1.3
- **平均反应:** 0.5 | **平均评论:** 4
- **示例 Issue:** [#12003](https://github.com/RooCodeInc/Roo-Code/issues/12003), [#11974](https://github.com/RooCodeInc/Roo-Code/issues/11974)

### 9. Enhanced audio feedback and notification hooks

Users want distinct audio feedback for different event types like task completion and AI/extension replies, along with programmatic hooks that trigger external notification systems during user prompts. This enables better workflow integration and awareness without requiring constant screen monitoring.

- **数量:** 2 条 issue (2 未关闭, 0 已关闭)
- **需求得分:** 1.2
- **平均反应:** 0.5 | **平均评论:** 2.5
- **示例 Issue:** [#12047](https://github.com/RooCodeInc/Roo-Code/issues/12047), [#12025](https://github.com/RooCodeInc/Roo-Code/issues/12025)

---

*本报告仅分析公开 GitHub Issues，代表的是公开讨论中的需求信号，并非全部用户的声音。*

*由 [ReadYourUsers](https://github.com/study8677/ReadYourUsers) 生成*