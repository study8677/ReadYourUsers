# Tabby — 用户需求报告

**周:** 2026-W14
**生成日期:** 2026-04-03
**分析 Issue 数:** 55 (52 纳入分析)
**需求簇:** 11

## Top 10 用户需求

| 排名 | 需求 | Issue 数 | 得分 | 分类 | 示例 |
| --- | --- | --- | --- | --- | --- |
| 1 | Platform support and deployment flexibility enhancements | 17 | 1.7 | Platform Support | [#4471](https://github.com/TabbyML/tabby/issues/4471), [#4460](https://github.com/TabbyML/tabby/issues/4460), [#4452](https://github.com/TabbyML/tabby/issues/4452) |
| 2 | IDE Plugin Bug Fixes and Context Improvements | 7 | 1.4 | Developer Experience | [#4420](https://github.com/TabbyML/tabby/issues/4420), [#4418](https://github.com/TabbyML/tabby/issues/4418), [#4404](https://github.com/TabbyML/tabby/issues/4404) |
| 3 | Improve Git Integration and Repository Operations | 8 | 1.2 | Developer Experience | [#4451](https://github.com/TabbyML/tabby/issues/4451), [#4449](https://github.com/TabbyML/tabby/issues/4449), [#4431](https://github.com/TabbyML/tabby/issues/4431) |
| 4 | Improve Code Completion Speed and Context Awareness | 2 | 1.0 | Developer Experience | [#4472](https://github.com/TabbyML/tabby/issues/4472), [#4428](https://github.com/TabbyML/tabby/issues/4428) |
| 5 | Improve self-hosted deployment flexibility and configuration | 3 | 0.6 | Configuration | [#4434](https://github.com/TabbyML/tabby/issues/4434), [#4426](https://github.com/TabbyML/tabby/issues/4426), [#4400](https://github.com/TabbyML/tabby/issues/4400) |
| 6 | Expand model support and API integrations | 3 | 0.5 | Integration | [#4422](https://github.com/TabbyML/tabby/issues/4422), [#4412](https://github.com/TabbyML/tabby/issues/4412), [#4374](https://github.com/TabbyML/tabby/issues/4374) |
| 7 | Tabby Agent Code Assistance Improvements | 2 | 0.5 | Developer Experience | [#4411](https://github.com/TabbyML/tabby/issues/4411), [#4384](https://github.com/TabbyML/tabby/issues/4384) |
| 8 | Enhanced configuration file and settings support | 4 | 0.3 | Configuration | [#4401](https://github.com/TabbyML/tabby/issues/4401), [#4358](https://github.com/TabbyML/tabby/issues/4358), [#4356](https://github.com/TabbyML/tabby/issues/4356) |
| 9 | OpenAI/LiteLLM Integration Tool Calling | 2 | 0.2 | Integration | [#4410](https://github.com/TabbyML/tabby/issues/4410), [#4353](https://github.com/TabbyML/tabby/issues/4353) |
| 10 | Fix incorrect information display in CLI and endpoints | 2 | 0.2 | Developer Experience | [#4369](https://github.com/TabbyML/tabby/issues/4369), [#4364](https://github.com/TabbyML/tabby/issues/4364) |

## 上升最快的需求

| 需求 | 上升倍率 | 本周 | 分类 |
| --- | --- | --- | --- |
| Platform support and deployment flexibility enhancements | 2.0x | 17 | Platform Support |
| Improve Code Completion Speed and Context Awareness | 2.0x | 2 | Developer Experience |

## 分类分布

- **Developer Experience**: 5 个簇
- **Platform Support**: 2 个簇
- **Configuration**: 2 个簇
- **Integration**: 2 个簇

## 所有需求簇

### 1. Platform support and deployment flexibility enhancements

Users are requesting improvements across multiple dimensions: better plugin stability for Eclipse and IntelliJ, expanded deployment options for air-gapped/CPU-only environments, support for new model architectures (Qwen3-Coder-Next, candle backends), and fixes for infrastructure compatibility issues with Homebrew and ROCM. These changes would make Tabby more robust and usable across diverse development environments.

- **数量:** 17 条 issue (11 未关闭, 6 已关闭)
- **需求得分:** 1.7
- **平均反应:** 0.6 | **平均评论:** 1
- **示例 Issue:** [#4471](https://github.com/TabbyML/tabby/issues/4471), [#4460](https://github.com/TabbyML/tabby/issues/4460), [#4452](https://github.com/TabbyML/tabby/issues/4452), [#4446](https://github.com/TabbyML/tabby/issues/4446), [#4415](https://github.com/TabbyML/tabby/issues/4415)

### 2. IDE Plugin Bug Fixes and Context Improvements

Users are experiencing various reliability issues with IDE plugins (IntelliJ IDEA, VSCode, JetBrains Rider) including stuck loading states, unresponsive autocompletion, and connection failures in remote development scenarios. Additionally, users want improved context handling to include split view files, imported dependencies, and related files in AI code completion and chat suggestions.

- **数量:** 7 条 issue (6 未关闭, 1 已关闭)
- **需求得分:** 1.4
- **平均反应:** 0.3 | **平均评论:** 0.7
- **示例 Issue:** [#4420](https://github.com/TabbyML/tabby/issues/4420), [#4418](https://github.com/TabbyML/tabby/issues/4418), [#4404](https://github.com/TabbyML/tabby/issues/4404), [#4396](https://github.com/TabbyML/tabby/issues/4396), [#4388](https://github.com/TabbyML/tabby/issues/4388)

### 3. Improve Git Integration and Repository Operations

Users want better Git integration across multiple platforms, including support for GitLab subgroups, self-hosted Gitea, and advanced Git features like SHA256 object format and semantic merge drivers. They also need improved repository operations such as incremental git pulls, branch selection for indexing, and better handling of Git LFS errors. These improvements would enhance developer workflows for teams working with complex Git repositories and branching strategies.

- **数量:** 8 条 issue (6 未关闭, 2 已关闭)
- **需求得分:** 1.2
- **平均反应:** 0.3 | **平均评论:** 1.3
- **示例 Issue:** [#4451](https://github.com/TabbyML/tabby/issues/4451), [#4449](https://github.com/TabbyML/tabby/issues/4449), [#4431](https://github.com/TabbyML/tabby/issues/4431), [#4408](https://github.com/TabbyML/tabby/issues/4408), [#4407](https://github.com/TabbyML/tabby/issues/4407)

### 4. Improve Code Completion Speed and Context Awareness

Users want faster, more intelligent code completion suggestions. The first request seeks to eliminate perceived delay by precomputing accept and reject branches for instant follow-up suggestions, while the second wants to enhance completion relevance by integrating screen context from Screenpipe for better context-aware recommendations.

- **数量:** 2 条 issue (2 未关闭, 0 已关闭)
- **需求得分:** 1.0
- **平均反应:** 2.5 | **平均评论:** 0.5
- **示例 Issue:** [#4472](https://github.com/TabbyML/tabby/issues/4472), [#4428](https://github.com/TabbyML/tabby/issues/4428)

### 5. Improve self-hosted deployment flexibility and configuration

These issues request greater flexibility for self-hosted and offline deployments, including alternative authentication methods like x-token-auth for Bitbucket, configurable security policies to disable password complexity requirements, and improved user registration workflows with case-insensitive email handling. Users need the ability to adapt the software to their specific infrastructure requirements rather than being forced into a one-size-fits-all approach.

- **数量:** 3 条 issue (2 未关闭, 1 已关闭)
- **需求得分:** 0.6
- **平均反应:** 1.3 | **平均评论:** 2.3
- **示例 Issue:** [#4434](https://github.com/TabbyML/tabby/issues/4434), [#4426](https://github.com/TabbyML/tabby/issues/4426), [#4400](https://github.com/TabbyML/tabby/issues/4400)

### 6. Expand model support and API integrations

Users are requesting expanded support for new AI model types and API integrations, including thinking/reasoning models and Mistral's codestral-embed API for embeddings. Additionally, users want local model loading to work without network connectivity. These enhancements would improve the platform's flexibility and enable offline functionality.

- **数量:** 3 条 issue (1 未关闭, 2 已关闭)
- **需求得分:** 0.5
- **平均反应:** 1.7 | **平均评论:** 0.7
- **示例 Issue:** [#4422](https://github.com/TabbyML/tabby/issues/4422), [#4412](https://github.com/TabbyML/tabby/issues/4412), [#4374](https://github.com/TabbyML/tabby/issues/4374)

### 7. Tabby Agent Code Assistance Improvements

Users want to integrate the Agent Skills framework to enhance Tabby's code assistance capabilities, while also addressing a regression in code completion functionality that appeared between versions 1.7.0 and 1.8.0. These improvements would strengthen Tabby Agent's effectiveness as a code completion tool.

- **数量:** 2 条 issue (2 未关闭, 0 已关闭)
- **需求得分:** 0.5
- **平均反应:** 0 | **平均评论:** 1
- **示例 Issue:** [#4411](https://github.com/TabbyML/tabby/issues/4411), [#4384](https://github.com/TabbyML/tabby/issues/4384)

### 8. Enhanced configuration file and settings support

Users want improved configuration management including support for custom katana configuration files, proper control of resource settings like max_input_length and completion timeout, and cross-platform config.toml support on Windows. These enhancements would give developers more flexibility in customizing tool behavior and resource usage.

- **数量:** 4 条 issue (3 未关闭, 1 已关闭)
- **需求得分:** 0.3
- **平均反应:** 1 | **平均评论:** 1.3
- **示例 Issue:** [#4401](https://github.com/TabbyML/tabby/issues/4401), [#4358](https://github.com/TabbyML/tabby/issues/4358), [#4356](https://github.com/TabbyML/tabby/issues/4356), [#4351](https://github.com/TabbyML/tabby/issues/4351)

### 9. OpenAI/LiteLLM Integration Tool Calling

Users want enhanced OpenAI and LiteLLM API integration with support for structured tool calling using Pydantic schemas. They also need fixes for compatibility with newer models like gpt-5 to ensure smooth integration with the latest AI capabilities.

- **数量:** 2 条 issue (2 未关闭, 0 已关闭)
- **需求得分:** 0.2
- **平均反应:** 1 | **平均评论:** 2
- **示例 Issue:** [#4410](https://github.com/TabbyML/tabby/issues/4410), [#4353](https://github.com/TabbyML/tabby/issues/4353)

### 10. Fix incorrect information display in CLI and endpoints

Users are encountering bugs where the system displays inaccurate information - specifically incorrect version numbers in CLI tools and Homebrew packages, as well as wrong port numbers showing the default instead of the configured value. These display errors reduce trust in the tool's accuracy and make it difficult for developers to properly understand their environment configuration.

- **数量:** 2 条 issue (0 未关闭, 2 已关闭)
- **需求得分:** 0.2
- **平均反应:** 0 | **平均评论:** 1.5
- **示例 Issue:** [#4369](https://github.com/TabbyML/tabby/issues/4369), [#4364](https://github.com/TabbyML/tabby/issues/4364)

### 11. GPU Hardware Support and Acceleration

Users want broader GPU hardware support, specifically for Nvidia 10xx series GPUs like the GTX 1050 Ti, as well as proper GPU acceleration when Tabby runs inside Docker containers. GPU acceleration is critical for performance, so users need both expanded hardware compatibility and correct configuration in containerized environments.

- **数量:** 2 条 issue (1 未关闭, 1 已关闭)
- **需求得分:** 0.1
- **平均反应:** 0 | **平均评论:** 0.5
- **示例 Issue:** [#4368](https://github.com/TabbyML/tabby/issues/4368), [#4359](https://github.com/TabbyML/tabby/issues/4359)

---

*本报告仅分析公开 GitHub Issues，代表的是公开讨论中的需求信号，并非全部用户的声音。*

*由 [ReadYourUsers](https://github.com/study8677/ReadYourUsers) 生成*