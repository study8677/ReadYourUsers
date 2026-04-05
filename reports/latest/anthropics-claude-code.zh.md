# Claude Code — 用户需求报告

**周:** 2026-W15
**生成日期:** 2026-04-05
**分析 Issue 数:** 2122 (2075 纳入分析)
**需求簇:** 25

## Top 10 用户需求

| 排名 | 需求 | Issue 数 | 得分 | 分类 | 示例 |
| --- | --- | --- | --- | --- | --- |
| 1 | CLI Session Management and Stability Improvements | 2023 | 20.3 | Developer Experience | [#42637](https://github.com/anthropics/claude-code/issues/42637), [#42624](https://github.com/anthropics/claude-code/issues/42624), [#42607](https://github.com/anthropics/claude-code/issues/42607) |
| 2 | Custom commands in .claude/commands/ not recognized | 2 | 0.1 | Developer Experience | [#41832](https://github.com/anthropics/claude-code/issues/41832), [#41243](https://github.com/anthropics/claude-code/issues/41243) |
| 3 | Reduce excessive token consumption | 2 | 0.1 | Performance | [#41035](https://github.com/anthropics/claude-code/issues/41035), [#40997](https://github.com/anthropics/claude-code/issues/40997) |
| 4 | Fix excessive token consumption | 2 | 0.0 | Performance | [#42181](https://github.com/anthropics/claude-code/issues/42181), [#40790](https://github.com/anthropics/claude-code/issues/40790) |
| 5 | Preserve transcript and history during subagent execution | 2 | 0.0 | Reliability | [#42283](https://github.com/anthropics/claude-code/issues/42283), [#40892](https://github.com/anthropics/claude-code/issues/40892) |
| 6 | Companion UI visibility toggle setting | 2 | 0.0 | Configuration | [#42287](https://github.com/anthropics/claude-code/issues/42287), [#41942](https://github.com/anthropics/claude-code/issues/41942) |
| 7 | Fix Unexpected High Resource Consumption | 3 | 0.0 | Performance | [#41425](https://github.com/anthropics/claude-code/issues/41425), [#41385](https://github.com/anthropics/claude-code/issues/41385), [#41200](https://github.com/anthropics/claude-code/issues/41200) |
| 8 | Fix MCP connectors not loading in Remote Trigger | 2 | 0.0 | Reliability | [#42599](https://github.com/anthropics/claude-code/issues/42599), [#41934](https://github.com/anthropics/claude-code/issues/41934) |
| 9 | Add settings to disable companion features | 3 | 0.0 | Configuration | [#42506](https://github.com/anthropics/claude-code/issues/42506), [#42212](https://github.com/anthropics/claude-code/issues/42212), [#41091](https://github.com/anthropics/claude-code/issues/41091) |
| 10 | Fix rate limit false positive errors | 2 | 0.0 | Reliability | [#40748](https://github.com/anthropics/claude-code/issues/40748), [#40536](https://github.com/anthropics/claude-code/issues/40536) |

## 上升最快的需求

| 需求 | 上升倍率 | 本周 | 分类 |
| --- | --- | --- | --- |
| CLI Session Management and Stability Improvements | 13.9x | 2023 | Developer Experience |
| Fix Unexpected High Resource Consumption | 4.0x | 3 | Performance |
| Add settings to disable companion features | 4.0x | 3 | Configuration |
| MCP connector tools availability in sessions | 4.0x | 3 | Integration |
| Custom commands in .claude/commands/ not recognized | 3.0x | 2 | Developer Experience |

## 分类分布

- **Developer Experience**: 7 个簇
- **Reliability**: 7 个簇
- **Configuration**: 4 个簇
- **Performance**: 3 个簇
- **Platform Support**: 2 个簇
- **UI/UX**: 1 个簇
- **Integration**: 1 个簇

## 所有需求簇

### 1. CLI Session Management and Stability Improvements

Users want improved CLI session handling including better startup status display, session resumption via --resume flag, and fixes for sessions disappearing from the sidebar. They're also asking for stability improvements like preventing hangs with large files, better token limit handling, and fixes for command recognition and argument parsing issues.

- **数量:** 2023 条 issue (1636 未关闭, 387 已关闭)
- **需求得分:** 20.3
- **平均反应:** 0.7 | **平均评论:** 1.5
- **示例 Issue:** [#42637](https://github.com/anthropics/claude-code/issues/42637), [#42624](https://github.com/anthropics/claude-code/issues/42624), [#42607](https://github.com/anthropics/claude-code/issues/42607), [#42596](https://github.com/anthropics/claude-code/issues/42596), [#42589](https://github.com/anthropics/claude-code/issues/42589)

### 2. Custom commands in .claude/commands/ not recognized

Users are reporting that custom commands they create in the .claude/commands/ directory are not being recognized by the CLI. This prevents users from using their custom slash commands, disrupting their workflow and productivity.

- **数量:** 2 条 issue (2 未关闭, 0 已关闭)
- **需求得分:** 0.1
- **平均反应:** 6 | **平均评论:** 7
- **示例 Issue:** [#41832](https://github.com/anthropics/claude-code/issues/41832), [#41243](https://github.com/anthropics/claude-code/issues/41243)

### 3. Reduce excessive token consumption

Users are experiencing excessive token usage during both simple prompts and failed operations, leading to unnecessary resource consumption and increased costs. They want the system to optimize token usage to reduce waste and improve efficiency.

- **数量:** 2 条 issue (2 未关闭, 0 已关闭)
- **需求得分:** 0.1
- **平均反应:** 5.5 | **平均评论:** 3
- **示例 Issue:** [#41035](https://github.com/anthropics/claude-code/issues/41035), [#40997](https://github.com/anthropics/claude-code/issues/40997)

### 4. Fix excessive token consumption

Users are experiencing excessive token consumption both during extended usage sessions and in sudden spikes. This leads to increased operational costs and potential performance degradation. Users want these consumption issues identified and resolved to achieve more efficient and predictable token usage.

- **数量:** 2 条 issue (2 未关闭, 0 已关闭)
- **需求得分:** 0.0
- **平均反应:** 3 | **平均评论:** 2.5
- **示例 Issue:** [#42181](https://github.com/anthropics/claude-code/issues/42181), [#40790](https://github.com/anthropics/claude-code/issues/40790)

### 5. Preserve transcript and history during subagent execution

Users need transcript and terminal history to persist reliably during subagent execution. Currently, both disappear unexpectedly when subagents run, disrupting workflow continuity and making it difficult to review what happened. This data loss impacts debugging, auditing, and overall user confidence in the system's reliability.

- **数量:** 2 条 issue (2 未关闭, 0 已关闭)
- **需求得分:** 0.0
- **平均反应:** 2.5 | **平均评论:** 2
- **示例 Issue:** [#42283](https://github.com/anthropics/claude-code/issues/42283), [#40892](https://github.com/anthropics/claude-code/issues/40892)

### 6. Companion UI visibility toggle setting

Users want the ability to disable or hide companion UI elements (like Clatter or Welkin) through a configuration setting. This gives users control over their interface, allowing them to reduce visual clutter or hide elements they don't use.

- **数量:** 2 条 issue (2 未关闭, 0 已关闭)
- **需求得分:** 0.0
- **平均反应:** 2 | **平均评论:** 2
- **示例 Issue:** [#42287](https://github.com/anthropics/claude-code/issues/42287), [#41942](https://github.com/anthropics/claude-code/issues/41942)

### 7. Fix Unexpected High Resource Consumption

Users are experiencing unexpectedly high token and API usage consumption and need investigation tools and fixes to identify and resolve the root causes. This impacts cost management and operational efficiency.

- **数量:** 3 条 issue (3 未关闭, 0 已关闭)
- **需求得分:** 0.0
- **平均反应:** 2.7 | **平均评论:** 0.7
- **示例 Issue:** [#41425](https://github.com/anthropics/claude-code/issues/41425), [#41385](https://github.com/anthropics/claude-code/issues/41385), [#41200](https://github.com/anthropics/claude-code/issues/41200)

### 8. Fix MCP connectors not loading in Remote Trigger

Users report that MCP cloud connectors and OAuth-based MCP connector credentials fail to load when executing in a Remote Trigger environment. This breaks workflows that depend on MCP integrations, preventing developers from using their configured connectors in remote/triggered executions.

- **数量:** 2 条 issue (1 未关闭, 1 已关闭)
- **需求得分:** 0.0
- **平均反应:** 1 | **平均评论:** 2
- **示例 Issue:** [#42599](https://github.com/anthropics/claude-code/issues/42599), [#41934](https://github.com/anthropics/claude-code/issues/41934)

### 9. Add settings to disable companion features

Users want the ability to disable various companion features like the pet in the TUI, companion buddy, and system-injected task reminders. These optional features are not useful for all users, so providing settings to disable them would improve user experience and reduce distractions.

- **数量:** 3 条 issue (3 未关闭, 0 已关闭)
- **需求得分:** 0.0
- **平均反应:** 0 | **平均评论:** 1.7
- **示例 Issue:** [#42506](https://github.com/anthropics/claude-code/issues/42506), [#42212](https://github.com/anthropics/claude-code/issues/42212), [#41091](https://github.com/anthropics/claude-code/issues/41091)

### 10. Fix rate limit false positive errors

Users are experiencing false positive rate limit errors even when their usage is well below limits or shows 0%. These incorrect error triggers cause unnecessary interruptions and reduce trust in the rate limiting system. Users need accurate rate limit detection that only triggers when limits are actually exceeded.

- **数量:** 2 条 issue (2 未关闭, 0 已关闭)
- **需求得分:** 0.0
- **平均反应:** 2 | **平均评论:** 1.5
- **示例 Issue:** [#40748](https://github.com/anthropics/claude-code/issues/40748), [#40536](https://github.com/anthropics/claude-code/issues/40536)

### 11. Linux Voice Dictation Dropping Words

Users on Linux are experiencing voice dictation that drops words and sentences, failing to reliably capture spoken input. This intermittent failure causes incomplete dictation and lost content. The issue appears specific to the Linux platform and requires fixes to ensure reliable speech-to-text capture.

- **数量:** 2 条 issue (1 未关闭, 1 已关闭)
- **需求得分:** 0.0
- **平均反应:** 0.5 | **平均评论:** 2
- **示例 Issue:** [#40722](https://github.com/anthropics/claude-code/issues/40722), [#40691](https://github.com/anthropics/claude-code/issues/40691)

### 12. Fix Cowork virtualization detection on Windows Hyper-V

Users on Windows 11 with properly enabled Hyper-V report that Cowork fails to detect virtualization, even when all related features and services are running correctly. This detection failure prevents Cowork from functioning properly on these systems, requiring users to find workarounds or disable Hyper-V entirely. The issue appears consistent across different Windows 11 versions and configurations.

- **数量:** 3 条 issue (3 未关闭, 0 已关闭)
- **需求得分:** 0.0
- **平均反应:** 0 | **平均评论:** 1.3
- **示例 Issue:** [#42381](https://github.com/anthropics/claude-code/issues/42381), [#41962](https://github.com/anthropics/claude-code/issues/41962), [#40427](https://github.com/anthropics/claude-code/issues/40427)

### 13. Fix macOS 26 Tahoe compatibility issues

Users are experiencing native macOS bridge and accessibility module initialization failures when running the computer-use MCP server on macOS 26 (Tahoma). These platform-specific initialization issues prevent the server from functioning correctly on the new macOS version, requiring fixes to the native bridge code and accessibility module to ensure proper compatibility.

- **数量:** 2 条 issue (1 未关闭, 1 已关闭)
- **需求得分:** 0.0
- **平均反应:** 0 | **平均评论:** 2
- **示例 Issue:** [#41606](https://github.com/anthropics/claude-code/issues/41606), [#41207](https://github.com/anthropics/claude-code/issues/41207)

### 14. Companion Species Selection and Customization

Users want to select different species for their /buddy companions and have customization options available. This would allow users to personalize their companion experience by choosing preferred species and tailoring their appearance or attributes to their liking.

- **数量:** 2 条 issue (1 未关闭, 1 已关闭)
- **需求得分:** 0.0
- **平均反应:** 0.5 | **平均评论:** 1.5
- **示例 Issue:** [#41959](https://github.com/anthropics/claude-code/issues/41959), [#41929](https://github.com/anthropics/claude-code/issues/41929)

### 15. Add game metadata fields to statusline JSON

Users want additional game state information exposed in the statusline JSON output, specifically exchange/turn count and effort level. This allows developers and external tools to programmatically access these metrics for analysis, automation, or integration with other systems.

- **数量:** 2 条 issue (2 未关闭, 0 已关闭)
- **需求得分:** 0.0
- **平均反应:** 0 | **平均评论:** 1.5
- **示例 Issue:** [#42168](https://github.com/anthropics/claude-code/issues/42168), [#41049](https://github.com/anthropics/claude-code/issues/41049)

### 16. Fix undefined property access TypeErrors in MCP

Users encounter TypeErrors when using the computer-use MCP server because code attempts to call methods (checkAccessibility, registerEscape) on undefined objects. These runtime errors cause tools to fail and crash the application. The issues indicate initialization or dependency access problems that need proper null/undefined checks or correct ordering of setup code.

- **数量:** 2 条 issue (2 未关闭, 0 已关闭)
- **需求得分:** 0.0
- **平均反应:** 3 | **平均评论:** 0
- **示例 Issue:** [#41404](https://github.com/anthropics/claude-code/issues/41404), [#41118](https://github.com/anthropics/claude-code/issues/41118)

### 17. Preserve Execute Permissions on Bundled Binaries

Users expect bundled binaries to retain their execute permissions during npm installation and package upgrades. When permissions are lost, the binaries become unusable, breaking the package's core functionality. This issue particularly affects packages that ship vendor tools like ripgrep.

- **数量:** 2 条 issue (2 未关闭, 0 已关闭)
- **需求得分:** 0.0
- **平均反应:** 0.5 | **平均评论:** 1
- **示例 Issue:** [#42068](https://github.com/anthropics/claude-code/issues/42068), [#41933](https://github.com/anthropics/claude-code/issues/41933)

### 18. Instruction-Following Degradation After Context Compression

Users are experiencing degradation in the model's ability to follow instructions after context compression is applied. This includes both immediate degradation and progressive worsening over time with continued use. The issue suggests a bug in how context compression affects the model's instruction-following capabilities.

- **数量:** 2 条 issue (2 未关闭, 0 已关闭)
- **需求得分:** 0.0
- **平均反应:** 0 | **平均评论:** 1
- **示例 Issue:** [#42524](https://github.com/anthropics/claude-code/issues/42524), [#42521](https://github.com/anthropics/claude-code/issues/42521)

### 19. Companion name customization via settings

Users want the ability to customize the name of their companion character or buddy through configuration settings. This allows for personalization of the user experience, making interactions with the companion feel more tailored and engaging for individual users.

- **数量:** 2 条 issue (2 未关闭, 0 已关闭)
- **需求得分:** 0.0
- **平均反应:** 0 | **平均评论:** 1
- **示例 Issue:** [#42561](https://github.com/anthropics/claude-code/issues/42561), [#42405](https://github.com/anthropics/claude-code/issues/42405)

### 20. Fix PreToolUse hooks for nested agent tool calls

Users report that PreToolUse hooks fail to fire when tools are invoked by teammates spawned via the Agent tool or by subagents making Bash tool calls. This breaks expected hook behavior and prevents users from monitoring or intercepting these nested tool invocations, which is critical for debugging and custom workflows.

- **数量:** 2 条 issue (0 未关闭, 2 已关闭)
- **需求得分:** 0.0
- **平均反应:** 0 | **平均评论:** 1
- **示例 Issue:** [#42385](https://github.com/anthropics/claude-code/issues/42385), [#40963](https://github.com/anthropics/claude-code/issues/40963)

### 21. computer-use MCP server visibility in CLI

Users expect the computer-use built-in MCP server to appear when running `/mcp list` or other `/mcp` CLI commands, but it currently doesn't. This visibility issue prevents users from discovering and verifying which MCP servers are available, impacting their development workflow.

- **数量:** 2 条 issue (2 未关闭, 0 已关闭)
- **需求得分:** 0.0
- **平均反应:** 0 | **平均评论:** 1
- **示例 Issue:** [#41296](https://github.com/anthropics/claude-code/issues/41296), [#41102](https://github.com/anthropics/claude-code/issues/41102)

### 22. MCP connector tools availability in sessions

Users are experiencing issues where MCP (Model Context Protocol) connector tools are not being properly registered or made discoverable across different session types, including trigger sessions, remote CCR session tool registries, and deferred tool registries. This prevents users from accessing and using these tools in their workflows, limiting the functionality of the MCP integration.

- **数量:** 3 条 issue (2 未关闭, 1 已关闭)
- **需求得分:** 0.0
- **平均反应:** 0 | **平均评论:** 0.3
- **示例 Issue:** [#42228](https://github.com/anthropics/claude-code/issues/42228), [#42166](https://github.com/anthropics/claude-code/issues/42166), [#42165](https://github.com/anthropics/claude-code/issues/42165)

### 23. Fix custom slash command autocomplete

Users are experiencing issues with custom slash command autocomplete functionality. In some cases, commands fail to appear due to spawn/sandbox failures, while in other cases commands from .claude/commands/ are appearing when they shouldn't. Users expect reliable autocomplete for custom commands to improve their workflow.

- **数量:** 2 条 issue (2 未关闭, 0 已关闭)
- **需求得分:** 0.0
- **平均反应:** 0 | **平均评论:** 0.5
- **示例 Issue:** [#42093](https://github.com/anthropics/claude-code/issues/42093), [#41398](https://github.com/anthropics/claude-code/issues/41398)

### 24. Configurable language for auto-generated sessions

Users want the ability to configure the language used for auto-generated session names and titles. Currently, these appear to use a default language that may not match user preferences or localization needs. This feature would enable better internationalization and personalization of session identifiers.

- **数量:** 2 条 issue (2 未关闭, 0 已关闭)
- **需求得分:** 0.0
- **平均反应:** 0 | **平均评论:** 0.5
- **示例 Issue:** [#41478](https://github.com/anthropics/claude-code/issues/41478), [#40533](https://github.com/anthropics/claude-code/issues/40533)

### 25. Add MCP elicitation support to Claude Desktop

Users want MCP (Model Context Protocol) elicitation support added to the Claude Desktop app, enabling both form mode and URL mode interactions. This would allow developers to build more interactive workflows that can request and collect user input through the desktop application.

- **数量:** 2 条 issue (1 未关闭, 1 已关闭)
- **需求得分:** 0.0
- **平均反应:** 0 | **平均评论:** 0
- **示例 Issue:** [#41347](https://github.com/anthropics/claude-code/issues/41347), [#41110](https://github.com/anthropics/claude-code/issues/41110)

---

*本报告仅分析公开 GitHub Issues，代表的是公开讨论中的需求信号，并非全部用户的声音。*

*由 [ReadYourUsers](https://github.com/study8677/ReadYourUsers) 生成*