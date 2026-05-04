# vLLM — 用户需求报告

**周:** 2026-W19
**生成日期:** 2026-05-04
**分析 Issue 数:** 35 (35 纳入分析)
**需求簇:** 1

## Top 10 用户需求

| 排名 | 需求 | Issue 数 | 得分 | 分类 | 示例 |
| --- | --- | --- | --- | --- | --- |
| 1 | MoE Performance, Quantization, and Backend Stability Fixes | 35 | 4.5 | Performance | [#39060](https://github.com/vllm-project/vllm/issues/39060), [#39030](https://github.com/vllm-project/vllm/issues/39030), [#39025](https://github.com/vllm-project/vllm/issues/39025) |

## 上升最快的需求

| 需求 | 上升倍率 | 本周 | 分类 |
| --- | --- | --- | --- |
| MoE Performance, Quantization, and Backend Stability Fixes | 36.0x | 35 | Performance |

## 分类分布

- **Performance**: 1 个簇

## 所有需求簇

### 1. MoE Performance, Quantization, and Backend Stability Fixes

Users are reporting critical issues with Mixture of Experts (MoE) model performance including significant decode throughput regressions, quantization-related accuracy problems with new models like Gemma 4 and Qwen3, and CUDA/ROCm backend stability issues causing crashes and hangs. These fixes are essential for running large-scale MoE deployments reliably and efficiently.

- **数量:** 35 条 issue (31 未关闭, 4 已关闭)
- **需求得分:** 4.5
- **平均反应:** 0.1 | **平均评论:** 1.3
- **示例 Issue:** [#39060](https://github.com/vllm-project/vllm/issues/39060), [#39030](https://github.com/vllm-project/vllm/issues/39030), [#39025](https://github.com/vllm-project/vllm/issues/39025), [#39010](https://github.com/vllm-project/vllm/issues/39010), [#39004](https://github.com/vllm-project/vllm/issues/39004)

---

*本报告仅分析公开 GitHub Issues，代表的是公开讨论中的需求信号，并非全部用户的声音。*

*由 [ReadYourUsers](https://github.com/study8677/ReadYourUsers) 生成*