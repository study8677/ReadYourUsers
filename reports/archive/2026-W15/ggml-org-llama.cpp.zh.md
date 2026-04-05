# llama.cpp — 用户需求报告

**周:** 2026-W15
**生成日期:** 2026-04-05
**分析 Issue 数:** 47 (47 纳入分析)
**需求簇:** 1

## Top 10 用户需求

| 排名 | 需求 | Issue 数 | 得分 | 分类 | 示例 |
| --- | --- | --- | --- | --- | --- |
| 1 | Gemma 4 CUDA Backend Stability and Performance Fixes | 47 | 8.8 | Performance | [#21457](https://github.com/ggml-org/llama.cpp/issues/21457), [#21420](https://github.com/ggml-org/llama.cpp/issues/21420), [#21414](https://github.com/ggml-org/llama.cpp/issues/21414) |

## 上升最快的需求

| 需求 | 上升倍率 | 本周 | 分类 |
| --- | --- | --- | --- |
| Gemma 4 CUDA Backend Stability and Performance Fixes | 48.0x | 47 | Performance |

## 分类分布

- **Performance**: 1 个簇

## 所有需求簇

### 1. Gemma 4 CUDA Backend Stability and Performance Fixes

Users are experiencing multiple crashes, memory allocation failures, and segmentation faults when loading and running Gemma 4 models on the CUDA backend, particularly with vision/multimodal models and large context windows. Additionally, users request performance optimizations including speculative decoding, adaptive KV cache quantization, and Fast Walsh Hadamard Transform for KV-cache rotation to improve inference throughput and reduce generation latency. These issues significantly impact reliability and usability for production deployments.

- **数量:** 47 条 issue (35 未关闭, 12 已关闭)
- **需求得分:** 8.8
- **平均反应:** 0.5 | **平均评论:** 3
- **示例 Issue:** [#21457](https://github.com/ggml-org/llama.cpp/issues/21457), [#21420](https://github.com/ggml-org/llama.cpp/issues/21420), [#21414](https://github.com/ggml-org/llama.cpp/issues/21414), [#21404](https://github.com/ggml-org/llama.cpp/issues/21404), [#21402](https://github.com/ggml-org/llama.cpp/issues/21402)

---

*本报告仅分析公开 GitHub Issues，代表的是公开讨论中的需求信号，并非全部用户的声音。*

*由 [ReadYourUsers](https://github.com/study8677/ReadYourUsers) 生成*