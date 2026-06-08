# CS2 Major Pick'Em Prediction Skill

An AI-agent skill for Counter-Strike 2 Major Pick'Em / Viewer Pass predictions.

The goal is not to promise a Diamond coin every Major. CS2 has too much BO1 variance, roster volatility, map-veto variance, and playoff upset risk for that. The practical goal is a disciplined **Gold floor with Diamond upside** by optimizing each stage for the mission threshold:

- Swiss stages: `5 correct = pass`, `4 or fewer = fail`, `6+ = good`
- Playoffs: satisfy the in-game bracket missions, usually 2 quarterfinal winners, 1 semifinal winner, and the champion

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

1. Official Valve, in-game, BLAST, ESL, or tournament page for stage rules and schedule
2. HLTV event page for live Swiss records, matchups, rankings, results, and team pages
3. Liquipedia for format and bracket cross-checks
4. Recent match, roster, and map-pool data

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
