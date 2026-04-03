# Gemini CLI — 用户需求报告

**周:** 2026-W14
**生成日期:** 2026-04-03
**分析 Issue 数:** 59 (54 纳入分析)
**需求簇:** 10

## Top 10 用户需求

| 排名 | 需求 | Issue 数 | 得分 | 分类 | 示例 |
| --- | --- | --- | --- | --- | --- |
| 1 | Optimize Resource Usage and Performance | 5 | 4.0 | Performance | [#24600](https://github.com/google-gemini/gemini-cli/issues/24600), [#24593](https://github.com/google-gemini/gemini-cli/issues/24593), [#24589](https://github.com/google-gemini/gemini-cli/issues/24589) |
| 2 | CLI Reliability and UX Bug Fixes | 12 | 3.2 | Developer Experience | [#24605](https://github.com/google-gemini/gemini-cli/issues/24605), [#24597](https://github.com/google-gemini/gemini-cli/issues/24597), [#24591](https://github.com/google-gemini/gemini-cli/issues/24591) |
| 3 | Google AI Pro authentication and quota fixes | 8 | 2.5 | Developer Experience | [#24607](https://github.com/google-gemini/gemini-cli/issues/24607), [#24587](https://github.com/google-gemini/gemini-cli/issues/24587), [#24539](https://github.com/google-gemini/gemini-cli/issues/24539) |
| 4 | Graceful rate limit error handling | 2 | 2.0 | Developer Experience | [#24594](https://github.com/google-gemini/gemini-cli/issues/24594), [#24588](https://github.com/google-gemini/gemini-cli/issues/24588) |
| 5 | Bug Fixes and Quality Improvements | 11 | 1.5 | Reliability | [#24604](https://github.com/google-gemini/gemini-cli/issues/24604), [#24595](https://github.com/google-gemini/gemini-cli/issues/24595), [#24564](https://github.com/google-gemini/gemini-cli/issues/24564) |
| 6 | Agent Reliability and Stability Fixes | 5 | 1.5 | Reliability | [#24581](https://github.com/google-gemini/gemini-cli/issues/24581), [#24576](https://github.com/google-gemini/gemini-cli/issues/24576), [#24541](https://github.com/google-gemini/gemini-cli/issues/24541) |
| 7 | Fix editor bugs causing crashes and corruption | 3 | 1.2 | Reliability | [#24602](https://github.com/google-gemini/gemini-cli/issues/24602), [#24580](https://github.com/google-gemini/gemini-cli/issues/24580), [#24560](https://github.com/google-gemini/gemini-cli/issues/24560) |
| 8 | Fix and enhance gemini extensions functionality | 3 | 1.0 | Developer Experience | [#24572](https://github.com/google-gemini/gemini-cli/issues/24572), [#24543](https://github.com/google-gemini/gemini-cli/issues/24543), [#24534](https://github.com/google-gemini/gemini-cli/issues/24534) |
| 9 | Configuration Settings and Defaults | 2 | 1.0 | Configuration | [#24583](https://github.com/google-gemini/gemini-cli/issues/24583), [#24509](https://github.com/google-gemini/gemini-cli/issues/24509) |
| 10 | Improve UI Information Display and Readability | 3 | 0.0 | UI/UX | [#24601](https://github.com/google-gemini/gemini-cli/issues/24601), [#24553](https://github.com/google-gemini/gemini-cli/issues/24553), [#24507](https://github.com/google-gemini/gemini-cli/issues/24507) |

## 上升最快的需求

| 需求 | 上升倍率 | 本周 | 分类 |
| --- | --- | --- | --- |
| CLI Reliability and UX Bug Fixes | 13.0x | 12 | Developer Experience |
| Bug Fixes and Quality Improvements | 12.0x | 11 | Reliability |
| Google AI Pro authentication and quota fixes | 9.0x | 8 | Developer Experience |
| Optimize Resource Usage and Performance | 6.0x | 5 | Performance |
| Agent Reliability and Stability Fixes | 6.0x | 5 | Reliability |

## 分类分布

- **Developer Experience**: 4 个簇
- **Reliability**: 3 个簇
- **Performance**: 1 个簇
- **Configuration**: 1 个簇
- **UI/UX**: 1 个簇

## 所有需求簇

### 1. Optimize Resource Usage and Performance

Users are experiencing excessive token consumption, memory leaks, infinite loops, and performance regressions that waste computational resources and increase costs. They want the system to be more efficient with tokens, memory, and processing during agent operations, particularly during extended thinking, waiting states, and tool execution. These issues cause degraded performance and unexpected resource exhaustion.

- **数量:** 5 条 issue (5 未关闭, 0 已关闭)
- **需求得分:** 4.0
- **平均反应:** 0 | **平均评论:** 0.8
- **示例 Issue:** [#24600](https://github.com/google-gemini/gemini-cli/issues/24600), [#24593](https://github.com/google-gemini/gemini-cli/issues/24593), [#24589](https://github.com/google-gemini/gemini-cli/issues/24589), [#24584](https://github.com/google-gemini/gemini-cli/issues/24584), [#24536](https://github.com/google-gemini/gemini-cli/issues/24536)

### 2. CLI Reliability and UX Bug Fixes

Users are experiencing multiple reliability issues with the CLI tool including hanging on 'thinking' states, incorrect output display in non-interactive contexts, authentication dialog handling problems, and inconsistent keyboard shortcuts across platforms. These fixes address session management, input handling, and display rendering to improve overall CLI stability.

- **数量:** 12 条 issue (9 未关闭, 3 已关闭)
- **需求得分:** 3.2
- **平均反应:** 0.1 | **平均评论:** 2.3
- **示例 Issue:** [#24605](https://github.com/google-gemini/gemini-cli/issues/24605), [#24597](https://github.com/google-gemini/gemini-cli/issues/24597), [#24591](https://github.com/google-gemini/gemini-cli/issues/24591), [#24574](https://github.com/google-gemini/gemini-cli/issues/24574), [#24570](https://github.com/google-gemini/gemini-cli/issues/24570)

### 3. Google AI Pro authentication and quota fixes

Users are experiencing authentication failures, incorrect error messages, and quota visibility issues when using Google AI Pro accounts. Issues include 403 PERMISSION_DENIED errors after successful OAuth, race conditions in the OIDC login flow, and inability to distinguish between personal vs workspace accounts. Developers need reliable account type detection, clearer error messaging, and proper quota handling to effectively use the CLI.

- **数量:** 8 条 issue (5 未关闭, 3 已关闭)
- **需求得分:** 2.5
- **平均反应:** 0.5 | **平均评论:** 2.3
- **示例 Issue:** [#24607](https://github.com/google-gemini/gemini-cli/issues/24607), [#24587](https://github.com/google-gemini/gemini-cli/issues/24587), [#24539](https://github.com/google-gemini/gemini-cli/issues/24539), [#24533](https://github.com/google-gemini/gemini-cli/issues/24533), [#24525](https://github.com/google-gemini/gemini-cli/issues/24525)

### 4. Graceful rate limit error handling

Users encountering HTTP 429 rate limit errors need the application to handle them gracefully, either through automatic retry logic with backoff or by providing clear, actionable error messages that explain why requests were blocked and when users can retry. This improves the developer experience and reduces frustration when hitting API limits.

- **数量:** 2 条 issue (2 未关闭, 0 已关闭)
- **需求得分:** 2.0
- **平均反应:** 0 | **平均评论:** 1
- **示例 Issue:** [#24594](https://github.com/google-gemini/gemini-cli/issues/24594), [#24588](https://github.com/google-gemini/gemini-cli/issues/24588)

### 5. Bug Fixes and Quality Improvements

Users are reporting various bugs affecting core functionality, UI correctness, and data integrity. These include crashes when handling specific characters, infinite loops during MCP server connections, session persistence failures, and UI rendering issues in tables and sidebars. Addressing these issues will improve overall application stability and user experience.

- **数量:** 11 条 issue (9 未关闭, 2 已关闭)
- **需求得分:** 1.5
- **平均反应:** 0 | **平均评论:** 0.3
- **示例 Issue:** [#24604](https://github.com/google-gemini/gemini-cli/issues/24604), [#24595](https://github.com/google-gemini/gemini-cli/issues/24595), [#24564](https://github.com/google-gemini/gemini-cli/issues/24564), [#24563](https://github.com/google-gemini/gemini-cli/issues/24563), [#24562](https://github.com/google-gemini/gemini-cli/issues/24562)

### 6. Agent Reliability and Stability Fixes

Users are experiencing multiple reliability issues with the agent, including unresponsiveness after updates, endless thinking loops, unhandled crashes during file operations, and failure to properly execute halt commands. These stability problems significantly impact workflow continuity and user trust in the agent's ability to complete tasks reliably.

- **数量:** 5 条 issue (2 未关闭, 3 已关闭)
- **需求得分:** 1.5
- **平均反应:** 0 | **平均评论:** 1.8
- **示例 Issue:** [#24581](https://github.com/google-gemini/gemini-cli/issues/24581), [#24576](https://github.com/google-gemini/gemini-cli/issues/24576), [#24541](https://github.com/google-gemini/gemini-cli/issues/24541), [#24516](https://github.com/google-gemini/gemini-cli/issues/24516), [#24515](https://github.com/google-gemini/gemini-cli/issues/24515)

### 7. Fix editor bugs causing crashes and corruption

Users are experiencing multiple critical bugs in the editor and file handling systems that cause unexpected behavior, crashes, and data corruption. These issues range from minor UX problems like scroll reset when viewing diffs to serious issues like file content corruption on Windows. Fixing these bugs is essential for maintaining user trust and preventing data loss.

- **数量:** 3 条 issue (2 未关闭, 1 已关闭)
- **需求得分:** 1.2
- **平均反应:** 0 | **平均评论:** 2
- **示例 Issue:** [#24602](https://github.com/google-gemini/gemini-cli/issues/24602), [#24580](https://github.com/google-gemini/gemini-cli/issues/24580), [#24560](https://github.com/google-gemini/gemini-cli/issues/24560)

### 8. Fix and enhance gemini extensions functionality

These issues relate to improving the gemini extensions system by fixing directory resolution bugs, enabling third-party extension submissions, and resolving missing files in the NPM bundle. Users need a reliable and extensible system for managing role-based SDLC skills through the CLI.

- **数量:** 3 条 issue (3 未关闭, 0 已关闭)
- **需求得分:** 1.0
- **平均反应:** 0 | **平均评论:** 0.3
- **示例 Issue:** [#24572](https://github.com/google-gemini/gemini-cli/issues/24572), [#24543](https://github.com/google-gemini/gemini-cli/issues/24543), [#24534](https://github.com/google-gemini/gemini-cli/issues/24534)

### 9. Configuration Settings and Defaults

Users want settings to work as intended and have better default behaviors. One issue is that the 'inlineThinkingMode' setting is being ignored, causing unwanted thinking tokens to appear. Another request is to change the default value of 'Compact Tool Output' to be enabled by default, improving the user experience out of the box.

- **数量:** 2 条 issue (2 未关闭, 0 已关闭)
- **需求得分:** 1.0
- **平均反应:** 0 | **平均评论:** 0.5
- **示例 Issue:** [#24583](https://github.com/google-gemini/gemini-cli/issues/24583), [#24509](https://github.com/google-gemini/gemini-cli/issues/24509)

### 10. Improve UI Information Display and Readability

Users want improvements to the interface including fixing missing information displays (like email and tier), adding persistent navigation elements (sticky header), and improving output readability with concise summaries. These enhancements would make the application more intuitive and reduce visual clutter while maintaining access to important context.

- **数量:** 3 条 issue (3 未关闭, 0 已关闭)
- **需求得分:** 0.0
- **平均反应:** 0 | **平均评论:** 0
- **示例 Issue:** [#24601](https://github.com/google-gemini/gemini-cli/issues/24601), [#24553](https://github.com/google-gemini/gemini-cli/issues/24553), [#24507](https://github.com/google-gemini/gemini-cli/issues/24507)

---

*本报告仅分析公开 GitHub Issues，代表的是公开讨论中的需求信号，并非全部用户的声音。*

*由 [ReadYourUsers](https://github.com/study8677/ReadYourUsers) 生成*