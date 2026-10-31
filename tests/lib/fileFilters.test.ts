import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import type { AnalysisResult, FileResult } from "../../src/api-client/api.ts";
import {
  type FilterState,
  filterCounts,
  folderGroups,
  kindMix,
  matchesFilters,
  visibleFiles,
} from "../../src/lib/fileFilters.ts";

const report = JSON.parse(
  readFileSync(new URL("../fixtures/javapoet.json", import.meta.url), "utf8"),
) as AnalysisResult;
const all: FilterState = { filter: "all", query: "", focus: null };

describe("Files explorer filters on the real square/javapoet response", () => {
  it("counts every filter the way the report splits files", () => {
    assert.deepEqual(filterCounts(report.files), {
      all: 50,
      prod: 17,
      test: 22,
      other: 11,
      error: 0,
    });
  });

  it("matches the search anywhere in the path, ignoring case", () => {
    const shown = visibleFiles(report.files, { ...all, query: " typespec " });
    assert.ok(shown.length >= 2);
    assert.ok(shown.every((f) => f.path.toLowerCase().includes("typespec")));
  });

  it("keeps only the focused quadrant's production files", () => {
    const shown = visibleFiles(report.files, { ...all, focus: "healthy" });
    assert.equal(shown.length, 11);
    assert.ok(shown.every((f) => !f.isTest && f.quadrant === "healthy"));
    assert.equal(
      visibleFiles(report.files, { ...all, filter: "test", focus: "healthy" })
        .length,
      0,
    );
  });

  it("lists files worst first", () => {
    const shown = visibleFiles(report.files, all);
    assert.ok(shown[0].path.endsWith("TypeSpec.java"));
    assert.equal(shown.at(-1)!.status, "unsupported_language");
  });

  it("orders folders by their worst file and sorts files inside", () => {
    const groups = folderGroups(report.files);
    assert.ok(groups[0].files[0].path.endsWith("TypeSpec.java"));
    const total = groups.reduce((n, g) => n + g.files.length, 0);
    assert.equal(total, 50);
    assert.ok(groups.some((g) => g.dir === "(repository root)"));
  });
});

describe("folder kind mix", () => {
  const f = (over: Partial<FileResult>): FileResult =>
    ({ path: "a/B.java", status: "analyzed", ...over }) as FileResult;

  it("splits a folder into kind shares that add up to one", () => {
    const mix = kindMix([
      f({ quadrant: "hotspot" }),
      f({ isTest: true, quadrant: "healthy" }),
      f({ status: "error" }),
      f({ status: "unsupported_language" }),
    ]);
    assert.deepEqual(mix, [
      { kind: "hotspot", share: 0.25 },
      { kind: "test", share: 0.25 },
      { kind: "unsupported", share: 0.5 },
    ]);
  });

  it("does not match an error file under Production", () => {
    assert.equal(
      matchesFilters(f({ status: "error" }), { ...all, filter: "prod" }),
      false,
    );
  });
});
