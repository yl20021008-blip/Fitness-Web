import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext, Script } from "node:vm";

const root = new URL("../", import.meta.url);
const source = readFileSync(new URL("../ui/data.js", import.meta.url), "utf8");
const ctx = { window: {} };
runInNewContext(source, ctx);
const DATA = ctx.window.FITPERSONA;

test("questionnaire has four well-defined binary axes and 20 questions", () => {
  assert.equal(DATA.questions.length, 20);
  assert.equal(DATA.pairs.length, 4);
  const axes = new Set(DATA.pairs.flatMap(pair => Array.from(pair)));
  assert.equal(axes.size, 8);
  assert.equal(DATA.questions.every(q => q.a.length === 4), true);
  for (const q of DATA.questions) {
    assert.ok(q.q.trim());
    for (const option of q.a) {
      assert.ok(option.t.trim());
      for (const [key, weight] of Object.entries(option.s)) {
        assert.equal(axes.has(key), true);
        assert.equal(Number.isFinite(weight) && weight >= 0, true);
      }
    }
  }
});

test("all sixteen four-axis combinations have valid result descriptions", () => {
  const combos = DATA.pairs.reduce((acc, pair) =>
    acc.flatMap(prefix => Array.from(pair).map(symbol => prefix + symbol)), [""]
  );
  assert.equal(combos.length, 16);
  assert.equal(Object.keys(DATA.personas).length, 16);
  for (const code of combos) {
    const result = DATA.personas[code];
    assert.ok(result, code);
    assert.ok(result.name && result.summary && result.advice, code);
    assert.equal(result.daily.length, 3, code);
  }
});

test("questionnaire score inputs are bounded and produce valid types", () => {
  for (let choice = 0; choice < 4; choice++) {
    const scores = Object.fromEntries(DATA.pairs.flatMap(p => Array.from(p)).map(x => [x, 0]));
    for (const question of DATA.questions) {
      for (const [k, v] of Object.entries(question.a[choice].s)) scores[k] += v;
    }
    const code = DATA.pairs.map(([a, b]) => scores[a] >= scores[b] ? a : b).join("");
    assert.ok(DATA.personas[code], code);
  }
});

test("frontend code parses and explicitly defaults to local-only storage", () => {
  const source = readFileSync(new URL("../ui/app.js", import.meta.url), "utf8");
  assert.doesNotThrow(() => new Script(source, { filename: "ui/app.js" }));
  assert.match(source, /consent:\s*false/);
  assert.match(source, /test_run_id/);
  assert.match(source, /function taskKey\(/);
  assert.doesNotMatch(source, /user_agent:\s*navigator\.userAgent/);
});

test("database includes opt-in insert policy", () => {
  const source = readFileSync(new URL("../sql/supabase_schema.sql", import.meta.url), "utf8");
  assert.match(source, /with check \(consent is true\)/);
  assert.match(source, /alter column consent set default false/);
});
