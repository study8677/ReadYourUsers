# vLLM — 用户需求报告

**周:** 2026-W15
**生成日期:** 2026-04-05
**分析 Issue 数:** 30 (30 纳入分析)
**需求簇:** 1

## Top 10 用户需求

| 排名 | 需求 | Issue 数 | 得分 | 分类 | 示例 |
| --- | --- | --- | --- | --- | --- |
| 1 | Multi-backend LLM inference reliability and correctness fixes | 30 | 7.4 | Reliability | [#39010](https://github.com/vllm-project/vllm/issues/39010), [#39004](https://github.com/vllm-project/vllm/issues/39004), [#38988](https://github.com/vllm-project/vllm/issues/38988) |

## 上升最快的需求

| 需求 | 上升倍率 | 本周 | 分类 |
| --- | --- | --- | --- |
| Multi-backend LLM inference reliability and correctness fixes | 31.0x | 30 | Reliability |

## 分类分布

- **Reliability**: 1 个簇

## 所有需求簇

### 1. Multi-backend LLM inference reliability and correctness fixes

Users are experiencing critical stability issues when running large language models across different hardware backends including ROCm, XPU, Intel, and NVIDIA. The issues span model loading crashes, parallel execution problems (tensor, pipeline, expert, and data parallelism), output generation bugs, and quantization-related crashes, particularly affecting MoE architectures. These reliability problems prevent users from successfully deploying and running models like Gemma4, Qwen3.5, DeepSeek-R1, and others in production environments.

- **数量:** 30 条 issue (29 未关闭, 1 已关闭)
- **需求得分:** 7.4
- **平均反应:** 0.3 | **平均评论:** 0.9
- **示例 Issue:** [#39010](https://github.com/vllm-project/vllm/issues/39010), [#39004](https://github.com/vllm-project/vllm/issues/39004), [#38988](https://github.com/vllm-project/vllm/issues/38988), [#38982](https://github.com/vllm-project/vllm/issues/38982), [#38971](https://github.com/vllm-project/vllm/issues/38971)

---

*本报告仅分析公开 GitHub Issues，代表的是公开讨论中的需求信号，并非全部用户的声音。*

*由 [ReadYourUsers](https://github.com/study8677/ReadYourUsers) 生成*