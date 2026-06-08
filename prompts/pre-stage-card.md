# Pre-Stage Card Prompt

```text
Use the cs2-major-pickem skill.

Create a pre-lock Pick'Em card for:
Major: <major name>
Stage: <stage name>

Rules:
- Verify live/current sources first.
- Do not use stale memory alone.
- Confirm team list, opening matchups, BO1/BO3 format, prior qualifiers, and lock status.
- Optimize first for at least 5 correct.
- Chase 6+ only when it does not materially reduce the 5-correct floor.
- Separate team quality from exact bucket probability.

Return:
- Source timestamp
- 3-0 picks
- 3-1/3-2 picks
- 0-3 picks
- Confidence by bucket
- Alternates with exact replacements
- Pass math
- Sources
```
