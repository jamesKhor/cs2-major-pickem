# Backtest Report

This report summarizes the current historical test of the `cs2-major-pickem` skill.

## Executive Summary

The skill performed well as a pass-focused Pick'Em process. It should be treated as a **Gold floor, Diamond upside** system, not a guarantee of Diamond every Major.

Across the tested 2024 and 2025 CS2 Majors:

- Swiss stages tested: 11
- Swiss stages passed: 11
- Playoff stages tested: 4
- Playoff stages passed: 3
- Estimated coin outcomes: 3 Diamond, 1 Gold, 0 Silver, 0 Copper

The strongest signal is stage survival. The weakest signal is playoff champion certainty.

## Test Scope

Events covered:

| Year | Major | Swiss stages tested | Playoffs tested |
|---|---|---:|---:|
| 2024 | PGL Copenhagen 2024 | 2 | 1 |
| 2024 | Perfect World Shanghai 2024 | 2 | 1 |
| 2025 | BLAST Austin 2025 | 3 | 1 |
| 2025 | StarLadder Budapest 2025 | 3 | 1 |

Format note:

- 2024 Majors had Opening Stage, Elimination Stage, then Playoffs.
- 2025 Majors used Stage 1, Stage 2, Stage 3, then Playoffs.
- There is no Stage 3 Swiss for the 2024 Majors in this report.

## Methodology

This was a **pre-lock constrained historical test**, not a perfect sealed blind test.

Allowed inputs for each simulated stage:

- Final team list for that stage
- Opening matchups
- Stage format, including BO1 and BO3 rules
- Rankings and form available before that stage began
- Known rosters, stand-ins, map pools, and recent event results available at stage lock
- Previous stage results only when that previous stage had already completed

Disallowed inputs:

- Final standings from the stage being predicted
- Later playoff results
- Later roster or form knowledge
- Hindsight explanations disguised as prediction logic

Important caveat:

Because this evaluation was performed in an ongoing chat where some historical outcomes had already been discussed, it is not a mathematically pure blind trial. The correct label is **pre-lock constrained backtest**. A future benchmark should isolate the prediction agent from final standings and reveal results only after each card is locked.

## Agent And Model Setup

Evaluation agent:

- Codex using the local `cs2-major-pickem` skill

Skill rules used:

- Exact CS2 Pick'Em bucket scoring
- Live/source verification requirement
- Stage gate before lockable cards
- Pass-first strategy: optimize for 5 correct before chasing 6+
- Separate advancement probability from exact bucket probability
- Playoff mission scoring: quarterfinals, semifinals, champion

Model disclosure:

- The exact hosted model name can vary by the local Codex environment.
- The test should be interpreted as an AI-agent workflow benchmark, not a fixed-model leaderboard.
- For future reproducible tests, record model name, date, prompt, sources, and the frozen pre-lock data packet for every stage.

## Scoring Rules

Swiss stage scoring:

- `3-0` is correct only if the team finishes exactly 3-0.
- `3-1/3-2` is correct only if the team advances exactly 3-1 or 3-2.
- `0-3` is correct only if the team finishes exactly 0-3.
- `5/10` correct is a pass.
- `6/10+` is good.
- `4/10` or fewer is a fail.

Playoff scoring:

- Correctly predict at least 2 quarterfinal winners.
- Correctly predict at least 1 semifinal winner.
- Correctly predict the champion.
- If the in-game Viewer Pass text for a future Major differs, the in-game text overrides this report.

## Results

| Major | Stage 1 / Opening | Stage 2 / Elimination | Stage 3 | Playoffs | Estimated coin path |
|---|---:|---:|---:|---|---|
| PGL Copenhagen 2024 | 7/10 pass | 8/10 pass | N/A | Fail: champion missed | Gold |
| Perfect World Shanghai 2024 | 8/10 pass | 6/10 pass | N/A | Pass | Diamond |
| BLAST Austin 2025 | 8/10 pass | 7/10 pass | 6/10 pass | Pass | Diamond |
| StarLadder Budapest 2025 | 8/10 pass | 7/10 pass | 6/10 pass | Pass | Diamond |

Aggregate:

| Category | Result |
|---|---:|
| Swiss stages passed | 11/11 |
| Playoff stages passed | 3/4 |
| Diamond outcomes | 3/4 |
| Gold outcomes | 1/4 |
| Silver outcomes | 0/4 |
| Copper outcomes | 0/4 |

## Interpretation

The results support using the skill as a disciplined pass-focused process.

What worked:

- Strong survival rate across Swiss stages
- Good discipline around exact buckets
- Better than casual prediction by focusing on the 5-correct pass threshold
- Useful stage-by-stage approach instead of trying to predict the entire Major from day one

What failed or remains risky:

- Champion pick is the biggest playoff risk.
- Bucket traps remain hard: a correct advancing team can still be wrong if it lands in the wrong bucket.
- BO1 stages can punish even strong team reads.
- A 6/7 playoff bracket can still fail if the champion is wrong.

## Recommended Future Benchmark

For a stronger blind test:

1. Create a frozen pre-lock data packet for each stage.
2. Give the agent only that packet plus the skill.
3. Require a final locked card before revealing results.
4. Score exact buckets and playoff missions.
5. Save prompt, model, date, sources, output, and score.

This will produce a cleaner benchmark than an interactive chat backtest.
