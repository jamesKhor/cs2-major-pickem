# CS2 Major Pick'Em 预测 Skill

这是一个给 AI Agent 使用的 Counter-Strike 2 Major Pick'Em / Viewer Pass 预测 Skill。

[English README](README.md)

它的目标不是保证每次都拿 Diamond coin。CS2 的变量太多：BO1 爆冷、队伍临场状态、地图 veto、选手生病或替补、版本变化、现场压力、季后赛冠军预测等等，都可能让完美预测失败。

更现实的目标是：**争取 Gold，保留冲击 Diamond 的机会**，但不保证拿到任何等级。

- 瑞士轮阶段：`5 个正确 = 通过`，`4 个或更少 = 失败`，`6 个以上 = 好结果`
- 季后赛阶段：通常需要猜中至少 2 个四分之一决赛胜者、至少 1 个半决赛胜者，以及最终冠军

## 当前预测：新加坡 Major 2026 第一阶段

| 分组 | 队伍 |
| --- | --- |
| **3-0** | **100 Thieves、HEROIC** |
| **3-1 / 3-2** | PVISION、Liquid、Ninjas in Pyjamas、FaZe、Eternal Fire、M80 |
| **0-3** | Chinggis Warriors、Lynn Vision |

首场比赛于 11 月 24 日中午 12:00（中国 / 新加坡时间）开始。请以游戏内倒计时为准，提前激活观赛通行证并保存全部 10 项预测。

[新加坡完整预测与结果](predictions/2026-pgl-singapore/README.md) · [科隆完整预测与结果](predictions/2026-iem-cologne/README.md) · [预测档案](predictions/README.md)

欢迎[提交问题或功能建议](https://github.com/jamesKhor/cs2-major-pickem/issues/new)，也欢迎通过 Pull Request 贡献。请先阅读[贡献指南](CONTRIBUTING.md)。

## 这个 Skill 做什么

这个 Skill 让 AI Agent 学会：

- 理解 CS2 Pick'Em 的精确 bucket 计分逻辑
- 区分“强队”和“正确 bucket”
- 生成瑞士轮 Pick'Em 卡：`3-0`、`3-1/3-2`、`0-3`
- 生成季后赛 bracket 预测
- 审核已经提交或正在进行中的 Pick'Em 卡
- 计算当前阶段是否还能通过
- 在数据不完整或来源过期时拒绝给出最终锁定卡
- 优先保证 5 个正确，再考虑冲 6 个以上

## 为什么需要它

普通 AI 很容易把 Pick'Em 当成“谁更强”的问题。但 Viewer Pass 不是这样计分的。

在 CS2 Pick'Em 里，强队放错 bucket 也会错：

- 你把一支队伍放在 `3-1/3-2`，但它最后 `3-0`，这算错
- 你把一支队伍放在 `3-0`，但它最后 `3-1` 晋级，这算错
- 你把一支队伍放在 `0-3`，但它赢了一场，这算错

这个 Skill 的核心就是强制 AI 按照游戏内 Viewer Pass 的真实逻辑来预测和评分。

## 仓库结构

```text
cs2-major-pickem/
+-- README.md
+-- README.zh-CN.md
+-- LICENSE
+-- docs/
|   +-- BACKTEST_REPORT.md
+-- skills/
|   +-- cs2-major-pickem/
|       +-- SKILL.md
|       +-- agents/
|           +-- openai.yaml
+-- prompts/
|   +-- pre-stage-card.md
+-- examples/
    +-- stage-audit-template.md
```

## Codex 安装方式

把 skill 文件夹复制到 Codex 的 skills 目录：

```powershell
Copy-Item -Recurse -Force `
  ".\skills\cs2-major-pickem" `
  "$env:USERPROFILE\.codex\skills\cs2-major-pickem"
```

然后开启新的 Codex 对话，输入类似：

```text
Use the cs2-major-pickem skill. Create a pre-lock Pick'Em card for the next CS2 Major stage. Verify live sources first.
```

中文也可以这样问：

```text
使用 cs2-major-pickem skill。请为下一个 CS2 Major 阶段生成 Pick'Em 卡。先验证实时来源，不要用过期记忆。
```

## Claude Code 或其他 AI Agent 安装方式

Claude Code 不一定原生支持 Codex skill 文件夹，但你可以把它当成 Agent instruction 使用：

1. 把 `skills/cs2-major-pickem/SKILL.md` 复制到你的 Agent 指令目录或项目文档里。
2. 在预测 Pick'Em 前要求 Agent 读取并遵守这个文件。
3. 每次预测当前阶段时，要求 Agent 先查实时来源。

推荐提示词：

```text
Read and follow ./skills/cs2-major-pickem/SKILL.md.
Create a CS2 Major Pick'Em card for the current stage.
Do not use stale memory. Verify official format, HLTV state, Liquipedia format, opening matchups, rankings, recent form, rosters, and maps.
Return exact buckets, confidence, alternates, source timestamp, and pass/fail math.
```

中文版本：

```text
请读取并遵守 ./skills/cs2-major-pickem/SKILL.md。
为当前 CS2 Major 阶段生成 Pick'Em 卡。
不要只依赖旧记忆。请先验证官方赛制、HLTV 当前状态、Liquipedia 赛制、首轮对阵、排名、近期状态、阵容和地图池。
输出精确 bucket、信心等级、替代选择、来源时间戳和通过/失败数学。
```

任何支持 system prompt、project instructions 或自定义 Agent 指令的 AI，都可以直接把 `SKILL.md` 内容放进去使用。

## 每次预测前必须验证的来源

当前阶段预测不能只靠记忆。Agent 必须先验证：

1. 官方 Valve、游戏内、BLAST、ESL 或赛事页面：阶段规则、赛程、锁定时间
2. HLTV 赛事页面：瑞士轮战绩、对阵、排名、结果、队伍页面
3. Liquipedia：赛制和 bracket 交叉验证
4. 最近比赛、阵容、替补、地图池和近期 LAN 表现

如果无法访问实时来源，Agent 应该说明预测被阻塞或低信心，而不是假装确定。

## 基本用法

### 阶段开始前生成瑞士轮卡

```text
Use cs2-major-pickem.
Make a pre-lock card for <Major> <Stage>.
Optimize first for 5 correct, then for 6+ only if it does not materially risk the 5-correct floor.
Return 3-0, 3-1/3-2, 0-3, confidence, alternates, sources, and pass math.
```

中文：

```text
使用 cs2-major-pickem。
为 <Major> <Stage> 生成锁定前 Pick'Em 卡。
先优化至少 5 个正确，只有在不明显影响 5 个正确底线时才追求 6 个以上。
输出 3-0、3-1/3-2、0-3、信心等级、替代方案、来源和通过数学。
```

### 审核正在进行中的阶段

```text
Use cs2-major-pickem.
Audit my live Pick'Em card:
3-0: ...
3-1/3-2: ...
0-3: ...

Tell me locked correct, locked wrong, pending live, minimum needed to pass, max possible correct, and whether I am still alive.
```

中文：

```text
使用 cs2-major-pickem。
审核我当前的 Pick'Em 卡：
3-0: ...
3-1/3-2: ...
0-3: ...

告诉我已经锁定正确几个、锁定错误几个、还有几个 pending、最少还需要几个才能通过、最高还能拿几个，以及是否还活着。
```

### 季后赛 bracket

```text
Use cs2-major-pickem.
Create a playoff Pick'Em bracket for <Major>.
Verify the final bracket, match format, current team form, map pools, and roster issues.
Optimize for the coin missions first: quarterfinals, semifinals, champion.
```

中文：

```text
使用 cs2-major-pickem。
为 <Major> 生成季后赛 Pick'Em bracket。
先验证最终 bracket、比赛赛制、队伍状态、地图池和阵容问题。
优先优化 coin 任务：四分之一决赛、半决赛、冠军。
```

## 输出标准

每次预测或审核都应该包含：

- 来源时间戳
- 精确的游戏内 bucket 或 playoff bracket
- 信心等级：high、medium、low
- 替代选择，以及替换哪个具体 bucket
- 通过/失败数学：
  - `locked_correct`
  - `locked_wrong`
  - `pending_live`
  - `minimum_needed_to_pass`
  - `max_possible_correct`
  - `status`
- 来源链接

## 测试方法和结果

当前历史测试总结见：

[docs/BACKTEST_REPORT.md](docs/BACKTEST_REPORT.md)

测试范围包括：

- PGL Copenhagen 2024
- Perfect World Shanghai 2024
- BLAST Austin 2025
- StarLadder Budapest 2025

总结结果：

| 项目 | 结果 |
|---|---:|
| 瑞士轮阶段通过 | 11/11 |
| 季后赛阶段通过 | 3/4 |
| Diamond 结果 | 3/4 |
| Gold 结果 | 1/4 |
| Silver 结果 | 0/4 |
| Copper 结果 | 0/4 |

重要说明：这不是完美密封的 blind test，而是 **pre-lock constrained backtest**。也就是说，每个阶段只允许使用锁定前应该可获得的信息，但由于测试发生在持续对话中，部分历史结果之前已经被讨论过。因此它更适合作为流程校准，而不是绝对模型排行榜。

## 限制

- 没有任何 Pick'Em 系统能保证每次 Diamond。
- BO1 阶段波动很大。
- 季后赛冠军预测非常关键，也非常容易出错。
- 即使季后赛大部分 bracket 猜对，只要冠军错了，也可能失败。
- 生病、替补、旅行、版本变化、临场状态都会快速改变预测。

请把这个 Skill 当成一个纪律化的预测流程，而不是确定性机器。
