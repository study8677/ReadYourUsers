# llama.cpp — 用户需求报告

**周:** 2026-W15
**生成日期:** 2026-04-06
**分析 Issue 数:** 50 (50 纳入分析)
**需求簇:** 1

## Top 10 用户需求

| 排名 | 需求 | Issue 数 | 得分 | 分类 | 示例 |
| --- | --- | --- | --- | --- | --- |
| 1 | Vulkan backend stability and Gemma 4 model fixes | 50 | 7.4 | Reliability | [#21483](https://github.com/ggml-org/llama.cpp/issues/21483), [#21473](https://github.com/ggml-org/llama.cpp/issues/21473), [#21446](https://github.com/ggml-org/llama.cpp/issues/21446) |

## 上升最快的需求

| 需求 | 上升倍率 | 本周 | 分类 |
| --- | --- | --- | --- |
| Vulkan backend stability and Gemma 4 model fixes | 51.0x | 50 | Reliability |

## 分类分布

- **Reliability**: 1 个簇

## 所有需求簇

### 1. Vulkan backend stability and Gemma 4 model fixes

Users are experiencing multiple crashes and stability issues with the Vulkan backend, particularly when running Gemma 4 models, multimodal vision pipelines, and handling large prompts. These issues include assertion failures, invalid pointer crashes, memory leaks, and incorrect memory estimation that prevent reliable inference. Additionally, users need better documentation for multimodal model configuration and expanded audio modality support.

- **数量:** 50 条 issue (39 未关闭, 11 已关闭)
- **需求得分:** 7.4
- **平均反应:** 0.4 | **平均评论:** 2.6
- **示例 Issue:** [#21483](https://github.com/ggml-org/llama.cpp/issues/21483), [#21473](https://github.com/ggml-org/llama.cpp/issues/21473), [#21446](https://github.com/ggml-org/llama.cpp/issues/21446), [#21440](https://github.com/ggml-org/llama.cpp/issues/21440), [#21400](https://github.com/ggml-org/llama.cpp/issues/21400)

---

*本报告仅分析公开 GitHub Issues，代表的是公开讨论中的需求信号，并非全部用户的声音。*

*由 [ReadYourUsers](https://github.com/study8677/ReadYourUsers) 生成*