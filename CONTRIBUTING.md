# Contributing

Use [GitHub Issues](https://github.com/jamesKhor/cs2-major-pickem/issues/new) for feature requests, rule changes, and bugs. Include the Major and stage, what you expected, what happened, and a link to the rules, results, or pre-lock evidence. Please do not post Steam auth codes, private account details, or unredacted screenshots.

## Pull Requests

Use a pull request for every change to `main`, including solo maintenance, documentation, and prediction records. The PR is the record of what changed and why.

1. Start a branch from the latest `main` for one focused change. Maintainers can push the branch here; external contributors can use a fork.
2. For rule changes, link the relevant organizer or in-game evidence. For a forecast change, compare both cards on the same pre-lock data and report the estimate of reaching 5/10, not just the average number correct.
3. Add or update a test for changes to scoring or Swiss pairing. Run the checks below.
4. Push the branch and open a pull request against `main`. Summarize the change and the checks you ran. For prediction changes, say which Major, stage, and published picks are affected.
5. When ready to land the change, merge the PR on GitHub. Do not push the commit directly to `main`.

```sh
node --test skills/cs2-major-pickem/scripts/swiss.test.mjs skills/cs2-major-pickem/scripts/coin.test.mjs
node skills/cs2-major-pickem/scripts/swiss.mjs predictions/2026-pgl-singapore/stage-1-input.json 12000 60000
```

## Prediction And Results PRs

- Label cards as **pre-lock**, **recovered**, or **retrospective**. Include the date and timezone, exact picks, and your sources. Leave unknown future stages pending.
- After the results, append the exact bucket outcomes, score, and pass/fail. Never replace a published pick with the team that ended up winning. Leave counterfactuals clearly labeled.
- If you correct a factual error in an archive entry, describe it in the PR and retain the original forecast where it matters for scoring. Update the archive index and README summary so they agree.
- Treat simulated pass percentages as model estimates. Do not label a hindsight exercise as a blind or live test.
