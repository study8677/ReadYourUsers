# ReadYourUsers

> 把公开 GitHub Issues 变成可读的**用户需求地图**。

我们分析 AI 编程工具最活跃仓库中的数千条公开 issue，提炼成带排名、带聚类的周报 — 让你一眼看到开发者真正想要什么。

**[English README](README.md)**

<!-- READYOURUSERS:START -->

## AI 编程工具 — 开发者真正想要什么

> 从 [anthropics/claude-code](https://github.com/anthropics/claude-code) 分析了 **326** 条 issue | **33** 个需求簇 | 更新于 2026-04-02

### Top 10 需求

| 排名 | 需求 | Issue 数 | 得分 | 分类 | 示例 |
| --- | --- | --- | --- | --- | --- |
| 1 | MCP Server Reliability and Configuration Issues | 33 | 15.4 | Integration | [#42632](https://github.com/anthropics/claude-code/issues/42632), [#42628](https://github.com/anthropics/claude-code/issues/42628), [#42627](https://github.com/anthropics/claude-code/issues/42627) |
| 2 | TUI Terminal State and Input Handling Fixes | 51 | 13.8 | UI/UX | [#42638](https://github.com/anthropics/claude-code/issues/42638), [#42617](https://github.com/anthropics/claude-code/issues/42617), [#42613](https://github.com/anthropics/claude-code/issues/42613) |
| 3 | CLI Session Management and UX Improvements | 32 | 7.9 | Developer Experience | [#42637](https://github.com/anthropics/claude-code/issues/42637), [#42624](https://github.com/anthropics/claude-code/issues/42624), [#42607](https://github.com/anthropics/claude-code/issues/42607) |
| 4 | Plugin System Management and Reliability | 12 | 6.0 | Developer Experience | [#42601](https://github.com/anthropics/claude-code/issues/42601), [#42595](https://github.com/anthropics/claude-code/issues/42595), [#42568](https://github.com/anthropics/claude-code/issues/42568) |
| 5 | Bug Fixes and Feature Enhancements | 31 | 5.6 | Developer Experience | [#42635](https://github.com/anthropics/claude-code/issues/42635), [#42631](https://github.com/anthropics/claude-code/issues/42631), [#42623](https://github.com/anthropics/claude-code/issues/42623) |
| 6 | Expand Hook System Functionality and Fix Hook Behaviors | 10 | 4.2 | Integration | [#42597](https://github.com/anthropics/claude-code/issues/42597), [#42581](https://github.com/anthropics/claude-code/issues/42581), [#42489](https://github.com/anthropics/claude-code/issues/42489) |
| 7 | Authentication and subscription reliability fixes | 10 | 4.2 | Developer Experience | [#42608](https://github.com/anthropics/claude-code/issues/42608), [#42605](https://github.com/anthropics/claude-code/issues/42605), [#42603](https://github.com/anthropics/claude-code/issues/42603) |
| 8 | Permission System Reliability and Security Fixes | 11 | 4.0 | Security | [#42611](https://github.com/anthropics/claude-code/issues/42611), [#42500](https://github.com/anthropics/claude-code/issues/42500), [#42488](https://github.com/anthropics/claude-code/issues/42488) |
| 9 | Model Response Quality and Instruction Following | 11 | 3.8 | Reliability | [#42636](https://github.com/anthropics/claude-code/issues/42636), [#42634](https://github.com/anthropics/claude-code/issues/42634), [#42633](https://github.com/anthropics/claude-code/issues/42633) |
| 10 | Background Agent Lifecycle and Reliability Management | 8 | 3.7 | Developer Experience | [#42621](https://github.com/anthropics/claude-code/issues/42621), [#42545](https://github.com/anthropics/claude-code/issues/42545), [#42541](https://github.com/anthropics/claude-code/issues/42541) |

### 上升最快的需求

| 需求 | 上升倍率 | 本周 | 分类 |
| --- | --- | --- | --- |
| TUI Terminal State and Input Handling Fixes | 52.0x | 51 | UI/UX |
| MCP Server Reliability and Configuration Issues | 34.0x | 33 | Integration |
| CLI Session Management and UX Improvements | 33.0x | 32 | Developer Experience |
| Bug Fixes and Feature Enhancements | 32.0x | 31 | Developer Experience |
| Configuration and Settings Management Improvements | 18.0x | 17 | Configuration |

[在线网页](https://study8677.github.io/ReadYourUsers/) | [完整报告](reports/latest/anthropics-claude-code.zh.md) | [English](README.md) | *基于公开 GitHub Issues，代表需求信号而非全部用户声音。*

<!-- READYOURUSERS:END -->

## 工作原理

```
GitHub Issues ──► 抓取 ──► LLM 分析 ──► 聚类 & 排名 ──► 报告
                  (Octokit)  (逐条分析)   (需求得分)      (Markdown)
```

1. **抓取** — 通过 GitHub API 拉取目标仓库的公开 issues（分页、etag 缓存、增量更新）
2. **分析** — LLM 从每条 issue 中提取结构化需求信号（类型、归一需求、模块标签、严重程度）
3. **聚合** — 按模块聚类相似需求，计算需求分数和上升趋势
4. **生成** — 产出排行报告，每条结论都链接回原始 issue

## 快速开始

```bash
npm install
cp .env.example .env    # 填入你的 API key
npx tsx src/cli.ts run anthropics/claude-code
```

## 追踪的仓库

| 仓库 | 产品 | 分类 |
| --- | --- | --- |
| [anthropics/claude-code](https://github.com/anthropics/claude-code) | Claude Code | AI 编程 CLI |
| [openai/codex](https://github.com/openai/codex) | OpenAI Codex CLI | AI 编程 Agent |
| [getcursor/cursor](https://github.com/getcursor/cursor) | Cursor | AI 代码编辑器 |

## 报告

- [最新英文报告](reports/latest/anthropics-claude-code.md)
- [最新中文报告](reports/latest/anthropics-claude-code.zh.md)
- [历史周报归档](reports/archive/)

## 原则

- **仅公开数据** — 只分析公开 GitHub Issues
- **可追溯** — 每条洞察都能链接到原始 issue
- **信号而非普查** — 代表公开讨论，不等于全部用户
- **不抓取联系方式** — 绝不收集个人信息

## License

MIT
