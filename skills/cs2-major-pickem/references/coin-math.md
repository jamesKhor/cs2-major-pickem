# Coin And Playoff Math

Verify the event's in-game challenge list and original playoff bracket first.
This helper uses the Singapore 2026-style 11-challenge scoring and Valve's
eight-team bracket: 1 vs 8 and 4 vs 5 on one side, 2 vs 7 and 3 vs 6 on the
other. It excludes the third-place match. Adapt the rules first if an event
differs. [Challenge list](https://blast.tv/major/pickems/) and
[Valve bracket rules](https://github.com/ValveSoftware/counter-strike_rules_and_regs/blob/main/major-supplemental-rulebook.md#single-elimination-bracket).

## Count And Score

`coinOdds(paths)` in `scripts/coin.mjs` accepts **joint** outcomes already
weighted by probability. Each row has `participation` (0-5), `swissPasses`
(0-3), `playoffMissions` (0-3), and `probability` (0-1). Weights must sum to 1.
When some missions are settled, condition the input on the observed outcomes.
Do not put an impossible future accuracy tick into a path where that card was
not eligible. Include only actual and explicitly assumed participation ticks.
Returns a tick distribution and separate Gold, Diamond, and Gold-or-better
probabilities. It does not estimate any missing match probabilities.

`scorePlayoffCard(picks, actual, seeds)` takes two seven-winner arrays and the
eight teams in verified seed order. The winners must be in bracket order:
four quarterfinals, two semifinals, then the champion. It counts correct
matches and separate missions (`>=2`, `>=1`, exact champion). It rejects a team
picked to win a round it cannot reach on that card.

## Rank Brackets

Call `rankPlayoffBrackets(seeds, winProbability, { participation, swissPasses })`
once the eight teams and bracket are final. `winProbability(a, b, round)`
returns the estimated chance of `a` beating `b` for that matchup and round.
Gather current match odds, current Major form, and veto context; use the actual
BO3 or BO5 format. For possible later draws without a line, explain how the
matchup probability was estimated. The function does not ingest odds or
estimate strength for you. `participation` includes the playoff submission tick
only if the forecast assumes the full bracket will be saved before lock.

The helper compares all 128 valid cards against the same 128 possible result
paths. It weights each match by the teams that actually meet on that path.
Sort by Diamond probability, then Gold-or-better probability, then expected
playoff missions. If Diamond is dead, all candidates have zero Diamond chance
and Gold becomes the deciding objective. The results are exact **for the
supplied matchup probabilities**, not verified live odds. In a consistent
bracket, a correct champion also gives a semifinal hit, but does not guarantee
two correct quarterfinals.
