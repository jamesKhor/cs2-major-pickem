---
name: "cs2-major-pickem"
description: "Use when predicting, auditing, or reviewing Counter-Strike 2 Major Pick'Em / Viewer Pass picks, including CS2 Major stages, 3-0, 3-1/3-2, 0-3, playoff brackets, quarterfinals, semifinals, grand finals, diamond coin progression, gold floor strategy, bucket logic, Swiss format, team form, rosters, maps, and stage-by-stage prediction cards."
---

# CS2 Major Pick'Em Skill

## Purpose

Produce stage-by-stage CS2 Major Pick'Em cards and audits that optimize for coin progression.

- `5 correct = pass`
- `4 or fewer = fail`
- `6+ = good`

Target Diamond first and fall back to Gold if any challenge is missed. Neither coin tier nor any stage pass is guaranteed. Diamond needs every mission, not 10/10 correct on each Swiss card.

The goal is to pass each stage first, then chase 6+ when it does not materially reduce the 5-correct floor.

Swiss stages and playoffs use different scoring. Do not apply Swiss bucket logic to playoffs.

## Non-Negotiable Live Data Rule

Never make or audit a current-stage prediction from stale memory alone.

Before every current card or live audit, verify current data from live sources. If browsing or current data access is unavailable, say the output is blocked or low-confidence and ask the user for current screenshots/data.

Source priority:

1. Official Valve, in-game Pick'Em, BLAST/ESL/tournament page: stage teams, lock status, challenge rules, official schedule.
2. HLTV event page: live Swiss records, matchups, rankings, results, round difference, odds, match pages, roster pages, map stats.
3. Liquipedia: tournament format and bracket/Swiss cross-check.
4. Team, match, odds, and recent-event pages: roster changes, player form, vetoes, map pool, recent LAN results.

Always include source links and a source timestamp in the response.

## Strict Bucket Scoring

Pick'Em is exact-bucket scoring, not "which teams are good" scoring.

- `3-0` is correct only if the team finishes exactly 3-0.
- `3-1/3-2` is correct only if the team advances exactly 3-1 or 3-2.
- `0-3` is correct only if the team finishes exactly 0-3.
- A team picked `3-1/3-2` that finishes `3-0` is wrong.
- A team picked `3-0` that advances `3-1` or `3-2` is wrong.
- A team picked `0-3` that wins one match is wrong.
- A Swiss accuracy mission requires five exact hits total across the ten slots, with no minimum in any bucket unless the current in-game rules say otherwise.
- Submitting all ten picks on time and getting five correct are separate challenges. For coin credit, confirm the Viewer Pass is active before the stage and the complete card is saved before the in-game cutoff. Missing the accuracy mission does not stop the player from picking the next stage.

Separate these probabilities:

- Advancement probability
- Exact `3-0` probability
- Exact `3-1/3-2` probability
- Exact `0-3` probability

## Playoff Scoring

Playoffs are bracket predictions, not Swiss buckets.

Typical CS2 Major playoff coin checks:

- Correctly predict at least 2 quarterfinal winners.
- Correctly predict at least 1 semifinal winner.
- Correctly predict the grand-final winner.

If a specific Major's in-game challenge text differs, follow the in-game text.

For Singapore 2026, activation and four on-time submissions give five participation ticks. There are six separate accuracy ticks: three Swiss stages, quarterfinals, semifinals, and champion. Gold starts at eight total ticks; Diamond requires all eleven. Track real ticks separately from planned submissions. Missing one challenge ends the Diamond path, not the ability to pick the next stage. See [coin and playoff math](references/coin-math.md).

Playoff rules:

- Quarterfinal picks are direct match-winner picks.
- Semifinal picks depend on the bracket path. A semifinal pick is correct only if that team reaches and wins its semifinal.
- Grand-final winner is correct only if the predicted champion wins the Major.
- A team cannot be picked beyond the round where the bracket path says it was eliminated.
- Do not count a team as a correct semifinal or final pick just because it won an earlier round.

## Stage Gate

Before locking a Swiss prediction card, confirm:

- Stage team list is final.
- Previous stage qualifiers are final.
- Opening matchups are final.
- Stage format is verified, including BO1 vs BO3 rules.
- Pick'Em lock deadline has not passed.

If any item is missing, do not provide a final lock card. Provide a watchlist, likely buckets, and the exact missing facts.

Before locking a playoff bracket, confirm:

- Final playoff teams are known.
- Quarterfinal bracket order is final.
- Match format is verified, including BO3/BO5 grand final rules.
- Pick'Em lock deadline has not passed.
- Any roster/stand-in, illness, travel, or venue-stage change is checked.

## Prediction Method

Optimize first for reaching at least 5 correct. Chase 6+ only when it does not materially reduce the 5-correct floor.

Use [the Swiss forecast workflow](references/swiss-forecast.md) when the current format and inputs are verified. Simulate complete brackets with the correct pairing and series rules, then compare full cards on the share of runs with at least five hits. Use current HLTV/VRS, two-sided match odds, roster and form evidence, and likely maps. Stage 1 has no same-event form; for later stages check the actual matches of the teams that qualified. Describe probabilities as model estimates and projected vetoes as unconfirmed.

Check whether both 3-0 picks can sweep together. If both instead finish 3-1/3-2, at most four middle picks can hit, so a winless pick is required. A missed sweep that is eliminated does not take a middle slot. Compare whole-card outcomes; do not apply a second penalty to results that already account for these dependencies.

Preserve each pre-lock card, its date and sources, and append the outcome after the stage. Keep live cards, reconstructed cards, and retrospective backtests distinct.

Evaluate each team on:

- Current stage seed and opening matchup.
- Likely Swiss path at 1-0, 0-1, 2-0, 1-1, and 0-2.
- Recent LAN form and last 3-5 meaningful events.
- Prior stage performance, including record, round difference, maps won/lost, and BO3 quality.
- HLTV/VRS ranking and movement.
- Roster stability, new players, role changes, stand-ins, coaching changes, and player form.
- BO1 upset exposure for stages that include BO1.
- BO3 map-pool depth, veto weaknesses, permaban constraints, and likely map advantages.
- Regional/team matchup quirks, but only after hard data.

Bucket heuristics:

- `3-0`: strong opener, low upset risk, elite current form, deep BO3 map pool, no obvious veto hole, favorable likely 1-0 and 2-0 path.
- `3-1/3-2`: high advancement floor, enough map depth to recover, but likely to drop one match or face another elite team.
- `0-3`: weak opener plus weak recovery path against likely 0-1 and 0-2 opponents, shallow map pool, weak recent form, poor BO3 resilience.

Do not pick `0-3` from a hard opener alone. Do not put a top team in `3-1/3-2` if its most likely bucket is actually `3-0`.

## Playoff Prediction Method

Use [the joint playoff calculator](references/coin-math.md) after the eight teams, seed order, and matchup probabilities are verified. While Diamond is possible, maximize the probability of all three missions together. If not, maximize the chance of the remaining ticks required for Gold. A correct champion already implies a correct semifinal, but not a second correct quarterfinal. Do not multiply the three playoff mission probabilities as if they were independent.

Evaluate each playoff team on:

- BO3/BO5 map pool depth and veto edges.
- Current Major form, especially final Swiss-stage BO3 quality.
- Playoff LAN pressure, arena experience, and late-tournament history.
- Head-to-head and matchup-specific map vetoes.
- Star-player form and role stability.
- Bracket path difficulty and whether the likely champion path compounds risk.
- Upset risk from underdogs with elite map specialization.

Playoff heuristics:

- Prioritize quarterfinal picks where favorite strength and map veto edge align.
- Avoid building the whole bracket around one fragile upset unless the coin path still has two safer quarterfinals.
- Pick a champion with both ceiling and repeatable BO3/BO5 floor, not just the hottest Swiss-stage score.
- Treat a dominant Swiss `3-0` as a signal, not proof. Check opponent quality and map depth before making that team champion.

## Required Output Fields

Every prediction or audit must include pass-threshold math:

- `locked_correct`
- `locked_wrong`
- `pending_live`
- `minimum_needed_to_pass`
- `max_possible_correct`
- `status`: `pass`, `fail`, or `still alive`

Calculation:

- `minimum_needed_to_pass = max(0, 5 - locked_correct)`
- `locked_correct + pending_live` is an upper bound. Reduce it when picks cannot coexist due to a shared match or a full exact bucket.
- Before a stage, use the simulator's `openingScoreUpperBound` where supported. It removes impossible same-bucket opener pairs, but it is not a proven attainable score.
- `pass` if `locked_correct >= 5`
- `fail` if `max_possible_correct < 5`, or the stage is complete and `locked_correct < 5`
- `still alive` otherwise

Every prediction card must also include:

- Exact in-game buckets or playoff bracket picks.
- Confidence for each bucket: `high`, `medium`, or `low`.
- Alternates with the exact bucket they replace.
- Source timestamp.

## Output Modes

### Pre-Stage Swiss Card

Use when picks are not locked yet and the stage gate is satisfied.

```text
Source timestamp: <date/time/timezone>
Stage format: <Swiss format, BO1/BO3 detail>
Status: lockable

In-game card
3-0: <Team>, <Team>
3-1/3-2: <Team>, <Team>, <Team>, <Team>, <Team>, <Team>
0-3: <Team>, <Team>

Confidence
3-0: <high/medium/low with one-line reason>
3-1/3-2: <high/medium/low with one-line reason>
0-3: <high/medium/low with one-line reason>

Pass math
locked_correct: 0
locked_wrong: 0
pending_live: 10
minimum_needed_to_pass: 5
max_possible_correct: <openingScoreUpperBound, or tighter confirmed upper bound>
status: still alive

Why these buckets
<Short bucket-specific reasoning, not generic rankings.>

Alternates
<One or two swap options with the exact bucket they replace.>

Sources
<Links used.>
```

### Live-Stage Audit

Use when the user already placed picks and the stage is underway.

```text
Source timestamp: <date/time/timezone>
Stage status: <live / complete>

Card audit
Correct: <pick and exact result>
Wrong: <pick and exact result>
Pending: <pick, current record, next match/path>

Pass math
locked_correct: <number>
locked_wrong: <number>
pending_live: <number>
minimum_needed_to_pass: <number>
max_possible_correct: <number>
status: <pass/fail/still alive>

Path to pass
<Example: Need 3 of these 4 pending picks to hit: ...>

Mistake review
<Bucket-logic failures only: wrong 3-0, wrong middle bucket, bad 0-3, stale data, BO1 volatility, path misread.>

Sources
<Links used.>
```

### Post-Stage Review

Use after a stage is complete.

- List final score and pass/fail/good status.
- Identify exact bucket misses.
- Preserve useful lessons for the next stage.
- Do not reuse previous-stage conclusions blindly.

### Playoff Bracket

Use when Swiss stages are complete and playoff picks are not locked yet.

```text
Source timestamp: <date/time/timezone>
Stage format: <single elimination, QF/SF/GF BO3/BO5 detail>
Status: lockable

Playoff bracket
Quarterfinals:
- <Team> over <Team>
- <Team> over <Team>
- <Team> over <Team>
- <Team> over <Team>

Semifinals:
- <Team> over <Team>
- <Team> over <Team>

Champion:
- <Team>

Coin mission math
quarterfinal_needed: 2
semifinal_needed: 1
champion_needed: 1
status: still alive

Why this bracket
<Short matchup-specific reasoning.>

Alternates
<Risky and safer champion/bracket alternatives.>

Sources
<Links used.>
```

### Playoff Audit

Use when playoff picks are underway or complete.

```text
Source timestamp: <date/time/timezone>
Stage status: <live / complete>

Playoff audit
quarterfinal_correct: <number>/4
semifinal_correct: <number>/2
champion_correct: <yes/no/pending>

Mission status
quarterfinal mission: <pass/fail/still alive>
semifinal mission: <pass/fail/still alive>
champion mission: <pass/fail/still alive>
overall playoff status: <pass/fail/still alive>

Mistake review
<Bracket path, champion fragility, map veto miss, upset miss, stale data, etc.>

Sources
<Links used.>
```

## Blind Historical Testing

For backtests, use only information available before the stage locked.

Allowed:

- Final stage team list
- Opening matchups
- Rankings and team form available at the lock time
- Prior stage results if the prior stage was already complete
- Known rosters, stand-ins, map pools, and recent events available at that time

Not allowed:

- Final standings from the stage being predicted
- Later playoff results
- Later roster or form knowledge
- Hindsight explanations disguised as prediction logic

Report whether the test is truly blind or only pre-lock constrained.
