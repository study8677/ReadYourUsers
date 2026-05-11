# OpenAI Codex CLI — 用户需求报告

**周:** 2026-W20
**生成日期:** 2026-05-11
**分析 Issue 数:** 71 (71 纳入分析)
**需求簇:** 2

## Top 10 用户需求

| 排名 | 需求 | Issue 数 | 得分 | 分类 | 示例 |
| --- | --- | --- | --- | --- | --- |
| 1 | CLI stability, data loss prevention, and session reliability | 69 | 15.8 | Reliability | [#16898](https://github.com/openai/codex/issues/16898), [#16897](https://github.com/openai/codex/issues/16897), [#16893](https://github.com/openai/codex/issues/16893) |
| 2 | Fix CLI model response display issues | 2 | 0.5 | Developer Experience | [#16856](https://github.com/openai/codex/issues/16856), [#16836](https://github.com/openai/codex/issues/16836) |

## 上升最快的需求

| 需求 | 上升倍率 | 本周 | 分类 |
| --- | --- | --- | --- |
| CLI stability, data loss prevention, and session reliability | 70.0x | 69 | Reliability |
| Fix CLI model response display issues | 3.0x | 2 | Developer Experience |

## 分类分布

- **Reliability**: 1 个簇
- **Developer Experience**: 1 个簇

## 所有需求簇

### 1. CLI stability, data loss prevention, and session reliability

Users are experiencing critical stability issues with long-lived CLI sessions, including data loss on exit, memory leaks causing system freezes, orphaned child processes, and crashes when handling long chat histories. These issues undermine trust in the tool for important work, as users risk losing progress and context when sessions become unstable.

- **数量:** 69 条 issue (51 未关闭, 18 已关闭)
- **需求得分:** 15.8
- **平均反应:** 0.1 | **平均评论:** 1.9
- **示例 Issue:** [#16898](https://github.com/openai/codex/issues/16898), [#16897](https://github.com/openai/codex/issues/16897), [#16893](https://github.com/openai/codex/issues/16893), [#16874](https://github.com/openai/codex/issues/16874), [#16862](https://github.com/openai/codex/issues/16862)

### 2. Fix CLI model response display issues

Users are experiencing problems with model responses in the CLI where outputs are either unexpected or garbled/incomprehensible, making them difficult to interpret. This degrades the CLI experience and undermines trust in the tool's reliability. Users need clear, accurate, and readable responses from model queries in the command-line interface.

- **数量:** 2 条 issue (0 未关闭, 2 已关闭)
- **需求得分:** 0.5
- **平均反应:** 0 | **平均评论:** 2
- **示例 Issue:** [#16856](https://github.com/openai/codex/issues/16856), [#16836](https://github.com/openai/codex/issues/16836)

---

*本报告仅分析公开 GitHub Issues，代表的是公开讨论中的需求信号，并非全部用户的声音。*

*由 [ReadYourUsers](https://github.com/study8677/ReadYourUsers) 生成*