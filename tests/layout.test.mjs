import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { preparePitchDeck } from "../lib/paginate.ts";

const source = JSON.parse(readFileSync(new URL("../examples/stress-deck.json", import.meta.url), "utf8"));

test("the authored copy is identical to the captured before version", () => {
  const before = JSON.parse(readFileSync(new URL("../examples/stress-before.json", import.meta.url), "utf8"));
  const withoutNewAction = source.map(({ action, ...slide }) => slide);
  assert.deepEqual(withoutNewAction, before);
  assert.equal(source.at(-1).action.href, "/review/compare.html");
});

test("all original cards and table rows survive pagination, in order", () => {
  const pages = preparePitchDeck(source);
  source.forEach((slide, sourceIndex) => {
    const matches = pages.filter(page => page.sourceIndex === sourceIndex);
    assert.ok(matches.length > 0);
    assert.deepEqual(matches.map(p => p.part), matches.map((_, i) => i));
    matches.forEach(p => assert.equal(p.parts, matches.length));
    if (slide.kind === "cards") assert.deepEqual(matches.flatMap(p => p.cards), slide.cards);
    if (slide.kind === "table") {
      assert.ok(matches.length > 1, "the eight-row table must be paginated");
      assert.deepEqual(matches.flatMap(p => p.rows), slide.rows);
      matches.forEach(p => {
        assert.deepEqual(p.columns, slide.columns);
        assert.ok(p.rows.length <= 4);
      });
    }
    matches.forEach(p => assert.equal(p.title, slide.title));
  });
});

test("ordinary short cards keep their original layout; preparation does not mutate input", () => {
  const input = [{ kind: "cards", title: "Short", cards: [{ heading: "One", body: "A short point." }] }];
  const original = structuredClone(input);
  const result = preparePitchDeck(input);
  assert.equal(result.length, 1);
  assert.equal(result[0].layout, undefined);
  assert.deepEqual(input, original);
  preparePitchDeck(source);
  assert.ok(source.every(p => p.sourceIndex === undefined));
});
