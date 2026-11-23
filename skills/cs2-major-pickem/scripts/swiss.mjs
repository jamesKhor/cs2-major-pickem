import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const sizes = [2, 6, 2];
const indices = Array.from({ length: 16 }, (_, i) => i);
const pop = new Uint8Array(1 << 16);
for (let i = 1; i < pop.length; i++) pop[i] = pop[i >>> 1] + (i & 1);
const latePairs = [
  '162534', '162435', '152634', '152436', '142635', '142536', '162345', '152346',
  '132645', '132546', '142356', '132456', '123645', '123546', '123456',
].map(r => r.match(/../g).map(p => [...p].map(n => Number(n) - 1)));

export function difficultyOrder(group, opponents, differential) {
  const points = Object.fromEntries(group.map(t => [t, opponents[t].reduce((s, o) => s + differential[o], 0)]));
  return group.sort((a, b) => points[b] - points[a] || a - b);
}

export function pairGroup(group, played, late) {
  const rematch = (a, b) => Boolean(played[a] & (1 << b));
  if (late) {
    const table = latePairs.map(row => row.map(([a, b]) => [group[a], group[b]]));
    return table.find(row => row.every(([a, b]) => !rematch(a, b))) ?? table[0];
  }
  function match(remaining) {
    if (!remaining.length) return [];
    const [a, ...rest] = remaining;
    for (let i = rest.length - 1; i >= 0; i--) {
      const b = rest[i];
      if (rematch(a, b)) continue;
      const tail = match(rest.filter(t => t !== b));
      if (tail) return [[a, b], ...tail];
    }
    return null;
  }
  return match(group) ?? group.slice(0, group.length / 2).map((a, i) => [a, group.at(-1 - i)]);
}

export function playStage(win, allBo3 = false) {
  const w = Array(16).fill(0), l = Array(16).fill(0), played = Array(16).fill(0);
  const opponents = indices.map(() => []);
  for (let r = 0; r < 5; r++) {
    const groups = new Map();
    const diff = w.map((v, i) => v - l[i]);
    let games = [];
    if (r === 0) games = indices.slice(0, 8).map(a => [a, a + 8]);
    else {
      for (const a of indices) {
        if (w[a] === 3 || l[a] === 3) continue;
        const group = groups.get(w[a]) ?? [];
        group.push(a);
        groups.set(w[a], group);
      }
      for (const group of groups.values()) {
        games.push(...pairGroup(difficultyOrder(group, opponents, diff), played, r >= 3));
      }
    }
    for (const [a, b] of games) {
      const bo3 = allBo3 || w[a] === 2 || l[a] === 2;
      const aWins = win(a, b, bo3, r);
      w[aWins ? a : b]++;
      l[aWins ? b : a]++;
      played[a] |= 1 << b;
      played[b] |= 1 << a;
      opponents[a].push(b);
      opponents[b].push(a);
    }
  }
  const buckets = [0, 0, 0];
  for (const t of indices) {
    const k = w[t] === 3 ? Number(l[t] > 0) : w[t] === 0 ? 2 : -1;
    if (k >= 0) buckets[k] |= 1 << t;
  }
  return buckets;
}

export function toCard(teams, buckets) {
  if (buckets.length !== 3 || buckets.some((b, i) => b.length !== sizes[i])) throw Error('Expected 2/6/2 picks');
  const seen = new Set();
  return buckets.map(bucket => bucket.reduce((mask, name) => {
    const t = teams.indexOf(name);
    if (t < 0 || seen.has(t)) throw Error(`Unknown or duplicate pick: ${name}`);
    seen.add(t);
    return mask | (1 << t);
  }, 0));
}

export function score([a, b, c], [x, y, z]) {
  return pop[a & x] + pop[b & y] + pop[c & z];
}

const sigmoid = x => 1 / (1 + Math.exp(-x));
const logit = p => Math.log(p / (1 - p));

function rng(seed) {
  return () => {
    seed = (seed + 0x6D2B79F5) | 0;
    let x = Math.imul(seed ^ seed >>> 15, seed | 1);
    x ^= x + Math.imul(x ^ x >>> 7, x | 61);
    return ((x ^ x >>> 14) >>> 0) / 4294967296;
  };
}

function simulate(input, scenario, count, seed) {
  const random = rng(seed);
  const { marketWeight, formWeight, bo3Scale, teamNoise, strengthScale } = scenario;
  const power = input.teams.map(({ hltv, vrs, form = 0 }) =>
    -0.72 * strengthScale * Math.log(Math.sqrt(hltv * vrs) / 25) + formWeight * form);
  const opener = input.openers.map(([a, b]) => logit(b / (a + b)));
  const openScale = input.allBo3 ? bo3Scale : 1;
  // Shrink opener residuals before transferring them to later opponents.
  for (let t = 0; t < 8; t++) {
    const change = marketWeight * (opener[t] / openScale - (power[t] - power[t + 8])) * 0.25;
    power[t] += change;
    power[t + 8] -= change;
  }
  const output = new Uint16Array(3 * count);
  for (let i = 0; i < count; i++) {
    const drift = indices.map(() => teamNoise * (random() + random() + random() + random() - 2) * Math.sqrt(3));
    const buckets = playStage((a, b, bo3, round) => {
      const scale = bo3 ? bo3Scale : 1;
      const raw = (power[a] - power[b]) * scale;
      const base = round === 0
        ? raw * (1 - marketWeight) + opener[a] * marketWeight + (input.vetoLogit?.[a] ?? 0) * formWeight
        : raw;
      return random() < sigmoid(base + scale * (drift[a] - drift[b]));
    }, input.allBo3);
    output.set(buckets, 3 * i);
  }
  return output;
}

function rates(trials) {
  const counts = sizes.map(() => indices.map(() => 0));
  for (let i = 0; i < trials.length; i++) {
    let mask = trials[i];
    while (mask) {
      const bit = mask & -mask;
      counts[i % 3][31 - Math.clz32(bit)]++;
      mask ^= bit;
    }
  }
  return counts.map(row => row.map(n => n / (trials.length / 3)));
}

function evaluate([a, b, c], trials, details = false) {
  let passes = 0, sum = 0, doubleSlide = 0, slidePass = 0, doubleFail = 0, failPass = 0;
  const histogram = Array(11).fill(0);
  for (let i = 0; i < trials.length; i += 3) {
    const sweeps = pop[a & trials[i]];
    const total = sweeps + pop[b & trials[i + 1]] + pop[c & trials[i + 2]];
    passes += total >= 5;
    sum += total;
    if (!details) continue;
    histogram[total]++;
    if (!sweeps) {
      doubleFail++;
      failPass += total >= 5;
    }
    if ((a & trials[i + 1]) === a) {
      doubleSlide++;
      slidePass += total >= 5;
    }
  }
  const n = trials.length / 3;
  return { pass: passes / n, mean: sum / n, ...(details && { histogram,
    doubleSlide: doubleSlide / n, passGivenDoubleSlide: doubleSlide ? slidePass / doubleSlide : null,
    doubleFail: doubleFail / n, passGivenDoubleFail: doubleFail ? failPass / doubleFail : null }) };
}

const cmp = (a, b) => b.pass - a.pass || b.mean - a.mean;
const maskOf = ts => ts.reduce((m, t) => m | (1 << t), 0);
const top = (row, n, excluded = 0) => indices.filter(t => !(excluded & (1 << t)))
  .sort((a, b) => row[b] - row[a]).slice(0, n);

function candidates(trials, initial, rankingSets = [rates(trials)]) {
  const seen = new Map();
  const add = card => {
    const key = card.join('/');
    if (!seen.has(key)) seen.set(key, { card, ...evaluate(card, trials) });
    return seen.get(key);
  };
  for (const c of initial) add(c);
  for (const [hi, mid, lo] of rankingSets) {
    const highs = top(hi, 7), lows = top(lo, 7);
    for (const [i, h] of highs.entries()) for (const j of highs.slice(i + 1)) {
      const a = maskOf([h, j]);
      for (const [k, p] of lows.entries()) for (const q of lows.slice(k + 1)) {
        const c = maskOf([p, q]);
        if (!(a & c)) add([a, maskOf(top(mid, 6, a | c)), c]);
      }
    }
  }
  const starts = [...seen.values()].sort(cmp).slice(0, 12);
  for (let best of starts) {
    for (let step = 0; step < 12; step++) {
      const [a, b, c] = best.card;
      const buckets = [a, b, c, 65535 ^ (a | b | c)];
      const groups = buckets.map(m => indices.filter(t => m & (1 << t)));
      let next = best;
      for (let x = 0; x < 3; x++) for (let y = x + 1; y < 4; y++) {
        for (const i of groups[x]) for (const j of groups[y]) {
          const swap = (1 << i) | (1 << j);
          const card = buckets.map((m, k) => k === x || k === y ? m ^ swap : m).slice(0, 3);
          const result = add(card);
          if (cmp(result, next) < 0) next = result;
        }
      }
      if (next === best) break;
      best = next;
    }
  }
  return [...seen.values()].sort(cmp);
}

function join(trials) {
  const union = new Uint16Array(trials.reduce((n, t) => n + t.length, 0));
  let offset = 0;
  for (const t of trials) {
    union.set(t, offset);
    offset += t.length;
  }
  return union;
}

export function forecast(input, nTrain = 4500, nTest = 25000) {
  const names = input.teams.map(t => t.name);
  const validDecimal = x => Number.isFinite(x) && x > 1;
  if (names.length !== 16 || new Set(names).size !== 16 || input.openers.length !== 8 ||
      !input.openers.every(o => o.length === 2 && o.every(validDecimal)) ||
      !input.teams.every(t => t.hltv > 0 && t.vrs > 0) || !input.scenarios.length) {
    throw Error('Need 16 distinct seeded teams with rankings, eight two-sided prices, and scenarios');
  }
  const named = Object.entries(input.cards ?? {}).map(([label, card]) => [label, toCard(names, card)]);
  const training = input.scenarios.map((s, i) => simulate(input, s, nTrain, 45147 + i * 371));
  const pooled = join(training);
  const trainingRates = training.map(rates);
  const variants = training.map((t, i) => candidates(t, named.map(([, c]) => c), [trainingRates[i]])[0].card);
  const search = candidates(pooled, [...named.map(([, c]) => c), ...variants], [rates(pooled), ...trainingRates]);
  const testing = input.scenarios.map((s, i) => simulate(input, s, nTest, 902681 + i * 971));
  const heldOut = join(testing);
  const render = (label, card) => ({ label, card: card.map(m => names.filter((_, i) => m & (1 << i))),
    ...evaluate(card, heldOut, true), byScenario: Object.fromEntries(testing.map((t, i) =>
      [input.scenarios[i].name, evaluate(card, t).pass])) });
  const testRates = rates(heldOut);
  return { searchCount: search.length, trials: heldOut.length / 3,
    bucketRates: names.map((name, i) => [name, ...testRates.map(r => r[i])]),
    cards: [...search.slice(0, 8).map(({ card }, i) => render(`pooled search #${i + 1}`, card)),
      ...variants.map((card, i) => render(input.scenarios[i].name, card)),
      ...named.map(([label, card]) => render(label, card))] };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const input = JSON.parse(readFileSync(process.argv[2], 'utf8'));
  console.log(JSON.stringify(forecast(input, Number(process.argv[3]) || undefined, Number(process.argv[4]) || undefined), null, 2));
}
