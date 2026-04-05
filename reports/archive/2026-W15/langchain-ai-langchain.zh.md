# LangChain — 用户需求报告

**周:** 2026-W15
**生成日期:** 2026-04-05
**分析 Issue 数:** 31 (29 纳入分析)
**需求簇:** 2

## Top 10 用户需求

| 排名 | 需求 | Issue 数 | 得分 | 分类 | 示例 |
| --- | --- | --- | --- | --- | --- |
| 1 | Agent Orchestration, Security Auditing, and Partner Integrations | 27 | 3.2 | Developer Experience | [#36523](https://github.com/langchain-ai/langchain/issues/36523), [#36503](https://github.com/langchain-ai/langchain/issues/36503), [#36460](https://github.com/langchain-ai/langchain/issues/36460) |
| 2 | Fix symlink bypass vulnerability CWE-22 | 2 | 0.2 | Security | [#36485](https://github.com/langchain-ai/langchain/issues/36485), [#36484](https://github.com/langchain-ai/langchain/issues/36484) |

## 上升最快的需求

| 需求 | 上升倍率 | 本周 | 分类 |
| --- | --- | --- | --- |
| Agent Orchestration, Security Auditing, and Partner Integrations | 28.0x | 27 | Developer Experience |
| Fix symlink bypass vulnerability CWE-22 | 3.0x | 2 | Security |

## 分类分布

- **Developer Experience**: 1 个簇
- **Security**: 1 个簇

## 所有需求簇

### 1. Agent Orchestration, Security Auditing, and Partner Integrations

Users are requesting enhanced agent coordination capabilities including multi-agent orchestrators, dependency management utilities, and output verification gates. Additionally, there are requests for security features like MCP tool call auditing with cryptographic receipts and access control mechanisms. The cluster also includes partner package integrations for new AI providers and various bug fixes for documentation consistency.

- **数量:** 27 条 issue (13 未关闭, 14 已关闭)
- **需求得分:** 3.2
- **平均反应:** 0 | **平均评论:** 1.9
- **示例 Issue:** [#36523](https://github.com/langchain-ai/langchain/issues/36523), [#36503](https://github.com/langchain-ai/langchain/issues/36503), [#36460](https://github.com/langchain-ai/langchain/issues/36460), [#36447](https://github.com/langchain-ai/langchain/issues/36447), [#36461](https://github.com/langchain-ai/langchain/issues/36461)

### 2. Fix symlink bypass vulnerability CWE-22

Users want to fix a path traversal vulnerability (CWE-22) in the _load_examples and _load_prompt_from_file functions by adding .resolve() before suffix checks. This prevents attackers from bypassing security checks using symlinks to access files outside the intended directory.

- **数量:** 2 条 issue (0 未关闭, 2 已关闭)
- **需求得分:** 0.2
- **平均反应:** 0 | **平均评论:** 1.5
- **示例 Issue:** [#36485](https://github.com/langchain-ai/langchain/issues/36485), [#36484](https://github.com/langchain-ai/langchain/issues/36484)

---

*本报告仅分析公开 GitHub Issues，代表的是公开讨论中的需求信号，并非全部用户的声音。*

*由 [ReadYourUsers](https://github.com/study8677/ReadYourUsers) 生成*