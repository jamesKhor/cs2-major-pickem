# PGL Singapore Major 2026

[Official schedule and bracket](https://www.pglesports.com/cs2/pgl-major-singapore-2026/) · [In-game Pick'Em challenge list mirrored by BLAST](https://blast.tv/major/pickems/)

## Stage 1

**Final pre-lock recommendation:** November 23, 2026 (UTC+8). **Result: pending.** The first matches begin November 24 at noon local time. Follow the in-game countdown; activate the pass and save all 10 slots ahead of lock for coin credit.

| Bucket | Final picks |
| --- | --- |
| 3-0 | 100 Thieves, HEROIC |
| 3-1 / 3-2 | PVISION, Liquid, Ninjas in Pyjamas, FaZe, Eternal Fire, M80 |
| 0-3 | Chinggis Warriors, Lynn Vision |

**Scoring:** At least five exact-bucket hits across all ten picks, with no minimum per bucket. Non-deciding matches are BO1; advancement and elimination matches are BO3. There is no same-event form available before Stage 1.

### Pre-lock check

The final refresh used the [Pinnacle snapshot](https://pinnradar.com/pinnacle-odds/esports), [HLTV rankings](https://www.hltv.org/events/9303/pgl-major-singapore-2026-stage-1), [recent team form](https://www.hltv.org/news/46015/visualized-every-team-at-pgl-major-singapore-stage-1) and projected vetoes. Compared over 1,200 candidate cards and measured the finalists in 180,000 held-out simulations across three model settings. These are model estimates, not calibrated live success rates.

| Tested card | Estimated chance of at least 5 hits |
| --- | ---: |
| Final card | 33.5% |
| Exchange HEROIC and PVISION between sweep and middle | 33.4% |
| Exchange HEROIC and FaZe between sweep and middle | 33.2% |
| Replace Lynn Vision with Wildcard at 0-3 | 33.0% |
| Rank-first baseline (PVISION and Liquid at 3-0) | 30.1% |

If all opening favorites win, the [Swiss pairing rules](https://github.com/ValveSoftware/counter-strike_rules_and_regs/blob/main/major-supplemental-rulebook.md#swiss-bracket) pair 100 Thieves and PVISION in Round 2, so they cannot both sweep in that branch. Lynn Vision's strongest concern is a [projected Dust2 opener against 9z](https://www.hltv.org/matches/2400495/9z-vs-lynn-vision-pgl-major-singapore-2026-stage-1). The same card led in checks using [ScoreMon](https://scoremon.com/counter-strike/pgl-major-singapore-2026) and [exchange prices](https://polynyx.com/esports/counter-strike/pgl-major-singapore-stage-1-2026), and when map adjustments were omitted or doubled.

Reproduce the main pre-lock comparison using the [frozen snapshot](stage-1-input.json) from the repository root:

```sh
node skills/cs2-major-pickem/scripts/swiss.mjs predictions/2026-pgl-singapore/stage-1-input.json 12000 60000
```

### Stage 1 results

Pending. Append the final records and exact hit count after the stage; do not change the picks above.

## Stage 2

Awaiting confirmed qualifiers and openers. Scheduled November 28 to December 1.

## Stage 3

Awaiting confirmed qualifiers and openers. Scheduled December 2 to 6 (all BO3).

## Playoffs

Awaiting the final bracket. Scheduled December 10 to 13. Check the in-game bracket before deciding whether any third-place match counts toward Pick'Em.
