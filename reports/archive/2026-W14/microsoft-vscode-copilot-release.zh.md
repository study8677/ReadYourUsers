# GitHub Copilot Chat for VS Code — 用户需求报告

**周:** 2026-W14
**生成日期:** 2026-04-03
**分析 Issue 数:** 100 (93 纳入分析)
**需求簇:** 16

## Top 10 用户需求

| 排名 | 需求 | Issue 数 | 得分 | 分类 | 示例 |
| --- | --- | --- | --- | --- | --- |
| 1 | Enhanced Configuration Settings and UI Fixes | 4 | 1.8 | Configuration | [#14151](https://github.com/microsoft/vscode-copilot-release/issues/14151), [#14130](https://github.com/microsoft/vscode-copilot-release/issues/14130), [#14123](https://github.com/microsoft/vscode-copilot-release/issues/14123) |
| 2 | Fix Agent Mode reliability and tool integration issues | 7 | 1.3 | Developer Experience | [#14166](https://github.com/microsoft/vscode-copilot-release/issues/14166), [#14161](https://github.com/microsoft/vscode-copilot-release/issues/14161), [#14153](https://github.com/microsoft/vscode-copilot-release/issues/14153) |
| 3 | AI and Copilot Integration Fixes | 9 | 1.2 | Integration | [#14172](https://github.com/microsoft/vscode-copilot-release/issues/14172), [#14163](https://github.com/microsoft/vscode-copilot-release/issues/14163), [#14162](https://github.com/microsoft/vscode-copilot-release/issues/14162) |
| 4 | Improve Copilot Chat UI status visibility and feedback | 4 | 1.2 | UI/UX | [#14168](https://github.com/microsoft/vscode-copilot-release/issues/14168), [#14159](https://github.com/microsoft/vscode-copilot-release/issues/14159), [#14134](https://github.com/microsoft/vscode-copilot-release/issues/14134) |
| 5 | Improve custom prompts and skills management in CLI picker | 3 | 1.0 | Developer Experience | [#14147](https://github.com/microsoft/vscode-copilot-release/issues/14147), [#14135](https://github.com/microsoft/vscode-copilot-release/issues/14135), [#14131](https://github.com/microsoft/vscode-copilot-release/issues/14131) |
| 6 | Fix VS Code Extension Errors and Failures | 4 | 0.9 | Developer Experience | [#14173](https://github.com/microsoft/vscode-copilot-release/issues/14173), [#14156](https://github.com/microsoft/vscode-copilot-release/issues/14156), [#14154](https://github.com/microsoft/vscode-copilot-release/issues/14154) |
| 7 | Improve Copilot Chat reliability and session management | 26 | 0.9 | Reliability | [#14169](https://github.com/microsoft/vscode-copilot-release/issues/14169), [#14165](https://github.com/microsoft/vscode-copilot-release/issues/14165), [#14160](https://github.com/microsoft/vscode-copilot-release/issues/14160) |
| 8 | API Request Error Handling and Model Compatibility | 7 | 0.8 | Developer Experience | [#14170](https://github.com/microsoft/vscode-copilot-release/issues/14170), [#14148](https://github.com/microsoft/vscode-copilot-release/issues/14148), [#14144](https://github.com/microsoft/vscode-copilot-release/issues/14144) |
| 9 | Excessive Rate Limit Wait Times | 2 | 0.7 | Platform Support | [#14137](https://github.com/microsoft/vscode-copilot-release/issues/14137), [#14099](https://github.com/microsoft/vscode-copilot-release/issues/14099) |
| 10 | Platform Support Expansion and Installation Bug Fixes | 2 | 0.7 | Platform Support | [#14174](https://github.com/microsoft/vscode-copilot-release/issues/14174), [#14117](https://github.com/microsoft/vscode-copilot-release/issues/14117) |

## 分类分布

- **Developer Experience**: 6 个簇
- **Reliability**: 5 个簇
- **Platform Support**: 2 个簇
- **Configuration**: 1 个簇
- **Integration**: 1 个簇
- **UI/UX**: 1 个簇

## 所有需求簇

### 1. Enhanced Configuration Settings and UI Fixes

Users are requesting more granular control over agent behavior through configuration options, including export capabilities for Copilot plans, timeout settings for MCP server execution, and independent control over ask_questions auto-approval. Additionally, a bug in the Configure Tools UI that writes incorrect prefix notation to agent configuration files needs to be fixed.

- **数量:** 4 条 issue (4 未关闭, 0 已关闭)
- **需求得分:** 1.8
- **平均反应:** 1 | **平均评论:** 1
- **示例 Issue:** [#14151](https://github.com/microsoft/vscode-copilot-release/issues/14151), [#14130](https://github.com/microsoft/vscode-copilot-release/issues/14130), [#14123](https://github.com/microsoft/vscode-copilot-release/issues/14123), [#14104](https://github.com/microsoft/vscode-copilot-release/issues/14104)

### 2. Fix Agent Mode reliability and tool integration issues

Users are experiencing multiple reliability issues in Agent Mode including hanging behavior, MCP server failures, and tool crashes. Key problems include MCP servers not auto-starting, tools being disabled with Claude models, the ask_questions tool not returning selections, and #codebase search failures. Additionally, users want enhanced multi-agent capabilities with model parameter support for subagents and fresh session handoffs.

- **数量:** 7 条 issue (7 未关闭, 0 已关闭)
- **需求得分:** 1.3
- **平均反应:** 4.1 | **平均评论:** 0.9
- **示例 Issue:** [#14166](https://github.com/microsoft/vscode-copilot-release/issues/14166), [#14161](https://github.com/microsoft/vscode-copilot-release/issues/14161), [#14153](https://github.com/microsoft/vscode-copilot-release/issues/14153), [#14138](https://github.com/microsoft/vscode-copilot-release/issues/14138), [#14107](https://github.com/microsoft/vscode-copilot-release/issues/14107)

### 3. AI and Copilot Integration Fixes

Users are experiencing multiple issues with AI/Copilot functionality including model availability, connectivity errors, tool computation failures, and quota consumption problems. These issues prevent reliable use of AI features and require fixes to error handling, model access, and resource management.

- **数量:** 9 条 issue (9 未关闭, 0 已关闭)
- **需求得分:** 1.2
- **平均反应:** 0.4 | **平均评论:** 0.7
- **示例 Issue:** [#14172](https://github.com/microsoft/vscode-copilot-release/issues/14172), [#14163](https://github.com/microsoft/vscode-copilot-release/issues/14163), [#14162](https://github.com/microsoft/vscode-copilot-release/issues/14162), [#14141](https://github.com/microsoft/vscode-copilot-release/issues/14141), [#14116](https://github.com/microsoft/vscode-copilot-release/issues/14116)

### 4. Improve Copilot Chat UI status visibility and feedback

Users want improved visual feedback and status visibility in the Copilot Chat interface. This includes visible rate limit indicators showing quota usage and reset timing, source location transparency for custom prompts and skills, graceful handling of large responses, and fixing broken UI elements like stuck spinners that block interaction. These improvements would help users understand system state and work more effectively without being blocked by unresponsive UI.

- **数量:** 4 条 issue (3 未关闭, 1 已关闭)
- **需求得分:** 1.2
- **平均反应:** 1 | **平均评论:** 1.3
- **示例 Issue:** [#14168](https://github.com/microsoft/vscode-copilot-release/issues/14168), [#14159](https://github.com/microsoft/vscode-copilot-release/issues/14159), [#14134](https://github.com/microsoft/vscode-copilot-release/issues/14134), [#14092](https://github.com/microsoft/vscode-copilot-release/issues/14092)

### 5. Improve custom prompts and skills management in CLI picker

Users want better organization and visibility of custom prompts and skills in the command picker, including separating prompt files from skills with clear grouping, showing source locations, and fixing YAML validation for attributes like 'allowed-tools'. These improvements would help developers better manage, organize, and debug their custom extensions.

- **数量:** 3 条 issue (1 未关闭, 2 已关闭)
- **需求得分:** 1.0
- **平均反应:** 2.3 | **平均评论:** 2
- **示例 Issue:** [#14147](https://github.com/microsoft/vscode-copilot-release/issues/14147), [#14135](https://github.com/microsoft/vscode-copilot-release/issues/14135), [#14131](https://github.com/microsoft/vscode-copilot-release/issues/14131)

### 6. Fix VS Code Extension Errors and Failures

Users are experiencing various extension-related issues including initialization timeouts, unhandled promise rejections during shutdown, and compatibility problems with VS Code Insiders. They want these extension errors investigated and fixed to ensure extensions work reliably without crashing or failing to initialize.

- **数量:** 4 条 issue (3 未关闭, 1 已关闭)
- **需求得分:** 0.9
- **平均反应:** 0.5 | **平均评论:** 0.3
- **示例 Issue:** [#14173](https://github.com/microsoft/vscode-copilot-release/issues/14173), [#14156](https://github.com/microsoft/vscode-copilot-release/issues/14156), [#14154](https://github.com/microsoft/vscode-copilot-release/issues/14154), [#14093](https://github.com/microsoft/vscode-copilot-release/issues/14093)

### 7. Improve Copilot Chat reliability and session management

Users are experiencing multiple reliability issues with Copilot Chat including slow initialization, session persistence problems, context truncation causing lost message access, and accidental message deletion without confirmation. These issues frustrate users and impact productivity when the chat feature becomes unresponsive or loses important conversation history.

- **数量:** 26 条 issue (21 未关闭, 5 已关闭)
- **需求得分:** 0.9
- **平均反应:** 0.5 | **平均评论:** 0.5
- **示例 Issue:** [#14169](https://github.com/microsoft/vscode-copilot-release/issues/14169), [#14165](https://github.com/microsoft/vscode-copilot-release/issues/14165), [#14160](https://github.com/microsoft/vscode-copilot-release/issues/14160), [#14158](https://github.com/microsoft/vscode-copilot-release/issues/14158), [#14157](https://github.com/microsoft/vscode-copilot-release/issues/14157)

### 8. API Request Error Handling and Model Compatibility

Users encounter various API errors including server errors (500, 413), unsupported endpoint combinations, and serialization issues when making API requests. They want the system to either prevent these errors through better model/endpoint compatibility checks or handle them gracefully with clear, informative error messages. This includes fixing issues like malformed function_response serialization and preventing extension load failures when models aren't accessible via certain endpoints.

- **数量:** 7 条 issue (7 未关闭, 0 已关闭)
- **需求得分:** 0.8
- **平均反应:** 0.3 | **平均评论:** 0.4
- **示例 Issue:** [#14170](https://github.com/microsoft/vscode-copilot-release/issues/14170), [#14148](https://github.com/microsoft/vscode-copilot-release/issues/14148), [#14144](https://github.com/microsoft/vscode-copilot-release/issues/14144), [#14142](https://github.com/microsoft/vscode-copilot-release/issues/14142), [#14113](https://github.com/microsoft/vscode-copilot-release/issues/14113)

### 9. Excessive Rate Limit Wait Times

Users are experiencing unreasonably long rate limit wait times (455+ hours), making it impractical to continue using the platform. They are requesting either reduced rate limit thresholds or improved communication about when limits will reset so they can plan accordingly.

- **数量:** 2 条 issue (2 未关闭, 0 已关闭)
- **需求得分:** 0.7
- **平均反应:** 0 | **平均评论:** 2
- **示例 Issue:** [#14137](https://github.com/microsoft/vscode-copilot-release/issues/14137), [#14099](https://github.com/microsoft/vscode-copilot-release/issues/14099)

### 10. Platform Support Expansion and Installation Bug Fixes

Users want expanded platform support for the Copilot SDK (specifically linux-arm64 architecture) as well as fixes for installation-related bugs. The infinite loop issue when multiple VS Code installations are present causes reliability problems that prevent smooth usage of the SDK in complex development environments.

- **数量:** 2 条 issue (1 未关闭, 1 已关闭)
- **需求得分:** 0.7
- **平均反应:** 0 | **平均评论:** 0.5
- **示例 Issue:** [#14174](https://github.com/microsoft/vscode-copilot-release/issues/14174), [#14117](https://github.com/microsoft/vscode-copilot-release/issues/14117)

### 11. Fix AI Model Availability and Behavior Issues

Users are experiencing critical issues with AI models not being accessible, available, or functioning correctly. They report problems with model endpoints, Copilot extensions, and AI assistants that delete code without providing alternatives. Users need these AI functionality issues resolved to maintain productive workflows.

- **数量:** 3 条 issue (3 未关闭, 0 已关闭)
- **需求得分:** 0.6
- **平均反应:** 0.3 | **平均评论:** 0.3
- **示例 Issue:** [#14171](https://github.com/microsoft/vscode-copilot-release/issues/14171), [#14119](https://github.com/microsoft/vscode-copilot-release/issues/14119), [#14112](https://github.com/microsoft/vscode-copilot-release/issues/14112)

### 12. Terminal task interruption and command parsing fixes

Users are experiencing unexpected task interruptions without any warning or notification, which disrupts workflow. Additionally, command parsing fails when heredoc terminators are followed by additional commands, causing terminal tool execution errors. These issues affect the reliability and predictability of terminal operations.

- **数量:** 2 条 issue (2 未关闭, 0 已关闭)
- **需求得分:** 0.6
- **平均反应:** 5 | **平均评论:** 0.5
- **示例 Issue:** [#14140](https://github.com/microsoft/vscode-copilot-release/issues/14140), [#14124](https://github.com/microsoft/vscode-copilot-release/issues/14124)

### 13. Fix subscription authentication and access issues

Users with active Copilot Pro subscriptions are encountering authentication failures, subscription recognition errors, and access restrictions that prevent them from using AI features they've paid for. These issues include quota enforcement failures, rate limiting without clear messaging, and upgrade flow problems that block paying users from accessing the service.

- **数量:** 9 条 issue (8 未关闭, 1 已关闭)
- **需求得分:** 0.6
- **平均反应:** 0.4 | **平均评论:** 0.1
- **示例 Issue:** [#14167](https://github.com/microsoft/vscode-copilot-release/issues/14167), [#14164](https://github.com/microsoft/vscode-copilot-release/issues/14164), [#14146](https://github.com/microsoft/vscode-copilot-release/issues/14146), [#14122](https://github.com/microsoft/vscode-copilot-release/issues/14122), [#14120](https://github.com/microsoft/vscode-copilot-release/issues/14120)

### 14. Improve Network Reliability and Error Recovery

Users are experiencing frequent gateway timeout errors (504, 502) and false connectivity reports that disrupt their workflow. They want more stable connections during high-load periods and graceful handling of network failures with improved error recovery mechanisms.

- **数量:** 5 条 issue (5 未关闭, 0 已关闭)
- **需求得分:** 0.6
- **平均反应:** 0 | **平均评论:** 1.4
- **示例 Issue:** [#14149](https://github.com/microsoft/vscode-copilot-release/issues/14149), [#14136](https://github.com/microsoft/vscode-copilot-release/issues/14136), [#14133](https://github.com/microsoft/vscode-copilot-release/issues/14133), [#14111](https://github.com/microsoft/vscode-copilot-release/issues/14111), [#14106](https://github.com/microsoft/vscode-copilot-release/issues/14106)

### 15. Copilot Chat Rate Limits and Session Sync

Users experience premature rate limiting that blocks paid users after minimal Copilot Chat usage, and they also want session history to sync between VS Code Stable and Insiders. These issues disrupt workflow continuity and reduce the value of Copilot Chat for paying customers who expect reliable, uninterrupted access to their conversations.

- **数量:** 2 条 issue (1 未关闭, 1 已关闭)
- **需求得分:** 0.6
- **平均反应:** 4.5 | **平均评论:** 0
- **示例 Issue:** [#14128](https://github.com/microsoft/vscode-copilot-release/issues/14128), [#14118](https://github.com/microsoft/vscode-copilot-release/issues/14118)

### 16. Improve Copilot Chat reliability and initialization

Users are experiencing reliability issues with Copilot Chat, including renderer crashes during heavy usage in Remote-SSH workspaces on macOS, slow initialization times, and infinite retry loops from unhandled HTTP 404 errors. They want a more stable and responsive Chat experience with faster startup times and proper error handling.

- **数量:** 4 条 issue (4 未关闭, 0 已关闭)
- **需求得分:** 0.5
- **平均反应:** 0 | **平均评论:** 0.8
- **示例 Issue:** [#14139](https://github.com/microsoft/vscode-copilot-release/issues/14139), [#14132](https://github.com/microsoft/vscode-copilot-release/issues/14132), [#14082](https://github.com/microsoft/vscode-copilot-release/issues/14082), [#14073](https://github.com/microsoft/vscode-copilot-release/issues/14073)

---

*本报告仅分析公开 GitHub Issues，代表的是公开讨论中的需求信号，并非全部用户的声音。*

*由 [ReadYourUsers](https://github.com/study8677/ReadYourUsers) 生成*