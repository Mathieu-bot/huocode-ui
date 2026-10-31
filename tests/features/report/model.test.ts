import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import type { AnalysisResult } from "@/api-client/api";
import {
  band,
  byRisk,
  defaultSelection,
  fileKind,
  linesChanged,
  reportStats,
} from "@/features/report/model";

const report = JSON.parse(
  readFileSync(
    new URL("../../fixtures/javapoet.json", import.meta.url),
    "utf8",
  ),
) as AnalysisResult;
const file = (name: string) => report.files.find((f) => f.path.endsWith(name))!;

describe("report model on the real square/javapoet response", () => {
  it("splits files the way the summary counts them", () => {
    const stats = reportStats(report);
    const summary = report.summary!;
    const quadrantTotal =
      summary.hotspot! +
      summary.complexStable! +
      summary.frequentSimple! +
      summary.healthy!;
    assert.equal(stats.production.length, quadrantTotal);
    assert.equal(stats.unsupported.length, summary.unanalyzed);
    assert.equal(stats.tests.length, 22);
  });

  it("draws tests violet and unanalyzed files hatched, never as a quadrant", () => {
    assert.equal(fileKind(file("TypeSpec.java")), "hotspot");
    assert.equal(fileKind(file("TypeSpecTest.java")), "test");
    assert.equal(fileKind(file("pom.xml")), "unsupported");
  });

  it("puts the worst production file first", () => {
    const sorted = [...report.files].sort(byRisk);
    assert.ok(sorted[0].path.endsWith("TypeSpec.java"));
    assert.equal(defaultSelection(report), report.top5[0]);
    assert.equal(sorted.at(-1)!.status, "unsupported_language");
  });

  it("reads churn lines and score bands", () => {
    assert.equal(linesChanged(file("TypeSpec.java")), 1744);
    assert.deepEqual(
      [band(80), band(79), band(50), band(49)],
      ["ok", "warn", "warn", "crit"],
    );
  });
});
