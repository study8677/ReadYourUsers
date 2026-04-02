# ReadYourUsers

> 把公开 GitHub Issues 变成可读、可排序、可追溯的用户需求地图。

ReadYourUsers 是一个 TypeScript CLI + 静态站点工作流，用来把嘈杂的 GitHub issue 流整理成产品团队真正能用的需求信号：

- **有排序的用户需求**
- **正在上升的趋势**
- **可以追溯到原始 issue 的证据链**
- **中英双语报告和双语网站**

**链接：** [在线网页](https://study8677.github.io/ReadYourUsers/) · [English](https://study8677.github.io/ReadYourUsers/en/index.html) · [中文](https://study8677.github.io/ReadYourUsers/zh/index.html) · [English README](README.md)

<!-- READYOURUSERS:START -->

## 实时快照 — Claude Code

> 基于 [anthropics/claude-code](https://github.com/anthropics/claude-code) 的 326 条 issue · 33 个需求簇 · 更新于 2026-04-02

### 当前最强需求

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

### 上升最快

| 需求 | 上升倍率 | 本周 | 分类 |
| --- | --- | --- | --- |
| TUI Terminal State and Input Handling Fixes | 52.0x | 51 | UI/UX |
| MCP Server Reliability and Configuration Issues | 34.0x | 33 | Integration |
| CLI Session Management and UX Improvements | 33.0x | 32 | Developer Experience |
| Bug Fixes and Feature Enhancements | 32.0x | 31 | Developer Experience |
| Configuration and Settings Management Improvements | 18.0x | 17 | Configuration |

[在线网页](https://study8677.github.io/ReadYourUsers/) | [English site](https://study8677.github.io/ReadYourUsers/en/index.html) | [中文站点](https://study8677.github.io/ReadYourUsers/zh/index.html) | [完整报告](reports/latest/anthropics-claude-code.zh.md) | [English](README.md) | *基于公开 GitHub Issues，代表需求信号而非全部用户声音。*

<!-- READYOURUSERS:END -->

## 为什么值得做

直接看 GitHub issue 不够高效：

- 标题表达不统一
- 重复需求分散在多个线程里
- 紧迫度不容易一眼看出来
- 最近升温的问题常常埋在长列表里

ReadYourUsers 把这些原始讨论压缩成一张几分钟就能扫完的需求地图。

## 你能得到什么

- **需求排行** — 聚类后的核心用户需求与 demand score
- **上升趋势** — 最近正在加速出现的问题
- **可追溯证据** — 每条结论都能回到原始 issue
- **双语输出** — 英文 / 中文报告与双语站点
- **可复用工作流** — 抓取、分析、聚合、发布一条龙

## 快速开始

### 环境要求

- Node.js 18+
- 用于读取公开 issue 的 GitHub token
- Anthropic 或 OpenAI 兼容接口的 LLM key

### 安装

```bash
npm install
cp .env.example .env
```

### 跑完整流程

```bash
npx tsx src/cli.ts run anthropics/claude-code
```

### 分步执行

```bash
npx tsx src/cli.ts fetch anthropics/claude-code
npx tsx src/cli.ts analyze anthropics/claude-code
npx tsx src/cli.ts aggregate anthropics/claude-code
npx tsx src/cli.ts generate anthropics/claude-code
```

## 工作原理

1. **抓取** — 从 GitHub 拉取公开 issue，并做缓存
2. **分析** — 用 LLM 提取结构化需求信号
3. **聚合** — 聚类相似需求，计算 demand / rising score
4. **生成** — 发布 Markdown 报告、站点页面和 README 快照

## 产物

```text
reports/latest/<repo>.md
reports/latest/<repo>.zh.md
reports/archive/<week>/<repo>.md
reports/archive/<week>/<repo>.zh.md
site/en/...
site/zh/...
README.md
README.zh.md
```

## 当前追踪的仓库

| 仓库 | 产品 | 分类 |
| --- | --- | --- |
| [anthropics/claude-code](https://github.com/anthropics/claude-code) | Claude Code | AI 编程 CLI |
| [openai/codex](https://github.com/openai/codex) | OpenAI Codex CLI | AI 编程 Agent |
| [getcursor/cursor](https://github.com/getcursor/cursor) | Cursor | AI 代码编辑器 |

## 局限

- **只看公开数据** — 私有支持渠道不包含在内
- **信号不是普查** — issue 数量不等于真实总用户数
- **LLM 总结不是完美的** — 所以必须保留可追溯链接
- **不同产品的 GitHub 活跃度不同** — 跨产品比较要谨慎

## Development

```bash
npm run build
npm run site:build
npm test
```

## License

MIT
