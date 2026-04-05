# OpenClaw — 用户需求报告

**周:** 2026-W15
**生成日期:** 2026-04-05
**分析 Issue 数:** 45 (45 纳入分析)
**需求簇:** 2

## Top 10 用户需求

| 排名 | 需求 | Issue 数 | 得分 | 分类 | 示例 |
| --- | --- | --- | --- | --- | --- |
| 1 | Fix Commands Hanging and Integration Bugs | 43 | 4.3 | Reliability | [#61209](https://github.com/openclaw/openclaw/issues/61209), [#61188](https://github.com/openclaw/openclaw/issues/61188), [#61185](https://github.com/openclaw/openclaw/issues/61185) |
| 2 | Multi-tenant support for isolated agent profiles | 2 | 0.0 | Platform Support | [#61125](https://github.com/openclaw/openclaw/issues/61125), [#61123](https://github.com/openclaw/openclaw/issues/61123) |

## 上升最快的需求

| 需求 | 上升倍率 | 本周 | 分类 |
| --- | --- | --- | --- |
| Fix Commands Hanging and Integration Bugs | 44.0x | 43 | Reliability |
| Multi-tenant support for isolated agent profiles | 3.0x | 2 | Platform Support |

## 分类分布

- **Reliability**: 1 个簇
- **Platform Support**: 1 个簇

## 所有需求簇

### 1. Fix Commands Hanging and Integration Bugs

Users are experiencing multiple CLI commands hanging indefinitely (sessions, cron rm, memory search, tool execution) and various integration issues including provider registration, API routing, and path resolution problems. These bugs prevent core workflows from completing reliably and suggest underlying async/timeout handling and platform integration issues.

- **数量:** 43 条 issue (42 未关闭, 1 已关闭)
- **需求得分:** 4.3
- **平均反应:** 0 | **平均评论:** 0.3
- **示例 Issue:** [#61209](https://github.com/openclaw/openclaw/issues/61209), [#61188](https://github.com/openclaw/openclaw/issues/61188), [#61185](https://github.com/openclaw/openclaw/issues/61185), [#61131](https://github.com/openclaw/openclaw/issues/61131), [#61198](https://github.com/openclaw/openclaw/issues/61198)

### 2. Multi-tenant support for isolated agent profiles

Users want to run multiple isolated agent profiles on a single gateway, enabling separate workspaces, channel bindings, and configurations for different tenants. This allows organizations to efficiently share infrastructure while maintaining strict isolation between different agent deployments, eliminating the need for separate gateway instances per tenant.

- **数量:** 2 条 issue (2 未关闭, 0 已关闭)
- **需求得分:** 0.0
- **平均反应:** 0 | **平均评论:** 0
- **示例 Issue:** [#61125](https://github.com/openclaw/openclaw/issues/61125), [#61123](https://github.com/openclaw/openclaw/issues/61123)

---

*本报告仅分析公开 GitHub Issues，代表的是公开讨论中的需求信号，并非全部用户的声音。*

*由 [ReadYourUsers](https://github.com/study8677/ReadYourUsers) 生成*