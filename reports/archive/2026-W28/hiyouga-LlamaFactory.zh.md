# LLaMA Factory — 用户需求报告

**周:** 2026-W28
**生成日期:** 2026-07-06
**分析 Issue 数:** 43 (41 纳入分析)
**需求簇:** 1

## Top 10 用户需求

| 排名 | 需求 | Issue 数 | 得分 | 分类 | 示例 |
| --- | --- | --- | --- | --- | --- |
| 1 | Distributed Training Infrastructure and Model Compatibility Fixes | 41 | 7.2 | Performance | [#10355](https://github.com/hiyouga/LlamaFactory/issues/10355), [#10351](https://github.com/hiyouga/LlamaFactory/issues/10351), [#10337](https://github.com/hiyouga/LlamaFactory/issues/10337) |

## 上升最快的需求

| 需求 | 上升倍率 | 本周 | 分类 |
| --- | --- | --- | --- |
| Distributed Training Infrastructure and Model Compatibility Fixes | 1.3x | 41 | Performance |

## 分类分布

- **Performance**: 1 个簇

## 所有需求簇

### 1. Distributed Training Infrastructure and Model Compatibility Fixes

Users are experiencing multiple training infrastructure issues when fine-tuning large language and vision-language models, including distributed training errors (FSDP2, Ray, NCCL), data processing bugs, and model-specific compatibility problems with Qwen3.5 and Gemma4. These issues prevent reliable training across multi-GPU and specialized hardware (Apple Silicon MPS, Ascend NPUs) setups, requiring fixes to resource allocation, parameter offloading, and model loading to ensure stable fine-tuning workflows.

- **数量:** 41 条 issue (23 未关闭, 18 已关闭)
- **需求得分:** 7.2
- **平均反应:** 0 | **平均评论:** 1.2
- **示例 Issue:** [#10355](https://github.com/hiyouga/LlamaFactory/issues/10355), [#10351](https://github.com/hiyouga/LlamaFactory/issues/10351), [#10337](https://github.com/hiyouga/LlamaFactory/issues/10337), [#10317](https://github.com/hiyouga/LlamaFactory/issues/10317), [#10314](https://github.com/hiyouga/LlamaFactory/issues/10314)

---

*本报告仅分析公开 GitHub Issues，代表的是公开讨论中的需求信号，并非全部用户的声音。*

*由 [ReadYourUsers](https://github.com/study8677/ReadYourUsers) 生成*