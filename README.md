# CS2 Major Pick'Em Prediction Skill

An AI-agent skill for Counter-Strike 2 Major Pick'Em / Viewer Pass predictions.

[中文 README](README.zh-CN.md)

The goal is to **target Gold and keep Diamond possible**, not to guarantee either. CS2 has too much BO1 variance, roster volatility, and playoff upset risk for that. We optimize each card for the mission threshold:

- Swiss stages: `5 correct = pass`, `4 or fewer = fail`, `6+ = good`
- Playoffs: satisfy the in-game bracket missions, usually 2 quarterfinal winners, 1 semifinal winner, and the champion

## Current Picks: Singapore 2026 Stage 1

Final pre-lock card, November 23, 2026. The first match is at 12:00 noon SGT (UTC+8) on November 24; follow the in-game countdown. Activate the Singapore Viewer Pass before the stage and save all 10 picks for coin credit.

| Bucket | Picks |
| --- | --- |
| **3-0** | **100 Thieves, HEROIC** |
| **3-1 / 3-2** | PVISION, Liquid, Ninjas in Pyjamas, FaZe, Eternal Fire, M80 |
| **0-3** | Chinggis Warriors, Lynn Vision |

[Stage 1 reasoning, inputs, and result](predictions/2026-pgl-singapore/README.md#stage-1). The next card is recorded after the previous stage's results and new openers are confirmed.

## Prediction Results

| Major | Stage 1 | Stage 2 | Stage 3 | Playoffs |
| --- | --- | --- | --- | --- |
| [IEM Cologne 2026](predictions/2026-iem-cologne/README.md) | 3/10, fail | 5/10, pass | 3/10, fail | 3/4 QF, 1/2 SF, champion missed |
| [PGL Singapore 2026](predictions/2026-pgl-singapore/README.md) | Card published, result pending | Awaiting field | Awaiting field | Awaiting bracket |

The [prediction archive](predictions/README.md) keeps exact cards next to their outcomes, including misses. The [2024-2025 historical backtests](docs/BACKTEST_REPORT.md) are retrospective and do not count as live predictions.

## Contribute

Found a scoring bug or have an idea for a better forecast? [Open an issue](https://github.com/jamesKhor/cs2-major-pickem/issues/new) or send a pull request. See the [contribution guide](CONTRIBUTING.md) for what evidence and tests to include.

## What This Skill Does

This skill teaches an AI agent to:

- Understand exact CS2 Pick'Em bucket scoring
- Separate team quality from bucket probability
- Produce stage-by-stage Swiss cards: `3-0`, `3-1/3-2`, and `0-3`
- Produce playoff bracket predictions
- Audit live or completed Pick'Em cards
- Calculate pass/fail math during a stage
- Refuse stale or incomplete predictions until current stage data is verified
- Prefer safe pass probability over risky perfect-pick chasing

## Why It Exists

Generic AI often gets Pick'Em wrong because it treats the problem as "which teams are best." That is not enough.

In CS2 Pick'Em, a great team can be a bad pick if it is placed in the wrong bucket:

- A team picked `3-1/3-2` is wrong if it finishes `3-0`
- A team picked `3-0` is wrong if it qualifies `3-1`
- A team picked `0-3` is wrong if it wins one match

This skill forces the agent to score the card exactly like the in-game Viewer Pass.

## Repository Layout

```text
cs2-major-pickem/
+-- README.md
+-- CONTRIBUTING.md
+-- LICENSE
+-- docs/
|   +-- BACKTEST_REPORT.md
+-- predictions/             # Pre-lock cards, source snapshots, and final scores
+-- skills/
|   +-- cs2-major-pickem/
|       +-- SKILL.md
|       +-- references/
|       +-- scripts/
|       +-- agents/
+-- prompts/
|   +-- pre-stage-card.md
+-- examples/
    +-- stage-audit-template.md
```

## Install For Codex

Copy the skill folder into your Codex skills directory:

```powershell
Copy-Item -Recurse -Force `
  ".\skills\cs2-major-pickem" `
  "$env:USERPROFILE\.codex\skills\cs2-major-pickem"
```

Then start a new Codex chat and ask something like:

```text
Use the cs2-major-pickem skill. Create a pre-lock Pick'Em card for the next CS2 Major stage. Verify live sources first.
```

## Install For Claude Code Or Generic Agents

Claude Code does not natively use Codex skill folders in the same way. Use the skill as an agent instruction file:

1. Copy `skills/cs2-major-pickem/SKILL.md` into your agent instructions folder or project docs.
2. Tell the agent to follow it before making Pick'Em predictions.
3. Require the agent to browse live sources before every current-stage card.

Example prompt:

```text
Read and follow ./skills/cs2-major-pickem/SKILL.md.
Create a CS2 Major Pick'Em card for the current stage.
Do not use stale memory. Verify official format, HLTV state, Liquipedia format, opening matchups, rankings, recent form, rosters, and maps.
Return exact buckets, confidence, alternates, source timestamp, and pass/fail math.
```

For any standard AI agent that supports system prompts or project instructions, paste the contents of `SKILL.md` into the agent's instruction context.

## Required Sources Before Every Current Prediction

The agent must verify current data before a live card:

1. Official Valve, in-game rules, and the event organizer (PGL, BLAST, or ESL) for format and schedule
2. HLTV event page for live Swiss records, matchups, rankings, results, and team pages
3. Liquipedia for format and bracket cross-checks
4. Recent match, roster, map-pool, and two-sided opener odds

If live sources are unavailable, the agent should say the card is blocked or low-confidence instead of pretending.

## Basic Usage

### Pre-Stage Swiss Card

```text
Use cs2-major-pickem.
Make a pre-lock card for <Major> <Stage>.
Optimize first for 5 correct, then for 6+ only if it does not materially risk the 5-correct floor.
Return 3-0, 3-1/3-2, 0-3, confidence, alternates, sources, and pass math.
```

### Live Stage Audit

```text
Use cs2-major-pickem.
Audit my live Pick'Em card:
3-0: ...
3-1/3-2: ...
0-3: ...

Tell me locked correct, locked wrong, pending live, minimum needed to pass, max possible correct, and whether I am still alive.
```

### Playoff Bracket

```text
Use cs2-major-pickem.
Create a playoff Pick'Em bracket for <Major>.
Verify the final bracket, match format, current team form, map pools, and roster issues.
Optimize for the coin missions first: quarterfinals, semifinals, champion.
```

## Output Standard

Every prediction or audit should include:

- Source timestamp
- Exact in-game buckets or playoff bracket picks
- Confidence: high, medium, or low
- Alternates with exact replacements
- Pass/fail math:
  - `locked_correct`
  - `locked_wrong`
  - `pending_live`
  - `minimum_needed_to_pass`
  - `max_possible_correct`
  - `status`
- Source links

## Backtesting Philosophy

This skill should be tested stage by stage using only information that would have been available before that stage locked.

Do not run hindsight tests where the agent sees final standings before choosing picks. That makes the skill look stronger than it is and teaches the wrong lessons.

See [docs/BACKTEST_REPORT.md](docs/BACKTEST_REPORT.md) for the current historical test summary, scope, methodology, caveats, and scores.

## Limitations

- No Pick'Em prediction system can guarantee Diamond.
- BO1 stages are volatile.
- Playoff champion prediction is fragile and can fail even when most bracket picks are correct.
- Live injury, illness, stand-in, travel, and patch/meta changes can shift the card quickly.

Use this skill as a disciplined prediction process, not a certainty machine.
