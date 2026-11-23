# Contributing

Use [GitHub Issues](https://github.com/jamesKhor/cs2-major-pickem/issues/new) for feature requests, rule changes, and bugs. Include the Major and stage, what you expected, what happened, and a link to the rules, results, or pre-lock evidence. Please do not post Steam auth codes, private account details, or unredacted screenshots.

## Pull Requests

1. Fork the repo and make a branch for one focused change.
2. For rule changes, link the relevant organizer or in-game evidence. For a forecast change, compare both cards on the same pre-lock data and report the estimate of reaching 5/10, not just the average number correct.
3. Add or update a test for changes to scoring or Swiss pairing. Run the checks below.
4. Open a pull request explaining what changed, why, and what you verified.

```sh
node --test skills/cs2-major-pickem/scripts/swiss.test.mjs skills/cs2-major-pickem/scripts/coin.test.mjs
node skills/cs2-major-pickem/scripts/swiss.mjs predictions/2026-pgl-singapore/stage-1-input.json 12000 60000
```

## Prediction And Results PRs

- Label cards as **pre-lock**, **recovered**, or **retrospective**. Include the date and timezone, exact picks, and your sources. Leave unknown future stages pending.
- After the results, append the exact bucket outcomes, score, and pass/fail. Never replace a published pick with the team that ended up winning. Leave counterfactuals clearly labeled.
- If you correct a factual error in an archive entry, describe it in the PR and retain the original forecast where it matters for scoring. Update the archive index and README summary so they agree.
- Treat simulated pass percentages as model estimates. Do not label a hindsight exercise as a blind or live test.
