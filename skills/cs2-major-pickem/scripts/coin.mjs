const inRange = (value, max) => Number.isInteger(value) && value >= 0 && value <= max;
const isProbability = p => Number.isFinite(p) && p >= 0 && p <= 1;
const seedOrder = [1, 8, 4, 5, 2, 7, 3, 6];
const feederPairs = [[0, 1], [2, 3], [4, 5]];

export function coinOdds(paths) {
  const byTicks = Array(12).fill(0);
  let total = 0;
  for (const { participation, swissPasses, playoffMissions, probability } of paths) {
    if (!inRange(participation, 5) || !inRange(swissPasses, 3) || !inRange(playoffMissions, 3)) {
      throw Error('Invalid participation, Swiss, or playoff mission count');
    }
    if (!isProbability(probability)) throw Error('Each path needs a probability from 0 to 1');
    byTicks[participation + swissPasses + playoffMissions] += probability;
    total += probability;
  }
  if (Math.abs(total - 1) > 1e-9) throw Error('Joint path probabilities must sum to 1');
  const sum = (start, end) => byTicks.slice(start, end).reduce((a, b) => a + b, 0) / total;
  return { byTicks: byTicks.map(p => p / total), bronze: sum(1, 4), silver: sum(4, 8),
    gold: sum(8, 11), diamond: sum(11, 12), goldOrBetter: sum(8, 12) };
}

function matchup(seeds, picks, match) {
  return match < 4 ? seedOrder.slice(2 * match, 2 * match + 2).map(seed => seeds[seed - 1])
    : feederPairs[match - 4].map(i => picks[i]);
}

function validateSeeds(seeds) {
  if (!Array.isArray(seeds) || seeds.length !== 8 || new Set(seeds).size !== 8 ||
      !Array.from(seeds).every(t => (typeof t === 'string' && t.trim()) || Number.isSafeInteger(t))) {
    throw Error('Expected eight distinct teams in seed order');
  }
}

function validatePicks(picks, seeds) {
  if (!Array.isArray(picks) || picks.length !== 7 ||
      Array.from({ length: 7 }, (_, i) => i).some(i => !matchup(seeds, picks, i).includes(picks[i]))) {
    throw Error('Expected seven consistent bracket winners in quarterfinal, semifinal, final order');
  }
}

function scoreMissions(predicted, actual) {
  const hits = predicted.map((p, i) => p === actual[i]);
  const quarterfinals = hits.slice(0, 4).filter(Boolean).length;
  const semifinals = hits.slice(4, 6).filter(Boolean).length;
  const champion = hits[6];
  return { quarterfinals, semifinals, champion,
    missions: Number(quarterfinals >= 2) + Number(semifinals >= 1) + Number(champion) };
}

export function scorePlayoffCard(predicted, actual, seeds = [1, 2, 3, 4, 5, 6, 7, 8]) {
  validateSeeds(seeds);
  validatePicks(predicted, seeds);
  validatePicks(actual, seeds);
  return scoreMissions(predicted, actual);
}

export function rankPlayoffBrackets(seeds, winProbability, { participation, swissPasses }) {
  validateSeeds(seeds);
  if (!inRange(participation, 5) || !inRange(swissPasses, 3)) throw Error('Invalid coin state');
  const outcomes = [];
  const probabilities = new Map();
  function visit(picks, weight) {
    const i = picks.length;
    if (i === 7) {
      outcomes.push({ picks, probability: weight });
      return;
    }
    const [a, b] = matchup(seeds, picks, i);
    const round = i < 4 ? 'quarterfinal' : i < 6 ? 'semifinal' : 'final';
    const key = JSON.stringify([a, b, round]);
    if (!probabilities.has(key)) {
      const p = winProbability(a, b, round);
      if (!isProbability(p)) throw Error(`Invalid win probability for ${a} vs ${b} (${round})`);
      probabilities.set(key, p);
    }
    const p = probabilities.get(key);
    visit([...picks, a], weight * p);
    visit([...picks, b], weight * (1 - p));
  }
  visit([], 1);

  // The same 128 consistent paths are the possible outcomes and legal cards.
  return outcomes.map(({ picks }) => {
    const paths = outcomes.map(outcome => ({ participation, swissPasses,
      playoffMissions: scoreMissions(picks, outcome.picks).missions, probability: outcome.probability }));
    return { picks, ...coinOdds(paths),
      expectedMissions: paths.reduce((sum, path) => sum + path.playoffMissions * path.probability, 0) };
  }).sort((a, b) => {
    for (const field of ['diamond', 'goldOrBetter', 'expectedMissions']) {
      const diff = b[field] - a[field];
      if (Math.abs(diff) > 1e-12) return diff;
    }
    return 0;
  });
}
