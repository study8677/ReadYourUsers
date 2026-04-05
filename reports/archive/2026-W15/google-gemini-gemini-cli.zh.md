# Gemini CLI — 用户需求报告

**周:** 2026-W15
**生成日期:** 2026-04-05
**分析 Issue 数:** 57 (54 纳入分析)
**需求簇:** 2

## Top 10 用户需求

| 排名 | 需求 | Issue 数 | 得分 | 分类 | 示例 |
| --- | --- | --- | --- | --- | --- |
| 1 | CLI Reliability and Session Management Fixes | 52 | 6.6 | Developer Experience | [#24695](https://github.com/google-gemini/gemini-cli/issues/24695), [#24692](https://github.com/google-gemini/gemini-cli/issues/24692), [#24691](https://github.com/google-gemini/gemini-cli/issues/24691) |
| 2 | Fix Nightly Release Workflow Failures | 2 | 0.4 | Developer Experience | [#24657](https://github.com/google-gemini/gemini-cli/issues/24657), [#24618](https://github.com/google-gemini/gemini-cli/issues/24618) |

## 上升最快的需求

| 需求 | 上升倍率 | 本周 | 分类 |
| --- | --- | --- | --- |
| CLI Reliability and Session Management Fixes | 53.0x | 52 | Developer Experience |
| Fix Nightly Release Workflow Failures | 3.0x | 2 | Developer Experience |

## 分类分布

- **Developer Experience**: 2 个簇

## 所有需求簇

### 1. CLI Reliability and Session Management Fixes

Users are reporting multiple CLI stability issues including infinite loops, hanging in 'Thinking' state, unexpected session termination, and chat history corruption. Additionally, users want improved session management with faster --list-sessions execution, JSON output format, and cross-directory session listing. These issues collectively degrade the CLI user experience and require fixes for error handling, state management, and output formatting.

- **数量:** 52 条 issue (47 未关闭, 5 已关闭)
- **需求得分:** 6.6
- **平均反应:** 0.2 | **平均评论:** 0.8
- **示例 Issue:** [#24695](https://github.com/google-gemini/gemini-cli/issues/24695), [#24692](https://github.com/google-gemini/gemini-cli/issues/24692), [#24691](https://github.com/google-gemini/gemini-cli/issues/24691), [#24690](https://github.com/google-gemini/gemini-cli/issues/24690), [#24689](https://github.com/google-gemini/gemini-cli/issues/24689)

### 2. Fix Nightly Release Workflow Failures

Users are experiencing failures in the nightly release workflow for specific nightly versions. These workflow failures prevent proper release of nightly builds, disrupting the development and testing pipeline. The issues need to be investigated and resolved to ensure reliable nightly releases.

- **数量:** 2 条 issue (2 未关闭, 0 已关闭)
- **需求得分:** 0.4
- **平均反应:** 0 | **平均评论:** 1.5
- **示例 Issue:** [#24657](https://github.com/google-gemini/gemini-cli/issues/24657), [#24618](https://github.com/google-gemini/gemini-cli/issues/24618)

---

*本报告仅分析公开 GitHub Issues，代表的是公开讨论中的需求信号，并非全部用户的声音。*

*由 [ReadYourUsers](https://github.com/study8677/ReadYourUsers) 生成*