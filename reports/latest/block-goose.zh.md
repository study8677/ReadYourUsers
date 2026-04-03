# Goose — 用户需求报告

**周:** 2026-W14
**生成日期:** 2026-04-03
**分析 Issue 数:** 32 (28 纳入分析)
**需求簇:** 6

## Top 10 用户需求

| 排名 | 需求 | Issue 数 | 得分 | 分类 | 示例 |
| --- | --- | --- | --- | --- | --- |
| 1 | Improve CLI stability, usability, and local model management | 10 | 2.2 | Developer Experience | [#8282](https://github.com/block/goose/issues/8282), [#8275](https://github.com/block/goose/issues/8275), [#8274](https://github.com/block/goose/issues/8274) |
| 2 | Improving AI Agent Reliability, Configuration, and Extensibility | 9 | 1.9 | Developer Experience | [#8270](https://github.com/block/goose/issues/8270), [#8265](https://github.com/block/goose/issues/8265), [#8264](https://github.com/block/goose/issues/8264) |
| 3 | Comprehensive Documentation Updates, Fixes, and Quickstart Enhancements | 3 | 1.0 | Documentation | [#8269](https://github.com/block/goose/issues/8269), [#8226](https://github.com/block/goose/issues/8226), [#8195](https://github.com/block/goose/issues/8195) |
| 4 | Improve Cloud AI API Version Routing Compatibility | 2 | 0.0 | Integration | [#8277](https://github.com/block/goose/issues/8277), [#8236](https://github.com/block/goose/issues/8236) |
| 5 | Resource Monitoring and Process Lifecycle Management | 2 | 0.0 | Performance | [#8266](https://github.com/block/goose/issues/8266), [#8229](https://github.com/block/goose/issues/8229) |
| 6 | Flexible LLM Provider Settings and Per-Agent Assignments | 2 | 0.0 | Configuration | [#8203](https://github.com/block/goose/issues/8203), [#8187](https://github.com/block/goose/issues/8187) |

## 上升最快的需求

| 需求 | 上升倍率 | 本周 | 分类 |
| --- | --- | --- | --- |
| Improve CLI stability, usability, and local model management | 11.0x | 10 | Developer Experience |
| Improving AI Agent Reliability, Configuration, and Extensibility | 10.0x | 9 | Developer Experience |
| Comprehensive Documentation Updates, Fixes, and Quickstart Enhancements | 4.0x | 3 | Documentation |
| Improve Cloud AI API Version Routing Compatibility | 3.0x | 2 | Integration |
| Resource Monitoring and Process Lifecycle Management | 3.0x | 2 | Performance |

## 分类分布

- **Developer Experience**: 2 个簇
- **Documentation**: 1 个簇
- **Integration**: 1 个簇
- **Performance**: 1 个簇
- **Configuration**: 1 个簇

## 所有需求簇

### 1. Improve CLI stability, usability, and local model management

Users want enhancements to the command-line interface, including better model management, crash fixes, log cleanup, and improved interactive session features. These changes aim to create a more reliable, user-friendly terminal experience that minimizes friction and clarifies output during local AI workflows.

- **数量:** 10 条 issue (8 未关闭, 2 已关闭)
- **需求得分:** 2.2
- **平均反应:** 0.1 | **平均评论:** 0.4
- **示例 Issue:** [#8282](https://github.com/block/goose/issues/8282), [#8275](https://github.com/block/goose/issues/8275), [#8274](https://github.com/block/goose/issues/8274), [#8273](https://github.com/block/goose/issues/8273), [#8272](https://github.com/block/goose/issues/8272)

### 2. Improving AI Agent Reliability, Configuration, and Extensibility

Users need critical bug fixes for runtime crashes, authentication issues, and model regressions to maintain reliable AI agent performance. They also require enhanced configuration controls, automated maintenance workflows, and custom security hooks to better adapt the extension to complex development environments.

- **数量:** 9 条 issue (8 未关闭, 1 已关闭)
- **需求得分:** 1.9
- **平均反应:** 0 | **平均评论:** 0.2
- **示例 Issue:** [#8270](https://github.com/block/goose/issues/8270), [#8265](https://github.com/block/goose/issues/8265), [#8264](https://github.com/block/goose/issues/8264), [#8262](https://github.com/block/goose/issues/8262), [#8248](https://github.com/block/goose/issues/8248)

### 3. Comprehensive Documentation Updates, Fixes, and Quickstart Enhancements

Users are requesting comprehensive updates to the project documentation to cover new features, correct outdated references, and fix copy-paste errors. Accurate and current documentation is crucial to prevent configuration mistakes and streamline the onboarding process for new developers.

- **数量:** 3 条 issue (3 未关闭, 0 已关闭)
- **需求得分:** 1.0
- **平均反应:** 0 | **平均评论:** 0.7
- **示例 Issue:** [#8269](https://github.com/block/goose/issues/8269), [#8226](https://github.com/block/goose/issues/8226), [#8195](https://github.com/block/goose/issues/8195)

### 4. Improve Cloud AI API Version Routing Compatibility

Users need the system to correctly route API requests and handle version query parameters for external cloud AI providers like GCP and Azure. Implementing conditional parameter exclusion and fixing global endpoint routing will resolve compatibility issues across different API versions. This ensures reliable integration with multiple cloud-hosted AI services.

- **数量:** 2 条 issue (2 未关闭, 0 已关闭)
- **需求得分:** 0.0
- **平均反应:** 0 | **平均评论:** 0
- **示例 Issue:** [#8277](https://github.com/block/goose/issues/8277), [#8236](https://github.com/block/goose/issues/8236)

### 5. Resource Monitoring and Process Lifecycle Management

Users want integrated tools to track LLM token usage and costs while ensuring system resources are properly cleaned up. They are requesting automatic process termination at the end of sessions to eliminate memory leaks and prevent resource exhaustion. These improvements aim to enhance application stability and provide clear visibility into operational expenses.

- **数量:** 2 条 issue (1 未关闭, 1 已关闭)
- **需求得分:** 0.0
- **平均反应:** 0 | **平均评论:** 0
- **示例 Issue:** [#8266](https://github.com/block/goose/issues/8266), [#8229](https://github.com/block/goose/issues/8229)

### 6. Flexible LLM Provider Settings and Per-Agent Assignments

Users want the ability to assign specific LLM models and API keys to individual agents within a single provider setup. They also need the flexibility to override base URLs for built-in providers to support custom deployments or proxy routing. These enhancements would improve environment isolation, cost tracking, and infrastructure adaptability.

- **数量:** 2 条 issue (1 未关闭, 1 已关闭)
- **需求得分:** 0.0
- **平均反应:** 0 | **平均评论:** 0
- **示例 Issue:** [#8203](https://github.com/block/goose/issues/8203), [#8187](https://github.com/block/goose/issues/8187)

---

*本报告仅分析公开 GitHub Issues，代表的是公开讨论中的需求信号，并非全部用户的声音。*

*由 [ReadYourUsers](https://github.com/study8677/ReadYourUsers) 生成*