# Zed — User Demand Report

**Week:** 2026-W14
**Generated:** 2026-04-03
**Issues analyzed:** 37 (37 included)
**Need clusters:** 8

## Top 10 User Needs

| Rank | Need | Issues | Score | Category | Examples |
| --- | --- | --- | --- | --- | --- |
| 1 | Bug Fixes and Edge Case Improvements | 13 | 3.6 | Developer Experience | [#53087](https://github.com/zed-industries/zed/issues/53087), [#53081](https://github.com/zed-industries/zed/issues/53081), [#53059](https://github.com/zed-industries/zed/issues/53059) |
| 2 | Git Panel and Graph Bug Fixes | 7 | 2.8 | Reliability | [#53080](https://github.com/zed-industries/zed/issues/53080), [#53069](https://github.com/zed-industries/zed/issues/53069), [#53064](https://github.com/zed-industries/zed/issues/53064) |
| 3 | AI Agent Integration Fixes | 3 | 2.2 | Integration | [#53034](https://github.com/zed-industries/zed/issues/53034), [#53006](https://github.com/zed-industries/zed/issues/53006), [#52983](https://github.com/zed-industries/zed/issues/52983) |
| 4 | Agent Panel Stability and Usability Fixes | 4 | 2.0 | Developer Experience | [#53072](https://github.com/zed-industries/zed/issues/53072), [#53070](https://github.com/zed-industries/zed/issues/53070), [#53021](https://github.com/zed-industries/zed/issues/53021) |
| 5 | Immediate Keybinding and Settings Reload | 2 | 1.8 | Configuration | [#53012](https://github.com/zed-industries/zed/issues/53012), [#53003](https://github.com/zed-industries/zed/issues/53003) |
| 6 | Fix editor rendering and font loading bugs | 2 | 1.2 | Developer Experience | [#53051](https://github.com/zed-industries/zed/issues/53051), [#52987](https://github.com/zed-industries/zed/issues/52987) |
| 7 | Terminal interaction and shell command fixes | 3 | 1.2 | Developer Experience | [#53056](https://github.com/zed-industries/zed/issues/53056), [#53046](https://github.com/zed-industries/zed/issues/53046), [#52985](https://github.com/zed-industries/zed/issues/52985) |
| 8 | UI/UX Bug Fixes | 3 | 1.0 | UI/UX | [#53062](https://github.com/zed-industries/zed/issues/53062), [#53060](https://github.com/zed-industries/zed/issues/53060), [#53005](https://github.com/zed-industries/zed/issues/53005) |

## Rising Needs

| Need | Rising Score | This Week | Category |
| --- | --- | --- | --- |
| Bug Fixes and Edge Case Improvements | 14.0x | 13 | Developer Experience |
| Git Panel and Graph Bug Fixes | 8.0x | 7 | Reliability |
| Agent Panel Stability and Usability Fixes | 5.0x | 4 | Developer Experience |
| AI Agent Integration Fixes | 4.0x | 3 | Integration |
| Terminal interaction and shell command fixes | 4.0x | 3 | Developer Experience |

## Category Breakdown

- **Developer Experience**: 4 clusters
- **Reliability**: 1 clusters
- **Integration**: 1 clusters
- **Configuration**: 1 clusters
- **UI/UX**: 1 clusters

## All Need Clusters

### 1. Bug Fixes and Edge Case Improvements

This cluster addresses various bug fixes across the editor including Docker Compose integration issues (port and label deserialization), platform-specific problems (Flatpak Rust toolchain, Windows UNC paths), UI state persistence (settings, themes), AI agent integration (authentication, auto-approval mode), and developer tooling (syntax highlighting, Python LSP, CI testing). Users are experiencing broken functionality in these edge cases that impact their daily workflow.

- **Volume:** 13 issues (9 open, 4 closed)
- **Demand Score:** 3.6
- **Avg Reactions:** 0 | **Avg Comments:** 1.4
- **Example issues:** [#53087](https://github.com/zed-industries/zed/issues/53087), [#53081](https://github.com/zed-industries/zed/issues/53081), [#53059](https://github.com/zed-industries/zed/issues/53059), [#53055](https://github.com/zed-industries/zed/issues/53055), [#53054](https://github.com/zed-industries/zed/issues/53054)

### 2. Git Panel and Graph Bug Fixes

Users are reporting multiple bugs in the Git integration features, including UI display issues (incorrect branch names, inaccurate diff stats), stability problems (crashes, memory leaks, infinite loading), and refresh/ reload issues. These problems degrade the developer experience when using version control features, particularly in remote project scenarios like WSL.

- **Volume:** 7 issues (6 open, 1 closed)
- **Demand Score:** 2.8
- **Avg Reactions:** 0 | **Avg Comments:** 2
- **Example issues:** [#53080](https://github.com/zed-industries/zed/issues/53080), [#53069](https://github.com/zed-industries/zed/issues/53069), [#53064](https://github.com/zed-industries/zed/issues/53064), [#53061](https://github.com/zed-industries/zed/issues/53061), [#53040](https://github.com/zed-industries/zed/issues/53040)

### 3. AI Agent Integration Fixes

Users are experiencing various integration issues with the AI agent system, including provider-specific requirements not being met (such as Mistral's ID format constraints), UI rendering problems with text inputs, and failures when using custom APIs. These fixes aim to improve compatibility across different AI providers and ensure reliable operation of subagent functionality.

- **Volume:** 3 issues (1 open, 2 closed)
- **Demand Score:** 2.2
- **Avg Reactions:** 0.7 | **Avg Comments:** 2.7
- **Example issues:** [#53034](https://github.com/zed-industries/zed/issues/53034), [#53006](https://github.com/zed-industries/zed/issues/53006), [#52983](https://github.com/zed-industries/zed/issues/52983)

### 4. Agent Panel Stability and Usability Fixes

Users are experiencing critical reliability issues with the CoPilot Agent panel, including PowerShell commands hanging on Windows, crashes when pasting images with queued messages, and session state not properly restoring on project reopen. These fixes address platform compatibility, crash prevention, UI responsiveness, and data persistence to improve the overall stability of the agent workflow.

- **Volume:** 4 issues (4 open, 0 closed)
- **Demand Score:** 2.0
- **Avg Reactions:** 0 | **Avg Comments:** 0.5
- **Example issues:** [#53072](https://github.com/zed-industries/zed/issues/53072), [#53070](https://github.com/zed-industries/zed/issues/53070), [#53021](https://github.com/zed-industries/zed/issues/53021), [#52993](https://github.com/zed-industries/zed/issues/52993)

### 5. Immediate Keybinding and Settings Reload

Users want keybindings and settings changes to apply immediately without requiring a restart. Currently, changes made via the settings file or UI don't take effect until the application is restarted, disrupting workflow efficiency. This hot reloading capability is essential for a smooth configuration experience.

- **Volume:** 2 issues (2 open, 0 closed)
- **Demand Score:** 1.8
- **Avg Reactions:** 0.5 | **Avg Comments:** 3
- **Example issues:** [#53012](https://github.com/zed-industries/zed/issues/53012), [#53003](https://github.com/zed-industries/zed/issues/53003)

### 6. Fix editor rendering and font loading bugs

Users are encountering bugs that degrade the code editing visual experience. Specifically, semantic token highlighting fails to apply correctly when buffers are opened from multibuffers, and font loading doesn't properly prioritize system-installed fonts over bundled alternatives. These issues affect code clarity and visual consistency.

- **Volume:** 2 issues (2 open, 0 closed)
- **Demand Score:** 1.2
- **Avg Reactions:** 0.5 | **Avg Comments:** 1
- **Example issues:** [#53051](https://github.com/zed-industries/zed/issues/53051), [#52987](https://github.com/zed-industries/zed/issues/52987)

### 7. Terminal interaction and shell command fixes

Users are reporting issues with terminal functionality including focus management when switching between terminals, proper quoting of shell arguments with special characters, and keyboard input handling for text selection. These fixes aim to improve the reliability and usability of terminal interactions for developers.

- **Volume:** 3 issues (3 open, 0 closed)
- **Demand Score:** 1.2
- **Avg Reactions:** 0 | **Avg Comments:** 2
- **Example issues:** [#53056](https://github.com/zed-industries/zed/issues/53056), [#53046](https://github.com/zed-industries/zed/issues/53046), [#52985](https://github.com/zed-industries/zed/issues/52985)

### 8. UI/UX Bug Fixes

Users are experiencing several interface issues where UI elements don't behave as expected. Today's sessions fail to appear in preview lists, Markdown syntax breaks filename display in confirmation dialogs, and theme changes don't apply immediately when toggling modes. These bugs reduce the overall polish and reliability of the user experience.

- **Volume:** 3 issues (3 open, 0 closed)
- **Demand Score:** 1.0
- **Avg Reactions:** 0 | **Avg Comments:** 3
- **Example issues:** [#53062](https://github.com/zed-industries/zed/issues/53062), [#53060](https://github.com/zed-industries/zed/issues/53060), [#53005](https://github.com/zed-industries/zed/issues/53005)

---

*This report analyzes public GitHub issues only. It represents a signal from public issue discussions, not the full user base.*

*Generated by [ReadYourUsers](https://github.com/study8677/ReadYourUsers)*