import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import type { AnalysisResult } from "../../src/api-client/api.ts";
import { caveats, overviewCopy, periodLabel } from "../../src/copy/overview.ts";

const report = JSON.parse(
  readFileSync(new URL("../fixtures/javapoet.json", import.meta.url), "utf8"),
) as AnalysisResult;

const JARGON = /percentile|\bapi\b|cached|jobid|strategy/i;

describe("overview copy", () => {
  it("formats the analysis period as month and year", () => {
    assert.equal(
      periodLabel("2013-10-23T05:54:44Z", "2024-10-10T21:04:58Z"),
      "Oct 2013 – Oct 2024",
    );
    assert.equal(periodLabel("2024-10-01", "2024-10-30"), "Oct 2024");
  });

  it("never prints Invalid Date for missing or broken dates", () => {
    assert.equal(periodLabel(undefined, undefined), null);
    assert.equal(periodLabel("nope", "2024-10-10"), "Oct 2024");
  });

  it("phrases the verdict and footnote with correct plurals", () => {
    assert.equal(overviewCopy.verdictHot(1), "1 file is");
    assert.equal(overviewCopy.verdictHot(3), "3 files are");
    assert.match(overviewCopy.scoreFoot(17), /^Average of 17 production files/);
    assert.match(overviewCopy.tooFew(4), /\(4\).*at least 15/);
  });

  it("lists the javapoet caveats: other languages, then renamed files", () => {
    const list = caveats(report);
    assert.deepEqual(
      list.map((c) => c.kind),
      ["languages", "renamed"],
    );
    assert.equal(list[0].title, "11 files not analyzed.");
  });

  it("explains a missing comparison and skips renames for clones", () => {
    const list = caveats({
      ...report,
      strategy: "clone",
      limitations: [{ code: "INSUFFICIENT_FILES_FOR_RELATIVE_SCORING" }],
    });
    assert.deepEqual(
      list.map((c) => c.kind),
      ["comparison"],
    );
  });

  it("keeps jargon off the screen", () => {
    const texts = [
      ...caveats(report).flatMap((c) => [c.title, c.body]),
      ...Object.values(overviewCopy).filter((v) => typeof v === "string"),
    ];
    for (const text of texts) assert.doesNotMatch(text as string, JARGON);
  });
});
