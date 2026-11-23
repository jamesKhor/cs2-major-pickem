# CS2 Major Pick'Em Prediction Skill

An AI-agent skill for Counter-Strike 2 Major Pick'Em / Viewer Pass predictions.

[中文 README](README.zh-CN.md) | [How we build and test the model](#methodology)

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

| Major | Stage 1 | Stage 2 | Stage 3 | Playoffs | Coin |
| --- | --- | --- | --- | --- | --- |
| [IEM Cologne 2026](predictions/2026-iem-cologne/README.md) | 3/10, fail | 5/10, pass | 3/10, fail | 3/4 QF, 1/2 SF, champion missed | **Gold** |
| [PGL Singapore 2026](predictions/2026-pgl-singapore/README.md) | Card published, result pending | Awaiting field | Awaiting field | Awaiting bracket | Pending |

The [prediction archive](predictions/README.md) keeps exact cards next to their outcomes, including misses. The [2024-2025 historical backtests](docs/BACKTEST_REPORT.md) are retrospective and do not count as live predictions.

### IEM Cologne 2026 Picks and Results

**Bold teams were correct in their exact bucket.** Stage 3 is the recorded recommendation; its in-game submission was not independently verified.

| Stage | 3-0 picks | 3-1 / 3-2 picks | 0-3 picks | Score |
| --- | --- | --- | --- | --- |
| Stage 1 | GamerLegion, **BetBoom** | **BIG**, HEROIC, Liquid, **MIBR**, B8, Lynn Vision | NRG, THUNDER dOWNUNDER | **3/10**, missed |
| Stage 2 | **Spirit**, Legacy | **G2**, GamerLegion, Astralis, FUT, **BetBoom**, **9z** | **FlyQuest**, M80 | **5/10**, passed |
| Stage 3 | Vitality, Natus Vincere | Spirit, **Falcons**, FURIA, **Aurora**, MOUZ, The MongolZ | Monte, **B8** | **3/10**, missed |

| Playoffs | Picks | Result |
| --- | --- | --- |
| Quarterfinals | **FURIA**, **Aurora**, **Spirit**, Vitality | **3/4**, passed |
| Semifinals | **FURIA**, Spirit | **1/2**, passed |
| Champion | Spirit | **0/1**, missed; Falcons won |

**Outcome: Gold Coin earned.** We passed the Stage 2, quarterfinal and semifinal accuracy challenges.

[Full Cologne results and sources](predictions/2026-iem-cologne/README.md) · [科隆完整预测与赛果](predictions/2026-iem-cologne/README.zh-CN.md)

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

## Methodology

The **skill** tells the agent what to verify, how to read Pick'Em rules, and how to record a recommendation. The **simulator** estimates how often each whole card passes. The target is **at least 5 exact hits out of 10**, not the highest average score or the most teams correctly picked to advance.

### How We Develop a Card

1. **Freeze the inputs before lock.** Record the stage format, 16 seeded teams, eight confirmed openers, HLTV/VRS ranks, current rosters, and two-sided opener odds. Use recent results and likely map vetoes where supported. In Stage 1 there is no same-event form; in Stages 2 and 3, include the previous stage's results for teams that qualified.
2. **Simulate complete Swiss stages.** Use the event's BO1/BO3 rules, reseeding, Buchholz tiebreaks, and rematch avoidance. Compare a balanced model with form-heavy and rank/odds-heavy versions. The model uses the posted odds as opener evidence; later matchups are simulated, not known in advance. [Valve's Major rulebook](https://github.com/ValveSoftware/counter-strike_rules_and_regs/blob/main/major-supplemental-rulebook.md)
3. **Score whole cards on the same outcomes.** A simulated run counts as a pass only if five or more slots match their exact buckets. Searching full cards captures tradeoffs between slots. For instance, if both teams picked at `3-0` instead qualify at `3-1/3-2`, the card can hit at most four middle slots.
4. **Test finalists on fresh simulated draws.** Compare the finalists and a rank-first baseline on outcomes that were not used to search for the card. Publish the recommendation before lock and append the real score afterward. Held-out simulated draws check sampling noise; they do not validate the model against real matches.

### How Many Cards Are Possible?

A 16-team stage has two `3-0` slots, two `0-3` slots, and six `3-1/3-2` slots. No team can appear twice, and order within a bucket does not matter:

```text
Choose 2 of 16 for 3-0:             C(16, 2) = 120
Choose 2 of the 14 left for 0-3:    C(14, 2) = 91
Choose 6 of the 12 left for middle: C(12, 6) = 924
Total: 120 x 91 x 924 = 10,090,080 distinct cards
```

For any fixed final standings of this format, **801,836** of those cards score at least five. So a uniformly random card has a **7.95%** chance of passing. This is a combinatorial baseline, not a claim that all outcomes are equally likely or that every card can hit all ten slots.

### Singapore 2026 Stage 1 Comparison

We searched **1,247 candidate cards**, then scored the finalists on **180,000 held-out brackets** using the same inputs. Each percentage below is the share of those brackets where that entire card scored **5/10 or better**. For example, the published card passed **60,359 / 180,000** simulated brackets.

| Card | Change from the published card | Estimated chance of 5+ hits |
| --- | --- | ---: |
| **Published card** | **100 Thieves and HEROIC at 3-0** | **33.53%** |
| PVISION sweep alternative | Exchange HEROIC and PVISION between 3-0 and middle | 33.36% |
| FaZe sweep alternative | Exchange HEROIC and FaZe between 3-0 and middle | 33.18% |
| Wildcard winless alternative | Replace Lynn Vision with Wildcard at 0-3 | 32.97% |
| Rank-first baseline | PVISION and Liquid at 3-0; see the full input below | 30.11% |
| Uniform random card | Exact combinatorial baseline, outside the model | 7.95% |

An exploratory wider search considered **20,434 cards** and did not find a better finalist on the same evaluation brackets. Three reruns with different random seeds and **300,000 evaluation brackets each** kept the same recommendation: **33.54%, 33.51%, and 33.45%**. Those checks support a stable model result, not a claim of a global optimum across all 10 million cards.

### Two Separate Reviews

- **Test review:** Checks whether the program follows the rules. All six existing tests passed, including Swiss pairing, BO1/BO3 formats, and exact-bucket scoring. The review also found two gaps: malformed scenario settings can produce a bogus forecast instead of an error, and a fixed pre-stage maximum of 10 can overstate what's attainable when picks collide. The published Singapore inputs were valid; these gaps remain on the improvement list.
- **Model review:** Checks whether the inputs and assumptions produce stable, interpretable outputs. The reviewer verified the frozen inputs and score totals, and reproduced **33.53%**. Halving opener-odds weight lowered the published card to **32.88%**; removing the model's extra BO3 edge for stronger teams lowered it to **30.41%**. The published card still led the cards compared in both checks. Changing assumptions moved the estimate far more than rerunning random seeds did.

### Historical Validation

Replay real brackets to test rules, then compare forecast versions using only data timestamped before each stage locked. Start with Cologne and expand in event order. Fit BO1 and BO3 separately, test one change at a time, and judge both match prediction accuracy and actual **5/10 stage passes** on events not used to tune that change. The [2024-2025 retrospective report](docs/BACKTEST_REPORT.md) lacks complete frozen inputs; it is not an independent benchmark or evidence of a live success rate. The [prediction archive](predictions/README.md) keeps live cards and their observed scores separate.

Reproduce the main Singapore comparison from the repository root:

```sh
node --test skills/cs2-major-pickem/scripts/swiss.test.mjs
node skills/cs2-major-pickem/scripts/swiss.mjs predictions/2026-pgl-singapore/stage-1-input.json 12000 60000
```

See the [Singapore card and source notes](predictions/2026-pgl-singapore/README.md#pre-lock-check) and [simulation input guide](skills/cs2-major-pickem/references/swiss-forecast.md).

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

## Limitations

- No Pick'Em prediction system can guarantee Diamond.
- BO1 stages are volatile.
- Playoff champion prediction is fragile and can fail even when most bracket picks are correct.
- Live injury, illness, stand-in, travel, and patch/meta changes can shift the card quickly.

Use this skill as a disciplined prediction process, not a certainty machine.
