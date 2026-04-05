# Claude Code — 用户需求报告

**周:** 2026-W15
**生成日期:** 2026-04-05
**分析 Issue 数:** 99 (98 纳入分析)
**需求簇:** 3

## Top 10 用户需求

| 排名 | 需求 | Issue 数 | 得分 | 分类 | 示例 |
| --- | --- | --- | --- | --- | --- |
| 1 | Issues related to other | 94 | 14.7 | Other | [#43765](https://github.com/anthropics/claude-code/issues/43765), [#43753](https://github.com/anthropics/claude-code/issues/43753), [#43747](https://github.com/anthropics/claude-code/issues/43747) |
| 2 | Third-party app detection via Info.plist fallback | 2 | 0.5 | Platform Support | [#43760](https://github.com/anthropics/claude-code/issues/43760), [#43759](https://github.com/anthropics/claude-code/issues/43759) |
| 3 | Fix multi-line skill descriptions splitting in autocomplete | 2 | 0.3 | UI/UX | [#43702](https://github.com/anthropics/claude-code/issues/43702), [#43699](https://github.com/anthropics/claude-code/issues/43699) |

## 上升最快的需求

| 需求 | 上升倍率 | 本周 | 分类 |
| --- | --- | --- | --- |
| Issues related to other | 95.0x | 94 | Other |
| Third-party app detection via Info.plist fallback | 3.0x | 2 | Platform Support |
| Fix multi-line skill descriptions splitting in autocomplete | 3.0x | 2 | UI/UX |

## 分类分布

- **Other**: 1 个簇
- **Platform Support**: 1 个簇
- **UI/UX**: 1 个簇

## 所有需求簇

### 1. Issues related to other

94 issues: Fix terminal scrolling and content rendering issues in TUI; Fix intermittent TUI freezes on Windows during input transitions; Fix deterministic companion species generation to produce consistent species for the same userId across sessions

- **数量:** 94 条 issue (87 未关闭, 7 已关闭)
- **需求得分:** 14.7
- **平均反应:** 0.1 | **平均评论:** 1
- **示例 Issue:** [#43765](https://github.com/anthropics/claude-code/issues/43765), [#43753](https://github.com/anthropics/claude-code/issues/43753), [#43747](https://github.com/anthropics/claude-code/issues/43747), [#43735](https://github.com/anthropics/claude-code/issues/43735), [#43731](https://github.com/anthropics/claude-code/issues/43731)

### 2. Third-party app detection via Info.plist fallback

Users need the system to detect third-party macOS applications when Spotlight metadata is unavailable. Both request_access and computer-use MCP are currently failing to identify third-party apps because they rely solely on Spotlight, which lacks metadata for apps outside the App Store. Adding an Info.plist fallback mechanism will ensure reliable app detection across all macOS applications.

- **数量:** 2 条 issue (1 未关闭, 1 已关闭)
- **需求得分:** 0.5
- **平均反应:** 0 | **平均评论:** 1.5
- **示例 Issue:** [#43760](https://github.com/anthropics/claude-code/issues/43760), [#43759](https://github.com/anthropics/claude-code/issues/43759)

### 3. Fix multi-line skill descriptions splitting in autocomplete

Users with multi-line skill descriptions are experiencing issues where each line renders as a separate autocomplete entry in the slash command menu. This breaks the intended presentation and makes it difficult to select the correct skill. Users need their multi-line descriptions to display as a single coherent entry.

- **数量:** 2 条 issue (1 未关闭, 1 已关闭)
- **需求得分:** 0.3
- **平均反应:** 0 | **平均评论:** 1
- **示例 Issue:** [#43702](https://github.com/anthropics/claude-code/issues/43702), [#43699](https://github.com/anthropics/claude-code/issues/43699)

---

*本报告仅分析公开 GitHub Issues，代表的是公开讨论中的需求信号，并非全部用户的声音。*

*由 [ReadYourUsers](https://github.com/study8677/ReadYourUsers) 生成*