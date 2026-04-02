# ReadYourUsers

> 把公开 GitHub Issues 变成可读的**用户需求地图**。

我们分析 AI 编程工具最活跃仓库中的数千条公开 issue，提炼成带排名、带聚类的周报 — 让你一眼看到开发者真正想要什么。

**[English README](README.md)**

<!-- READYOURUSERS:START -->

## AI 编程工具 — 开发者真正想要什么

> 从 [anthropics/claude-code](https://github.com/anthropics/claude-code) 分析了 **97** 条 issue | **16** 个需求簇 | 更新于 2026-04-02

### Top 10 需求

| 排名 | 需求 | Issue 数 | 得分 | 分类 | 示例 |
| --- | --- | --- | --- | --- | --- |
| 1 | Improve Session Management and Input Reliability | 15 | 6.7 | UI/UX | [#42617](https://github.com/anthropics/claude-code/issues/42617), [#42613](https://github.com/anthropics/claude-code/issues/42613), [#42612](https://github.com/anthropics/claude-code/issues/42612) |
| 2 | Improved Session Stability and Token Management | 18 | 4.2 | Reliability | [#42637](https://github.com/anthropics/claude-code/issues/42637), [#42624](https://github.com/anthropics/claude-code/issues/42624), [#42615](https://github.com/anthropics/claude-code/issues/42615) |
| 3 | Enhancing MCP Server Connectivity and Diagnostics | 6 | 4.0 | Reliability | [#42632](https://github.com/anthropics/claude-code/issues/42632), [#42627](https://github.com/anthropics/claude-code/issues/42627), [#42599](https://github.com/anthropics/claude-code/issues/42599) |
| 4 | Optimize Performance and Resource Usage | 4 | 3.0 | Performance | [#42633](https://github.com/anthropics/claude-code/issues/42633), [#42620](https://github.com/anthropics/claude-code/issues/42620), [#42609](https://github.com/anthropics/claude-code/issues/42609) |
| 5 | Enhancements for Editor Functionality and UI Navigation | 10 | 3.0 | Developer Experience | [#42638](https://github.com/anthropics/claude-code/issues/42638), [#42631](https://github.com/anthropics/claude-code/issues/42631), [#42630](https://github.com/anthropics/claude-code/issues/42630) |
| 6 | Fix Issues with Tools, Configurations, and Platform Handling | 8 | 3.0 | Developer Experience | [#42635](https://github.com/anthropics/claude-code/issues/42635), [#42614](https://github.com/anthropics/claude-code/issues/42614), [#42611](https://github.com/anthropics/claude-code/issues/42611) |
| 7 | Enhance Conversation History Configurability and Handling | 4 | 3.0 | Configuration | [#42625](https://github.com/anthropics/claude-code/issues/42625), [#42590](https://github.com/anthropics/claude-code/issues/42590), [#42558](https://github.com/anthropics/claude-code/issues/42558) |
| 8 | Fix Session Stability and Functional Issues | 3 | 3.0 | Reliability | [#42591](https://github.com/anthropics/claude-code/issues/42591), [#42578](https://github.com/anthropics/claude-code/issues/42578), [#42557](https://github.com/anthropics/claude-code/issues/42557) |
| 9 | Subscription Plans and Token Management Enhancements | 5 | 2.7 | Configuration | [#42628](https://github.com/anthropics/claude-code/issues/42628), [#42626](https://github.com/anthropics/claude-code/issues/42626), [#42605](https://github.com/anthropics/claude-code/issues/42605) |
| 10 | Enhance Model Accuracy and Output Consistency | 6 | 2.2 | Developer Experience | [#42636](https://github.com/anthropics/claude-code/issues/42636), [#42634](https://github.com/anthropics/claude-code/issues/42634), [#42629](https://github.com/anthropics/claude-code/issues/42629) |

### 上升最快的需求

| 需求 | 上升倍率 | 本周 | 分类 |
| --- | --- | --- | --- |
| Improved Session Stability and Token Management | 19.0x | 18 | Reliability |
| Improve Session Management and Input Reliability | 16.0x | 15 | UI/UX |
| Enhancements for Editor Functionality and UI Navigation | 11.0x | 10 | Developer Experience |
| Fix Issues with Tools, Configurations, and Platform Handling | 9.0x | 8 | Developer Experience |
| Enhancing MCP Server Connectivity and Diagnostics | 7.0x | 6 | Reliability |

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
