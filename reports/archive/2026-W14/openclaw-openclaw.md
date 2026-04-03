# OpenClaw — User Demand Report

**Week:** 2026-W14
**Generated:** 2026-04-03
**Issues analyzed:** 52 (47 included)
**Need clusters:** 12

## Top 10 User Needs

| Rank | Need | Issues | Score | Category | Examples |
| --- | --- | --- | --- | --- | --- |
| 1 | Core System Stability Fixes and Platform Enhancements | 20 | 6.5 | Platform Support | [#60299](https://github.com/openclaw/openclaw/issues/60299), [#60295](https://github.com/openclaw/openclaw/issues/60295), [#60294](https://github.com/openclaw/openclaw/issues/60294) |
| 2 | Fix Telegram DM Command Approval and File Context Handling | 3 | 2.0 | Integration | [#60260](https://github.com/openclaw/openclaw/issues/60260), [#60252](https://github.com/openclaw/openclaw/issues/60252), [#60201](https://github.com/openclaw/openclaw/issues/60201) |
| 3 | Resolve UI Overflows and Streaming Text Parsing Errors | 2 | 1.0 | UI/UX | [#60293](https://github.com/openclaw/openclaw/issues/60293), [#60247](https://github.com/openclaw/openclaw/issues/60247) |
| 4 | Fix cron job execution, delivery, and reporting failures | 3 | 1.0 | Reliability | [#60262](https://github.com/openclaw/openclaw/issues/60262), [#60256](https://github.com/openclaw/openclaw/issues/60256), [#60251](https://github.com/openclaw/openclaw/issues/60251) |
| 5 | Robust Session State Persistence and Context Continuity | 3 | 1.0 | Reliability | [#60255](https://github.com/openclaw/openclaw/issues/60255), [#60250](https://github.com/openclaw/openclaw/issues/60250), [#60213](https://github.com/openclaw/openclaw/issues/60213) |
| 6 | Fix Plugin Dependency Installation and Registration Conflicts | 2 | 1.0 | Reliability | [#60263](https://github.com/openclaw/openclaw/issues/60263), [#60219](https://github.com/openclaw/openclaw/issues/60219) |
| 7 | Improve Inbound Message Filtering and Plugin Hook Reliability | 2 | 1.0 | Integration | [#60274](https://github.com/openclaw/openclaw/issues/60274), [#60209](https://github.com/openclaw/openclaw/issues/60209) |
| 8 | Resolve agent authentication and messaging delivery issues | 2 | 1.0 | Reliability | [#60265](https://github.com/openclaw/openclaw/issues/60265), [#60202](https://github.com/openclaw/openclaw/issues/60202) |
| 9 | Granular Configuration Options for AI Reasoning and System Settings | 4 | 1.0 | Configuration | [#60232](https://github.com/openclaw/openclaw/issues/60232), [#60228](https://github.com/openclaw/openclaw/issues/60228), [#60217](https://github.com/openclaw/openclaw/issues/60217) |
| 10 | Fix Authentication Header and OAuth Scope Regressions | 2 | 0.0 | Security | [#60279](https://github.com/openclaw/openclaw/issues/60279), [#60225](https://github.com/openclaw/openclaw/issues/60225) |

## Rising Needs

| Need | Rising Score | This Week | Category |
| --- | --- | --- | --- |
| Core System Stability Fixes and Platform Enhancements | 21.0x | 20 | Platform Support |
| Granular Configuration Options for AI Reasoning and System Settings | 5.0x | 4 | Configuration |
| Fix Telegram DM Command Approval and File Context Handling | 4.0x | 3 | Integration |
| Fix cron job execution, delivery, and reporting failures | 4.0x | 3 | Reliability |
| Robust Session State Persistence and Context Continuity | 4.0x | 3 | Reliability |

## Category Breakdown

- **Reliability**: 4 clusters
- **Integration**: 3 clusters
- **Platform Support**: 1 clusters
- **UI/UX**: 1 clusters
- **Configuration**: 1 clusters
- **Security**: 1 clusters
- **Developer Experience**: 1 clusters

## All Need Clusters

### 1. Core System Stability Fixes and Platform Enhancements

Users are requesting critical bug fixes for task lifecycle management, race conditions, and provider parsing to ensure consistent reliability across environments. They also require expanded channel integrations, advanced configuration inheritance, and improved media handling to streamline cross-platform workflows and system interoperability.

- **Volume:** 20 issues (19 open, 1 closed)
- **Demand Score:** 6.5
- **Avg Reactions:** 0.1 | **Avg Comments:** 0.3
- **Example issues:** [#60299](https://github.com/openclaw/openclaw/issues/60299), [#60295](https://github.com/openclaw/openclaw/issues/60295), [#60294](https://github.com/openclaw/openclaw/issues/60294), [#60292](https://github.com/openclaw/openclaw/issues/60292), [#60280](https://github.com/openclaw/openclaw/issues/60280)

### 2. Fix Telegram DM Command Approval and File Context Handling

Users are reporting bugs where command execution approval workflows are inconsistently triggered or bypassed in Telegram direct messages. They also need reliable attachment of Telegram file messages to the active session context. These fixes are essential to maintain secure command execution and accurate conversation state during Telegram interactions.

- **Volume:** 3 issues (1 open, 2 closed)
- **Demand Score:** 2.0
- **Avg Reactions:** 0 | **Avg Comments:** 0.7
- **Example issues:** [#60260](https://github.com/openclaw/openclaw/issues/60260), [#60252](https://github.com/openclaw/openclaw/issues/60252), [#60201](https://github.com/openclaw/openclaw/issues/60201)

### 3. Resolve UI Overflows and Streaming Text Parsing Errors

Users are requesting fixes for interface layout glitches and multi-byte character handling that disrupt command prompts and streaming outputs. These enhancements will ensure a polished visual experience and prevent text corruption during interactive sessions.

- **Volume:** 2 issues (2 open, 0 closed)
- **Demand Score:** 1.0
- **Avg Reactions:** 0 | **Avg Comments:** 0.5
- **Example issues:** [#60293](https://github.com/openclaw/openclaw/issues/60293), [#60247](https://github.com/openclaw/openclaw/issues/60247)

### 4. Fix cron job execution, delivery, and reporting failures

Users are encountering multiple failures with scheduled cron jobs, including problems waking agent sessions, delivering messages during active sessions, and reporting errors when environment variables are used. Addressing these issues is critical to ensure consistent automated task execution and accurate error notifications for agent workflows.

- **Volume:** 3 issues (3 open, 0 closed)
- **Demand Score:** 1.0
- **Avg Reactions:** 0 | **Avg Comments:** 1
- **Example issues:** [#60262](https://github.com/openclaw/openclaw/issues/60262), [#60256](https://github.com/openclaw/openclaw/issues/60256), [#60251](https://github.com/openclaw/openclaw/issues/60251)

### 5. Robust Session State Persistence and Context Continuity

Users need reliable session management to prevent conversation context loss during automatic compaction or channel switches. They also require accurate state persistence to ensure runs correctly transition to terminal states. These improvements are essential for maintaining seamless conversational continuity and preventing silent session failures.

- **Volume:** 3 issues (3 open, 0 closed)
- **Demand Score:** 1.0
- **Avg Reactions:** 0 | **Avg Comments:** 1
- **Example issues:** [#60255](https://github.com/openclaw/openclaw/issues/60255), [#60250](https://github.com/openclaw/openclaw/issues/60250), [#60213](https://github.com/openclaw/openclaw/issues/60213)

### 6. Fix Plugin Dependency Installation and Registration Conflicts

Users want the system to automatically install or bundle plugin peer dependencies during upgrades to prevent missing functionality. They also need to resolve issues where duplicate plugin loads incorrectly skip tool registration. Fixing these problems will ensure a stable plugin ecosystem and reliable upgrade experiences.

- **Volume:** 2 issues (2 open, 0 closed)
- **Demand Score:** 1.0
- **Avg Reactions:** 0 | **Avg Comments:** 1
- **Example issues:** [#60263](https://github.com/openclaw/openclaw/issues/60263), [#60219](https://github.com/openclaw/openclaw/issues/60219)

### 7. Improve Inbound Message Filtering and Plugin Hook Reliability

Users are requesting better filtering of non-essential inbound events, such as iMessage tapbacks, to prevent processing noise and errors. They also need consistent triggering of plugin execution hooks during embedded agent runs to guarantee reliable automation workflows. These changes will clean up message ingestion and ensure dependable plugin behavior across different runtime contexts.

- **Volume:** 2 issues (2 open, 0 closed)
- **Demand Score:** 1.0
- **Avg Reactions:** 0 | **Avg Comments:** 0.5
- **Example issues:** [#60274](https://github.com/openclaw/openclaw/issues/60274), [#60209](https://github.com/openclaw/openclaw/issues/60209)

### 8. Resolve agent authentication and messaging delivery issues

Users need fixes for authentication failures when spawning subagents on unsupported channels, alongside corrections to prevent duplicate and stale responses in the messaging gateway. Addressing these bugs is essential for ensuring consistent and accurate communication across the system.

- **Volume:** 2 issues (2 open, 0 closed)
- **Demand Score:** 1.0
- **Avg Reactions:** 0 | **Avg Comments:** 0.5
- **Example issues:** [#60265](https://github.com/openclaw/openclaw/issues/60265), [#60202](https://github.com/openclaw/openclaw/issues/60202)

### 9. Granular Configuration Options for AI Reasoning and System Settings

Users want more flexible and granular control over how AI reasoning and underlying system processes are configured. They are specifically requesting scoped settings, secure environment variable resolution, customizable output languages, and adjustable processing timeouts. These enhancements will allow teams to better align the platform with their specific security policies, workflow requirements, and performance expectations.

- **Volume:** 4 issues (4 open, 0 closed)
- **Demand Score:** 1.0
- **Avg Reactions:** 0.3 | **Avg Comments:** 0.5
- **Example issues:** [#60232](https://github.com/openclaw/openclaw/issues/60232), [#60228](https://github.com/openclaw/openclaw/issues/60228), [#60217](https://github.com/openclaw/openclaw/issues/60217), [#60203](https://github.com/openclaw/openclaw/issues/60203)

### 10. Fix Authentication Header and OAuth Scope Regressions

Users are reporting recent regressions where OAuth authentication headers are incorrectly routed and operator scopes are unexpectedly cleared for shared-auth API clients. These issues disrupt secure API access and token validation, requiring immediate fixes to restore reliable authentication workflows.

- **Volume:** 2 issues (2 open, 0 closed)
- **Demand Score:** 0.0
- **Avg Reactions:** 0 | **Avg Comments:** 0
- **Example issues:** [#60279](https://github.com/openclaw/openclaw/issues/60279), [#60225](https://github.com/openclaw/openclaw/issues/60225)

### 11. Improve Session Lock Handling and Workflow Orchestration

Users want the system to automatically reclaim file locks left behind by terminated processes, while also enabling the creation of named, reusable procedural workflows. These enhancements will eliminate resource contention and provide developers with a standardized way to automate complex, multi-step tasks.

- **Volume:** 2 issues (2 open, 0 closed)
- **Demand Score:** 0.0
- **Avg Reactions:** 0 | **Avg Comments:** 0
- **Example issues:** [#60258](https://github.com/openclaw/openclaw/issues/60258), [#60257](https://github.com/openclaw/openclaw/issues/60257)

### 12. Enhance Discord Thread Customization and Voice Channel Reliability

Users want customizable prompts for auto-generated Discord thread titles to improve organization and personalization. They also need a fix for voice channels failing to capture incoming audio to ensure stable communication. Addressing these requests will significantly improve the reliability and usability of Discord integrations.

- **Volume:** 2 issues (2 open, 0 closed)
- **Demand Score:** 0.0
- **Avg Reactions:** 0 | **Avg Comments:** 0
- **Example issues:** [#60237](https://github.com/openclaw/openclaw/issues/60237), [#60236](https://github.com/openclaw/openclaw/issues/60236)

---

*This report analyzes public GitHub issues only. It represents a signal from public issue discussions, not the full user base.*

*Generated by [ReadYourUsers](https://github.com/study8677/ReadYourUsers)*