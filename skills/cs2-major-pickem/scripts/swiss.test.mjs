import assert from 'node:assert/strict';
import test from 'node:test';
import { difficultyOrder, pairGroup, playStage, score, toCard } from './swiss.mjs';

test('Buchholz orders teams before initial seed', () => {
  const opponents = Array.from({ length: 16 }, () => []);
  opponents[0] = [4, 5];
  opponents[1] = [6, 7];
  const differential = [0, 0, 0, 0, -2, 0, 2, 0];
  assert.deepEqual(difficultyOrder([0, 1], opponents, differential), [1, 0]);
});

test('Swiss groups avoid rematches and respect the late-round priority table', () => {
  const played = Array(16).fill(0);
  played[0] = 1 << 5;
  played[5] = 1;
  assert.deepEqual(pairGroup([0, 1, 2, 3], played, false), [[0, 3], [1, 2]]);
  assert.deepEqual(pairGroup([0, 1, 2, 3, 4, 5], played, true), [[0, 4], [1, 5], [2, 3]]);
});

test('a full stage has 33 games, correct series types, and exact bucket counts', () => {
  for (const allBo3 of [false, true]) {
    let draws = 0;
    const matches = [];
    const result = playStage((a, b, bo3) => {
      matches.push(bo3);
      return (a + b + draws++) % 3 !== 1;
    }, allBo3);
    assert.equal(draws, 33);
    assert.equal(matches.filter(Boolean).length, allBo3 ? 33 : 13);
    assert.equal(score(result, result), 10);
    assert.deepEqual(result.map(mask => mask.toString(2).replaceAll('0', '').length), [2, 6, 2]);
  }
});

test('all opener favorites winning produces the expected 1-0 and 0-1 pairs', () => {
  const second = [];
  playStage((a, b, bo3, round) => {
    if (round === 1) second.push([a + 1, b + 1]);
    return true;
  });
  assert.deepEqual(second, [[1, 8], [2, 7], [3, 6], [4, 5], [9, 16], [10, 15], [11, 14], [12, 13]]);
});

test('both missed sweeps taking middle slots cap middle hits at four', () => {
  const card = [0b0000000011, 0b0011111100, 0b1100000000];
  const actual = [0b0011000000, 0b0000111111, 0b1100000000];
  assert.equal(score(card, actual), 6);
  assert.equal(score(card, [actual[0], actual[1], 0b110000000000]), 4);
});

test('Cologne Stage 3 wrong-bucket advancers do not score', () => {
  const teams = ['Vitality', 'NAVI', 'Spirit', 'Falcons', 'FURIA', 'Aurora', 'MOUZ', 'MongolZ',
    'Monte', 'B8', 'PVISION', 'G2', '9z', 'BetBoom', 'FUT', 'Legacy'];
  const forecast = toCard(teams, [['Vitality', 'NAVI'], ['Spirit', 'Falcons', 'FURIA', 'Aurora', 'MOUZ', 'MongolZ'], ['Monte', 'B8']]);
  const actual = toCard(teams, [['Spirit', 'FURIA'], ['Vitality', 'Falcons', 'Aurora', 'G2', '9z', 'BetBoom'], ['PVISION', 'B8']]);
  assert.equal(score(forecast, actual), 3);
  assert.throws(() => toCard(teams, [['Spirit', 'NAVI'], ['Spirit', 'Falcons', 'FURIA', 'Aurora', 'MOUZ', 'MongolZ'], ['Monte', 'B8']]));
});
