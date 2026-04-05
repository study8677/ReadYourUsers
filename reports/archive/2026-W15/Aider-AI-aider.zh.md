# aider — 用户需求报告

**周:** 2026-W15
**生成日期:** 2026-04-05
**分析 Issue 数:** 56 (55 纳入分析)
**需求簇:** 4

## Top 10 用户需求

| 排名 | 需求 | Issue 数 | 得分 | 分类 | 示例 |
| --- | --- | --- | --- | --- | --- |
| 1 | CLI robustness and headless operation improvements | 49 | 11.8 | Developer Experience | [#4992](https://github.com/Aider-AI/aider/issues/4992), [#4989](https://github.com/Aider-AI/aider/issues/4989), [#4950](https://github.com/Aider-AI/aider/issues/4950) |
| 2 | Handle Unicode cp1252 Encoding on Windows | 2 | 0.9 | Platform Support | [#4985](https://github.com/Aider-AI/aider/issues/4985), [#4948](https://github.com/Aider-AI/aider/issues/4948) |
| 3 | Graceful handling of non-relative glob patterns | 2 | 0.8 | Developer Experience | [#4952](https://github.com/Aider-AI/aider/issues/4952), [#4939](https://github.com/Aider-AI/aider/issues/4939) |
| 4 | Fix TypeError in Client.capture distinct_id argument | 2 | 0.8 | Reliability | [#4951](https://github.com/Aider-AI/aider/issues/4951), [#4905](https://github.com/Aider-AI/aider/issues/4905) |

## 上升最快的需求

| 需求 | 上升倍率 | 本周 | 分类 |
| --- | --- | --- | --- |
| Handle Unicode cp1252 Encoding on Windows | 2.0x | 2 | Platform Support |
| CLI robustness and headless operation improvements | 1.3x | 49 | Developer Experience |

## 分类分布

- **Developer Experience**: 2 个簇
- **Platform Support**: 1 个簇
- **Reliability**: 1 个簇

## 所有需求簇

### 1. CLI robustness and headless operation improvements

Users want improved CLI reliability through better error handling for missing dependencies (litellm, playwright, pydantic, openai), graceful handling of import failures and configuration file errors, and expanded headless/single-pass operation modes for CI and benchmarking integration. These changes would make the tool more production-ready for automated workflows.

- **数量:** 49 条 issue (26 未关闭, 23 已关闭)
- **需求得分:** 11.8
- **平均反应:** 0.1 | **平均评论:** 0.5
- **示例 Issue:** [#4992](https://github.com/Aider-AI/aider/issues/4992), [#4989](https://github.com/Aider-AI/aider/issues/4989), [#4950](https://github.com/Aider-AI/aider/issues/4950), [#4942](https://github.com/Aider-AI/aider/issues/4942), [#4933](https://github.com/Aider-AI/aider/issues/4933)

### 2. Handle Unicode cp1252 Encoding on Windows

Users want the application to gracefully handle Unicode characters that cannot be encoded in Windows cp1252 encoding without crashing. The cp1252 charset cannot represent all Unicode characters, and encountering unsupported characters currently causes failures. This is important for reliability and proper cross-language support on Windows systems.

- **数量:** 2 条 issue (0 未关闭, 2 已关闭)
- **需求得分:** 0.9
- **平均反应:** 0 | **平均评论:** 1
- **示例 Issue:** [#4985](https://github.com/Aider-AI/aider/issues/4985), [#4948](https://github.com/Aider-AI/aider/issues/4948)

### 3. Graceful handling of non-relative glob patterns

Users want the CLI to handle non-relative glob patterns (absolute paths, paths with ~, etc.) gracefully instead of crashing with a NotImplementedError. This issue affects both the /add command and read-only commands, causing unexpected failures when users provide glob patterns that aren't relative paths.

- **数量:** 2 条 issue (0 未关闭, 2 已关闭)
- **需求得分:** 0.8
- **平均反应:** 0 | **平均评论:** 1
- **示例 Issue:** [#4952](https://github.com/Aider-AI/aider/issues/4952), [#4939](https://github.com/Aider-AI/aider/issues/4939)

### 4. Fix TypeError in Client.capture distinct_id argument

Users are encountering a TypeError when calling Client.capture() because the distinct_id argument is receiving multiple values. This prevents the analytics tracking from functioning and needs to be fixed in the analytics.py file.

- **数量:** 2 条 issue (0 未关闭, 2 已关闭)
- **需求得分:** 0.8
- **平均反应:** 0 | **平均评论:** 1
- **示例 Issue:** [#4951](https://github.com/Aider-AI/aider/issues/4951), [#4905](https://github.com/Aider-AI/aider/issues/4905)

---

*本报告仅分析公开 GitHub Issues，代表的是公开讨论中的需求信号，并非全部用户的声音。*

*由 [ReadYourUsers](https://github.com/study8677/ReadYourUsers) 生成*