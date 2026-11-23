# Reproducible Swiss forecast

1. Verify the event's format, seed order, confirmed openers, actual in-game lock,
   and challenge text. The bundled simulator handles the Valve 16-team Swiss
   layout with 1 vs 9 through 8 vs 16 openers, Buchholz reseeding, rematch
   avoidance, and either mixed BO1/BO3 or all BO3. If the event varies, verify
   the difference before using the simulator. Do not run it for playoffs.
2. Save a dated, pre-lock input file, with source links. Record separate HLTV and
   VRS ranks, date and source for both prices in every opener, actual rosters,
   recent LAN evidence, prior same-Major maps/results when applicable, and the
   likely veto. Do not use results from the stage being forecast. Record the
   exact submitted card separately; user-confirmed picks outrank logo reads
   and recommendations. On review, score the original card before any swaps.
3. Run `node scripts/swiss.mjs <input.json> [training draws per scenario]
   [evaluation draws per scenario]` from the skill folder. Use the same draws
   for every card within a scenario. Use a meaningful rank-first baseline, plus
   plausible form/odds variants. Describe meaningful differences only. Store
   the primary recommendation and any close alternate before the actual lock.
4. Score the locked card with official final records and note which misses
   were true team errors and which were bucket errors. Separate actual scores,
   hindsight what-ifs and sealed validation. Historical results known when
   picks were generated are not blind tests, even if citations are pre-lock.

## Inputs And Limits

- `teams`: exactly 16 in initial seed order. Provide `name`, `hltv`, `vrs` and,
  where supported, a modest `form` adjustment in log-odds units. Start at zero.
  Document any change; don't convert small samples or raw map win rates into
  large advantages. Don't count the same evidence in both form and the veto.
- `openers`: eight pairs of decimal match odds, ordered by higher seed 1-8,
  each with the higher seed's price first. These are converted to two-sided
  no-vig estimates. Use the relevant series length. Do not substitute fan
  votes for odds. `allBo3` selects the stage format.
- Optional `vetoLogit`: eight small opener adjustments, in the same order, for
  map-related evidence not already reflected in the odds. Unknown future
  vetoes are not known inputs and can change the card ordering.
- `scenarios`: named settings with `marketWeight`, `formWeight`, `bo3Scale`,
  `teamNoise` and `strengthScale`. Keep at least a balanced, form-heavy and
  odds/rank-heavy model; do not fit parameters to the outcomes being scored.
  `cards` can contain named baseline or comparison cards, each with ordered
  arrays for the sweep, middle and winless buckets.

The score distribution comes from whole simulated stages. Team strength uses
rank priors, bounded scouting adjustments and partially transferable opener
evidence; BO3 favors stronger teams more than BO1. There is a shared form draw
per team per stage, so match probabilities are not wholly independent. Later
opponents are simulated, not priced or vetoed in advance. The search considers
strong candidate extreme pairs and local swaps, not all valid cards. Held-out
draws check sampling noise, not the correctness of the probability model.
Treat tiny pass-rate differences as ties, and use sensitivity to select one
card. A candidate with a higher mean is not necessarily more likely to pass.

## Audit And Progression

- Immediately after each stage, confirm the next field, seeded openers, and
  deadline, then rerun with those inputs. Stage 1 uses pre-Major LAN form.
  For Stages 2-3, compare advancing teams' same-event BO3s and opponent quality
  to direct invites' recent LAN form; never compare raw win counts alone.
- Treat the `3-0` pair as a pair: check who would meet at 1-0 under a plausible
  opener slate and how often each can survive to 2-0. Test `0-3` pairs against
  the actual 0-1 and 0-2 opponent pools, not just the original favorites.
- Track both submission and accuracy challenges. With the usual Gold-at-8
  rules, activation and four on-time full submissions would give five
  challenges; any three of the six accuracy challenges then earn Gold. Confirm
  in-game. A failed Swiss accuracy challenge does not block the next stage.
- For playoffs, verify which matches count in-game. A new third-place match
  on the schedule does not by itself add a prediction or challenge.
