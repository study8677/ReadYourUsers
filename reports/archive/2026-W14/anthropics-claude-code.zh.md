# Claude Code — 用户需求报告

**周:** 2026-W14
**生成日期:** 2026-04-03
**分析 Issue 数:** 326 (313 纳入分析)
**需求簇:** 33

## Top 10 用户需求

| 排名 | 需求 | Issue 数 | 得分 | 分类 | 示例 |
| --- | --- | --- | --- | --- | --- |
| 1 | MCP Server Reliability and Configuration Issues | 33 | 15.4 | Integration | [#42632](https://github.com/anthropics/claude-code/issues/42632), [#42628](https://github.com/anthropics/claude-code/issues/42628), [#42627](https://github.com/anthropics/claude-code/issues/42627) |
| 2 | TUI Terminal State and Input Handling Fixes | 51 | 13.8 | UI/UX | [#42638](https://github.com/anthropics/claude-code/issues/42638), [#42617](https://github.com/anthropics/claude-code/issues/42617), [#42613](https://github.com/anthropics/claude-code/issues/42613) |
| 3 | CLI Session Management and UX Improvements | 32 | 7.9 | Developer Experience | [#42637](https://github.com/anthropics/claude-code/issues/42637), [#42624](https://github.com/anthropics/claude-code/issues/42624), [#42607](https://github.com/anthropics/claude-code/issues/42607) |
| 4 | Plugin System Management and Reliability | 12 | 6.0 | Developer Experience | [#42601](https://github.com/anthropics/claude-code/issues/42601), [#42595](https://github.com/anthropics/claude-code/issues/42595), [#42568](https://github.com/anthropics/claude-code/issues/42568) |
| 5 | Bug Fixes and Feature Enhancements | 31 | 5.6 | Developer Experience | [#42635](https://github.com/anthropics/claude-code/issues/42635), [#42631](https://github.com/anthropics/claude-code/issues/42631), [#42623](https://github.com/anthropics/claude-code/issues/42623) |
| 6 | Expand Hook System Functionality and Fix Hook Behaviors | 10 | 4.2 | Integration | [#42597](https://github.com/anthropics/claude-code/issues/42597), [#42581](https://github.com/anthropics/claude-code/issues/42581), [#42489](https://github.com/anthropics/claude-code/issues/42489) |
| 7 | Authentication and subscription reliability fixes | 10 | 4.2 | Developer Experience | [#42608](https://github.com/anthropics/claude-code/issues/42608), [#42605](https://github.com/anthropics/claude-code/issues/42605), [#42603](https://github.com/anthropics/claude-code/issues/42603) |
| 8 | Permission System Reliability and Security Fixes | 11 | 4.0 | Security | [#42611](https://github.com/anthropics/claude-code/issues/42611), [#42500](https://github.com/anthropics/claude-code/issues/42500), [#42488](https://github.com/anthropics/claude-code/issues/42488) |
| 9 | Model Response Quality and Instruction Following | 11 | 3.8 | Reliability | [#42636](https://github.com/anthropics/claude-code/issues/42636), [#42634](https://github.com/anthropics/claude-code/issues/42634), [#42633](https://github.com/anthropics/claude-code/issues/42633) |
| 10 | Background Agent Lifecycle and Reliability Management | 8 | 3.7 | Developer Experience | [#42621](https://github.com/anthropics/claude-code/issues/42621), [#42545](https://github.com/anthropics/claude-code/issues/42545), [#42541](https://github.com/anthropics/claude-code/issues/42541) |

## 上升最快的需求

| 需求 | 上升倍率 | 本周 | 分类 |
| --- | --- | --- | --- |
| TUI Terminal State and Input Handling Fixes | 52.0x | 51 | UI/UX |
| MCP Server Reliability and Configuration Issues | 34.0x | 33 | Integration |
| CLI Session Management and UX Improvements | 33.0x | 32 | Developer Experience |
| Bug Fixes and Feature Enhancements | 32.0x | 31 | Developer Experience |
| Configuration and Settings Management Improvements | 18.0x | 17 | Configuration |

## 分类分布

- **Developer Experience**: 12 个簇
- **Reliability**: 7 个簇
- **Integration**: 4 个簇
- **Configuration**: 3 个簇
- **UI/UX**: 2 个簇
- **Security**: 2 个簇
- **Performance**: 2 个簇
- **Documentation**: 1 个簇

## 所有需求簇

### 1. MCP Server Reliability and Configuration Issues

Users are experiencing multiple reliability issues with MCP (Model Context Protocol) server integration, including connection failures, authentication problems with OAuth callbacks, and context length constraints when many servers are configured. These issues span different execution environments like remote triggers, scheduled agents, and Windows platforms, suggesting systemic gaps in MCP connectivity, error handling, and configuration management that need to be addressed for stable MCP server operations.

- **数量:** 33 条 issue (31 未关闭, 2 已关闭)
- **需求得分:** 15.4
- **平均反应:** 0.1 | **平均评论:** 0.9
- **示例 Issue:** [#42632](https://github.com/anthropics/claude-code/issues/42632), [#42628](https://github.com/anthropics/claude-code/issues/42628), [#42627](https://github.com/anthropics/claude-code/issues/42627), [#42599](https://github.com/anthropics/claude-code/issues/42599), [#42579](https://github.com/anthropics/claude-code/issues/42579)

### 2. TUI Terminal State and Input Handling Fixes

Users are experiencing various terminal interface issues including state corruption when spawning external editors, unresponsive input during multi-agent execution, improper screen clearing, and missing scrollback/history display. These problems stem from inadequate handling of terminal protocols (kitty keyboard, mouse tracking), escape sequence leaks, and scroll behavior during different interaction phases. Fixing these issues will ensure a more reliable and consistent terminal user experience.

- **数量:** 51 条 issue (43 未关闭, 8 已关闭)
- **需求得分:** 13.8
- **平均反应:** 0.2 | **平均评论:** 1.1
- **示例 Issue:** [#42638](https://github.com/anthropics/claude-code/issues/42638), [#42617](https://github.com/anthropics/claude-code/issues/42617), [#42613](https://github.com/anthropics/claude-code/issues/42613), [#42612](https://github.com/anthropics/claude-code/issues/42612), [#42606](https://github.com/anthropics/claude-code/issues/42606)

### 3. CLI Session Management and UX Improvements

These issues request improvements to the CLI experience including better session management (resuming sessions via --resume flag, programmatic session renaming, fixing Remote Control session visibility), enhanced output (immediate status line rendering, streaming plain-text for CI/CD, per-request token reporting), and fixes for common problems like hanging behavior with large files, token limit handling, and command recognition issues. Users want a more reliable and informative CLI that handles edge cases gracefully.

- **数量:** 32 条 issue (24 未关闭, 8 已关闭)
- **需求得分:** 7.9
- **平均反应:** 0.2 | **平均评论:** 1.1
- **示例 Issue:** [#42637](https://github.com/anthropics/claude-code/issues/42637), [#42624](https://github.com/anthropics/claude-code/issues/42624), [#42607](https://github.com/anthropics/claude-code/issues/42607), [#42596](https://github.com/anthropics/claude-code/issues/42596), [#42589](https://github.com/anthropics/claude-code/issues/42589)

### 4. Plugin System Management and Reliability

Users want a more robust plugin system with proper installation, uninstallation, and update workflows. Key improvements include support for external plugin sources via remote URLs, better configuration for local development overrides, and fixes for plugin hook environment variables, marketplace validation, and skill resolution state after reloading.

- **数量:** 12 条 issue (12 未关闭, 0 已关闭)
- **需求得分:** 6.0
- **平均反应:** 0 | **平均评论:** 0.5
- **示例 Issue:** [#42601](https://github.com/anthropics/claude-code/issues/42601), [#42595](https://github.com/anthropics/claude-code/issues/42595), [#42568](https://github.com/anthropics/claude-code/issues/42568), [#42564](https://github.com/anthropics/claude-code/issues/42564), [#42471](https://github.com/anthropics/claude-code/issues/42471)

### 5. Bug Fixes and Feature Enhancements

Users are reporting various bugs and requesting improvements across multiple areas including error handling reliability, platform-specific fixes for Windows and Android, configuration flexibility, and UI/UX refinements. These issues range from critical problems like silent crashes and connection failures to minor but important enhancements like input focus behavior and navigation improvements.

- **数量:** 31 条 issue (26 未关闭, 5 已关闭)
- **需求得分:** 5.6
- **平均反应:** 0.1 | **平均评论:** 1
- **示例 Issue:** [#42635](https://github.com/anthropics/claude-code/issues/42635), [#42631](https://github.com/anthropics/claude-code/issues/42631), [#42623](https://github.com/anthropics/claude-code/issues/42623), [#42615](https://github.com/anthropics/claude-code/issues/42615), [#42610](https://github.com/anthropics/claude-code/issues/42610)

### 6. Expand Hook System Functionality and Fix Hook Behaviors

Users are requesting expanded hook capabilities including new lifecycle events (TeamCreated/TeamDeleted, companion reactions), improved configuration options for marketplace hooks and Plan Mode notifications, and bash syntax support. Additionally, several bugs need fixing where hooks fail to fire in specific scenarios like Desktop App tool execution and Agent-spawned teammates, plus documentation gaps around format-on-save behavior.

- **数量:** 10 条 issue (9 未关闭, 1 已关闭)
- **需求得分:** 4.2
- **平均反应:** 0.1 | **平均评论:** 0.8
- **示例 Issue:** [#42597](https://github.com/anthropics/claude-code/issues/42597), [#42581](https://github.com/anthropics/claude-code/issues/42581), [#42489](https://github.com/anthropics/claude-code/issues/42489), [#42487](https://github.com/anthropics/claude-code/issues/42487), [#42396](https://github.com/anthropics/claude-code/issues/42396)

### 7. Authentication and subscription reliability fixes

Users are experiencing multiple authentication and subscription verification issues across platforms, including broken auto-mode for Max subscribers, session handling failures on Windows/macOS, OAuth token invalidation problems for plugins, and platform-specific bugs with the MCP server and rate limit refresh. These issues prevent reliable authentication and subscription status detection across different environments.

- **数量:** 10 条 issue (10 未关闭, 0 已关闭)
- **需求得分:** 4.2
- **平均反应:** 0.1 | **平均评论:** 1.2
- **示例 Issue:** [#42608](https://github.com/anthropics/claude-code/issues/42608), [#42605](https://github.com/anthropics/claude-code/issues/42605), [#42603](https://github.com/anthropics/claude-code/issues/42603), [#42576](https://github.com/anthropics/claude-code/issues/42576), [#42530](https://github.com/anthropics/claude-code/issues/42530)

### 8. Permission System Reliability and Security Fixes

Users want fixes for multiple permission system issues including bypassPermissions mode edge cases on Windows, silent behavior degradation, and security vulnerabilities in shell command parsing. These include proper UNC path handling, complete prompt suppression when configured, strengthened security checks for subshells and quoting, and a more extensible JSON Schema-based permission rule system with clearer documentation.

- **数量:** 11 条 issue (10 未关闭, 1 已关闭)
- **需求得分:** 4.0
- **平均反应:** 0 | **平均评论:** 0.7
- **示例 Issue:** [#42611](https://github.com/anthropics/claude-code/issues/42611), [#42500](https://github.com/anthropics/claude-code/issues/42500), [#42488](https://github.com/anthropics/claude-code/issues/42488), [#42457](https://github.com/anthropics/claude-code/issues/42457), [#42428](https://github.com/anthropics/claude-code/issues/42428)

### 9. Model Response Quality and Instruction Following

Users are experiencing significant quality degradation in AI model outputs, including hallucinations, incorrect tool selection (using Write instead of Edit causing silent data loss), and failures to accurately follow instructions. These issues undermine trust in the system, especially as degradation worsens with context compression or large contexts. Users need consistent, reliable output that matches the expected quality level.

- **数量:** 11 条 issue (11 未关闭, 0 已关闭)
- **需求得分:** 3.8
- **平均反应:** 0.1 | **平均评论:** 0.8
- **示例 Issue:** [#42636](https://github.com/anthropics/claude-code/issues/42636), [#42634](https://github.com/anthropics/claude-code/issues/42634), [#42633](https://github.com/anthropics/claude-code/issues/42633), [#42629](https://github.com/anthropics/claude-code/issues/42629), [#42618](https://github.com/anthropics/claude-code/issues/42618)

### 10. Background Agent Lifecycle and Reliability Management

Users need better control and visibility over background agents, including the ability to stop agents on demand, receive real-time completion notifications, and have automatic recovery mechanisms when agents stall or encounter issues like context exhaustion. These improvements would make long-running background agent sessions more reliable and easier to manage.

- **数量:** 8 条 issue (6 未关闭, 2 已关闭)
- **需求得分:** 3.7
- **平均反应:** 0 | **平均评论:** 1.4
- **示例 Issue:** [#42621](https://github.com/anthropics/claude-code/issues/42621), [#42545](https://github.com/anthropics/claude-code/issues/42545), [#42541](https://github.com/anthropics/claude-code/issues/42541), [#42514](https://github.com/anthropics/claude-code/issues/42514), [#42497](https://github.com/anthropics/claude-code/issues/42497)

### 11. Fix desktop app stability and reliability issues

Users are experiencing critical bugs in the desktop application including UI rendering failures, excessive latency, permission issues preventing project access, and silent failures from corrupted state. These issues undermine trust in the desktop client and need to be addressed to provide a reliable development experience.

- **数量:** 6 条 issue (6 未关闭, 0 已关闭)
- **需求得分:** 3.5
- **平均反应:** 0.2 | **平均评论:** 1.7
- **示例 Issue:** [#42554](https://github.com/anthropics/claude-code/issues/42554), [#42515](https://github.com/anthropics/claude-code/issues/42515), [#42433](https://github.com/anthropics/claude-code/issues/42433), [#42415](https://github.com/anthropics/claude-code/issues/42415), [#42393](https://github.com/anthropics/claude-code/issues/42393)

### 12. Fix Cowork VM workspace reliability issues on Windows

Users are experiencing multiple reliability issues with Cowork VM workspaces, including service startup failures, connection timeouts, session management problems, and virtualization detection failures on Windows. These issues span core functionality like FUSE cache coherency, rate limit state management, session deletion behavior, and guest kernel initialization that prevent consistent, reliable operation of virtual workspace environments.

- **数量:** 9 条 issue (8 未关闭, 1 已关闭)
- **需求得分:** 3.0
- **平均反应:** 0 | **平均评论:** 1
- **示例 Issue:** [#42614](https://github.com/anthropics/claude-code/issues/42614), [#42591](https://github.com/anthropics/claude-code/issues/42591), [#42578](https://github.com/anthropics/claude-code/issues/42578), [#42557](https://github.com/anthropics/claude-code/issues/42557), [#42520](https://github.com/anthropics/claude-code/issues/42520)

### 13. Configuration and Settings Management Improvements

Users want better control over Claude Code's configuration through settings.json and environment variables, including conversation retention, context compaction, companion customization, and model routing. Several issues address bugs where configuration changes aren't properly respected—like PATH environment variables, mode switching, and auto-compact settings—indicating inconsistent configuration application across the application.

- **数量:** 17 条 issue (16 未关闭, 1 已关闭)
- **需求得分:** 2.9
- **平均反应:** 0.2 | **平均评论:** 1.4
- **示例 Issue:** [#42625](https://github.com/anthropics/claude-code/issues/42625), [#42619](https://github.com/anthropics/claude-code/issues/42619), [#42602](https://github.com/anthropics/claude-code/issues/42602), [#42590](https://github.com/anthropics/claude-code/issues/42590), [#42566](https://github.com/anthropics/claude-code/issues/42566)

### 14. Excessive API token consumption and tracking issues

Users are experiencing excessive token consumption across multiple scenarios including reading large files, simple interactions, and failing requests. They also report discrepancies between rate limit error messages and usage statistics, making it difficult to track actual resource consumption. These issues lead to unexpected costs and poor visibility into token usage patterns.

- **数量:** 4 条 issue (3 未关闭, 1 已关闭)
- **需求得分:** 2.8
- **平均反应:** 0.8 | **平均评论:** 1.8
- **示例 Issue:** [#42583](https://github.com/anthropics/claude-code/issues/42583), [#42483](https://github.com/anthropics/claude-code/issues/42483), [#42414](https://github.com/anthropics/claude-code/issues/42414), [#42390](https://github.com/anthropics/claude-code/issues/42390)

### 15. Companion visual customization and UI fixes

Users want improved visual customization options for their companion, including selectable avatar appearances with presets and custom images, as well as companion pet selection with multiple character options. Additionally, there is a bug where duplicate assistant message blocks appear during rapid message sending that needs to be fixed.

- **数量:** 3 条 issue (3 未关闭, 0 已关闭)
- **需求得分:** 2.3
- **平均反应:** 0.3 | **平均评论:** 1
- **示例 Issue:** [#42586](https://github.com/anthropics/claude-code/issues/42586), [#42472](https://github.com/anthropics/claude-code/issues/42472), [#42331](https://github.com/anthropics/claude-code/issues/42331)

### 16. Resource Management and Memory Optimization

Users are experiencing crashes and excessive resource consumption during extended sessions. They want improved caching strategies to reduce token usage, automatic cleanup of temporary files, and configurable controls for context management to prevent memory issues while preserving session state.

- **数量:** 6 条 issue (5 未关闭, 1 已关闭)
- **需求得分:** 2.3
- **平均反应:** 1 | **平均评论:** 2.3
- **示例 Issue:** [#42620](https://github.com/anthropics/claude-code/issues/42620), [#42592](https://github.com/anthropics/claude-code/issues/42592), [#42542](https://github.com/anthropics/claude-code/issues/42542), [#42443](https://github.com/anthropics/claude-code/issues/42443), [#42388](https://github.com/anthropics/claude-code/issues/42388)

### 17. VS Code extension improvements and editor UX fixes

Users are requesting various quality-of-life improvements for the VS Code extension, including better file path visibility in approval dialogs, local worktree/cloud mode toggles, hunk-level diff review, and clipboard support for references. Additionally, multiple UI/UX bugs are affecting the editor experience, such as timer accumulation on collapsible sections, editor focus jumping issues, temp file deletion problems, and session restoration failures after streaming. These changes aim to make the extension more reliable and aligned with modern IDE conventions like Cursor.

- **数量:** 10 条 issue (10 未关闭, 0 已关闭)
- **需求得分:** 2.1
- **平均反应:** 0.1 | **平均评论:** 0.7
- **示例 Issue:** [#42630](https://github.com/anthropics/claude-code/issues/42630), [#42622](https://github.com/anthropics/claude-code/issues/42622), [#42577](https://github.com/anthropics/claude-code/issues/42577), [#42544](https://github.com/anthropics/claude-code/issues/42544), [#42531](https://github.com/anthropics/claude-code/issues/42531)

### 18. API reliability and error handling improvements

Users are experiencing various API reliability issues including spurious rate limit errors, excessive API consumption from retry loops, and signature errors. They want improved client-side validation to prevent oversized data from reaching the API and more robust error handling to ensure stable, predictable API interactions.

- **数量:** 4 条 issue (3 未关闭, 1 已关闭)
- **需求得分:** 2.0
- **平均反应:** 0 | **平均评论:** 2.5
- **示例 Issue:** [#42616](https://github.com/anthropics/claude-code/issues/42616), [#42558](https://github.com/anthropics/claude-code/issues/42558), [#42409](https://github.com/anthropics/claude-code/issues/42409), [#42373](https://github.com/anthropics/claude-code/issues/42373)

### 19. Fix IDE integration issues across platforms

These issues address bugs and improvements for cross-platform IDE integration, particularly in WSL and Windows environments. Users experience crashes, connection failures, and path format mismatches when using VS Code and JetBrains plugins across different platforms. A new setting for diff viewing in VS Code's side panel would also improve the development workflow.

- **数量:** 4 条 issue (3 未关闭, 1 已关闭)
- **需求得分:** 2.0
- **平均反应:** 0 | **平均评论:** 1
- **示例 Issue:** [#42550](https://github.com/anthropics/claude-code/issues/42550), [#42547](https://github.com/anthropics/claude-code/issues/42547), [#42484](https://github.com/anthropics/claude-code/issues/42484), [#42347](https://github.com/anthropics/claude-code/issues/42347)

### 20. Improve Bash tool reliability and robustness

Users are reporting several reliability issues with the Bash tool including crashes when encountering certain redirects, orphaned background processes from unhandled termination signals, inconsistent approval persistence for compound commands, and unclear error messages for operations like disk space issues. They want the Bash tool to handle these edge cases gracefully without crashing and with clear user feedback.

- **数量:** 4 条 issue (4 未关闭, 0 已关闭)
- **需求得分:** 2.0
- **平均反应:** 0 | **平均评论:** 1
- **示例 Issue:** [#42563](https://github.com/anthropics/claude-code/issues/42563), [#42532](https://github.com/anthropics/claude-code/issues/42532), [#42461](https://github.com/anthropics/claude-code/issues/42461), [#42324](https://github.com/anthropics/claude-code/issues/42324)

### 21. Fix Read and Bash Tool Bugs

Users are experiencing multiple reliability issues with the Read and Bash tools that disrupt development workflows. These include file path handling failures with Unicode characters, environment PATH inheritance problems preventing Homebrew executable discovery, unexpected file reversion after test execution, and error handling that corrupts session state. Fixing these bugs will restore developer trust and ensure consistent tool behavior.

- **数量:** 4 条 issue (4 未关闭, 0 已关闭)
- **需求得分:** 1.7
- **平均反应:** 0 | **平均评论:** 1.8
- **示例 Issue:** [#42427](https://github.com/anthropics/claude-code/issues/42427), [#42399](https://github.com/anthropics/claude-code/issues/42399), [#42383](https://github.com/anthropics/claude-code/issues/42383), [#42330](https://github.com/anthropics/claude-code/issues/42330)

### 22. StatusLine JSON Payload Improvements

These issues relate to improving the statusLine JSON payload functionality. Users want fixes for stale update notifications when resuming sessions post-upgrade, and want additional information like effort level exposed in the JSON payload. These enhancements improve the integration capabilities for developers using the tool programmatically.

- **数量:** 2 条 issue (2 未关闭, 0 已关闭)
- **需求得分:** 1.7
- **平均反应:** 0.5 | **平均评论:** 1
- **示例 Issue:** [#42454](https://github.com/anthropics/claude-code/issues/42454), [#42358](https://github.com/anthropics/claude-code/issues/42358)

### 23. Issues related to documentation

6 issues: Add PowerShell-specific permission-check documentation to explain security model, background job behavior, and parse-failure handling; Document the rate-limit options dialog that appears when users hit their usage limit; Document prompt cache behavior for resumed sessions with MCP servers, deferred tools, and custom agents

- **数量:** 6 条 issue (6 未关闭, 0 已关闭)
- **需求得分:** 1.7
- **平均反应:** 0.5 | **平均评论:** 0.2
- **示例 Issue:** [#42318](https://github.com/anthropics/claude-code/issues/42318), [#42316](https://github.com/anthropics/claude-code/issues/42316), [#42309](https://github.com/anthropics/claude-code/issues/42309), [#42308](https://github.com/anthropics/claude-code/issues/42308), [#42306](https://github.com/anthropics/claude-code/issues/42306)

### 24. Fix skills loading from nested subdirectories

Users want project-level skills to load correctly from nested .claude/skills/ subdirectories. Currently, skills in nested directories either fail to load or get registered twice, resulting in duplicate entries in the slash command autocomplete menu and a poor developer experience.

- **数量:** 2 条 issue (1 未关闭, 1 已关闭)
- **需求得分:** 1.5
- **平均反应:** 0 | **平均评论:** 1.5
- **示例 Issue:** [#42573](https://github.com/anthropics/claude-code/issues/42573), [#42384](https://github.com/anthropics/claude-code/issues/42384)

### 25. Fix context window size handling for auto-compaction

Users need the system to properly respect actual model context window sizes instead of using hardcoded defaults for auto-compaction thresholds. Additionally, a regression has reduced context window capacity from 1M to 200K tokens, significantly impacting the ability to work with larger contexts. These issues affect functionality when using models with varying context window capabilities.

- **数量:** 2 条 issue (1 未关闭, 1 已关闭)
- **需求得分:** 1.3
- **平均反应:** 0.5 | **平均评论:** 2
- **示例 Issue:** [#42375](https://github.com/anthropics/claude-code/issues/42375), [#42325](https://github.com/anthropics/claude-code/issues/42325)

### 26. Improve operational reliability and validation safeguards

Users need the agent to reliably execute all agreed-upon steps in multi-step plans without silently dropping operations, and they want validation safeguards to prevent costly configuration errors with paid external APIs. Both issues address the need for the system to operate predictably and prevent errors that could result in unexpected costs or incomplete work.

- **数量:** 2 条 issue (2 未关闭, 0 已关闭)
- **需求得分:** 1.2
- **平均反应:** 0 | **平均评论:** 2.5
- **示例 Issue:** [#42421](https://github.com/anthropics/claude-code/issues/42421), [#42329](https://github.com/anthropics/claude-code/issues/42329)

### 27. Improve installation and upgrade experience

Users want their customizations and environment configurations to persist through installation and upgrade processes. Specifically, they need the Windows installer to automatically configure PATH for .local\bin and preserve buddy customizations across versions. This reduces friction when setting up or updating the tool.

- **数量:** 2 条 issue (2 未关闭, 0 已关闭)
- **需求得分:** 1.2
- **平均反应:** 0.5 | **平均评论:** 1
- **示例 Issue:** [#42377](https://github.com/anthropics/claude-code/issues/42377), [#42337](https://github.com/anthropics/claude-code/issues/42337)

### 28. Enhanced git worktree and multi-repo support

Users want Claude Code to handle edge cases when working with git repositories more gracefully. This includes preserving valid characters like '/' in branch names when creating worktrees (while only sanitizing directory-unsafe characters), and loading configuration files like CLAUDE.md from target repositories during cross-repo operations. These improvements would make working with monorepos and complex git setups more reliable.

- **数量:** 2 条 issue (1 未关闭, 1 已关闭)
- **需求得分:** 1.0
- **平均反应:** 0 | **平均评论:** 0.5
- **示例 Issue:** [#42600](https://github.com/anthropics/claude-code/issues/42600), [#42402](https://github.com/anthropics/claude-code/issues/42402)

### 29. Improve trust and safety mechanisms

Users want the application to handle trust and safety more intelligently. This includes restricting dangerous code execution from project-level settings, correctly parsing git commands with special syntax, and eliminating excessive confirmation prompts that create friction without meaningfully improving security.

- **数量:** 3 条 issue (3 未关闭, 0 已关闭)
- **需求得分:** 1.0
- **平均反应:** 0 | **平均评论:** 0.3
- **示例 Issue:** [#42593](https://github.com/anthropics/claude-code/issues/42593), [#42426](https://github.com/anthropics/claude-code/issues/42426), [#42410](https://github.com/anthropics/claude-code/issues/42410)

### 30. Fix clipboard operations across environments and locales

Users are experiencing issues with clipboard functionality in terminal environments. One issue involves Korean text corruption during copy operations with the new renderer, while another relates to clipboard image pasting in WSL2 environments. These fixes aim to improve clipboard reliability across different system configurations and locales.

- **数量:** 2 条 issue (2 未关闭, 0 已关闭)
- **需求得分:** 1.0
- **平均反应:** 0 | **平均评论:** 1
- **示例 Issue:** [#42482](https://github.com/anthropics/claude-code/issues/42482), [#42440](https://github.com/anthropics/claude-code/issues/42440)

### 31. Background process management and PATH preservation

Users want to run preview dev servers as background processes without spawning visible terminal windows on Windows, and ensure PATH environment variables are preserved when spawning child processes. This improves the development workflow by reducing window clutter and preventing tools from failing due to missing PATH configurations.

- **数量:** 2 条 issue (2 未关闭, 0 已关闭)
- **需求得分:** 1.0
- **平均反应:** 0 | **平均评论:** 0.5
- **示例 Issue:** [#42455](https://github.com/anthropics/claude-code/issues/42455), [#42435](https://github.com/anthropics/claude-code/issues/42435)

### 32. Add internationalization and localization support

Users want the application to support multiple languages, both for the main UI text and for companion features like Buddy comments and Baublekin. This includes adding Russian language support and a general i18n framework to enable future language additions. This is important for non-English speaking users and broader international adoption.

- **数量:** 3 条 issue (3 未关闭, 0 已关闭)
- **需求得分:** 1.0
- **平均反应:** 0 | **平均评论:** 0.3
- **示例 Issue:** [#42439](https://github.com/anthropics/claude-code/issues/42439), [#42403](https://github.com/anthropics/claude-code/issues/42403), [#42346](https://github.com/anthropics/claude-code/issues/42346)

### 33. Improve keyboard bindings and input handling

Users want more flexible and reliable keyboard bindings across platforms, including configurable shortcuts, proper international keyboard support, correct custom binding override behavior, and improved keybinding file management. These improvements would enhance the developer experience for users who rely on keyboard-driven workflows.

- **数量:** 5 条 issue (5 未关闭, 0 已关闭)
- **需求得分:** 0.0
- **平均反应:** 0 | **平均评论:** 0
- **示例 Issue:** [#42567](https://github.com/anthropics/claude-code/issues/42567), [#42533](https://github.com/anthropics/claude-code/issues/42533), [#42523](https://github.com/anthropics/claude-code/issues/42523), [#42503](https://github.com/anthropics/claude-code/issues/42503), [#42450](https://github.com/anthropics/claude-code/issues/42450)

---

*本报告仅分析公开 GitHub Issues，代表的是公开讨论中的需求信号，并非全部用户的声音。*

*由 [ReadYourUsers](https://github.com/fanjingwen/ReadYourUsers) 生成*