import assert from 'node:assert/strict';
import test from 'node:test';
import { coinOdds, rankPlayoffBrackets, scorePlayoffCard } from './coin.mjs';

const path = (participation, swissPasses, playoffMissions, probability = 1) => ({
  participation, swissPasses, playoffMissions, probability,
});

test('coin thresholds distinguish Gold from Gold-or-better', () => {
  assert.equal(coinOdds([path(5, 1, 2)]).gold, 1); // Cologne path
  assert.equal(coinOdds([path(5, 0, 3)]).gold, 1);
  assert.equal(coinOdds([path(5, 0, 2)]).goldOrBetter, 0);
  assert.equal(coinOdds([path(4, 3, 3)]).diamond, 0);
  const perfect = coinOdds([path(5, 3, 3)]);
  assert.deepEqual([perfect.gold, perfect.goldOrBetter, perfect.diamond], [0, 1, 1]);
});

test('use joint paths, not products of unconditional probabilities', () => {
  const result = coinOdds([path(5, 3, 0, 0.5), path(5, 0, 3, 0.5)]);
  assert.deepEqual([result.gold, result.diamond], [1, 0]);
  assert.throws(() => coinOdds([path(5, 3, 3, 0.5)]), /probabilit/i);
});

test('getting the champion and a semifinal right does not imply the quarterfinal mission', () => {
  const predicted = [1, 4, 2, 3, 1, 2, 1];
  const actual = [1, 5, 7, 6, 1, 7, 1];
  assert.deepEqual(scorePlayoffCard(predicted, actual), { quarterfinals: 1, semifinals: 1, champion: true, missions: 2 });
  assert.throws(() => scorePlayoffCard([1, 4, 2, 3, 8, 2, 8], actual), /bracket/i);
});

test('all 128 playoff brackets are compared, with exact coin odds for even matches', () => {
  const teams = Array.from({ length: 8 }, (_, i) => `Seed ${i + 1}`);
  const cards = rankPlayoffBrackets(teams, () => 0.5, { participation: 5, swissPasses: 3 });
  assert.equal(cards.length, 128);
  assert.equal(new Set(cards.map(c => c.picks.join('/'))).size, 128);
  assert.deepEqual([cards[0].diamond, cards[0].gold, cards[0].goldOrBetter], [7 / 64, 57 / 64, 1]);
  const allSwissMissed = rankPlayoffBrackets(teams, () => 0.5, { participation: 5, swissPasses: 0 });
  assert.deepEqual([allSwissMissed[0].diamond, allSwissMissed[0].gold], [0, 7 / 64]);
  assert.throws(() => rankPlayoffBrackets(teams, () => NaN, { participation: 5, swissPasses: 3 }), /probabilit/i);
});

test('the best Diamond bracket can differ from the best Gold fallback', () => {
  const seeds = [1, 2, 3, 4, 5, 6, 7, 8];
  // Seed 7 has a tough opener but is unbeatable in later rounds of this fixture.
  const winProbability = (a, b, round) => {
    if (round === 'quarterfinal') return 0.6;
    if (a === 7) return 1;
    if (b === 7) return 0;
    return 0.5;
  };
  const [diamond] = rankPlayoffBrackets(seeds, winProbability, { participation: 5, swissPasses: 3 });
  const goldCards = rankPlayoffBrackets(seeds, winProbability, { participation: 5, swissPasses: 2 });
  const sameCard = goldCards.find(c => c.picks.every((pick, i) => pick === diamond.picks[i]));
  assert.equal(diamond.picks[6], 7);
  assert.ok(Math.abs(diamond.diamond - 0.4 * (1 - 0.4 ** 3)) < 1e-12);
  assert.equal(goldCards[0].picks[2], 2);
  assert.ok(goldCards[0].goldOrBetter > sameCard.goldOrBetter);
});
