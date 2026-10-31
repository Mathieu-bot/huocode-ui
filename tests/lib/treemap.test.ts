import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import type { AnalysisResult, FileResult } from "../../src/api-client/api.ts";
import {
  cellValue,
  complexitySeam,
  jitter,
  layoutTreemap,
  mapHeight,
  scatterFiles,
  truncateEnd,
  truncateStart,
  UNANALYZED_AREA,
} from "../../src/lib/treemap.ts";

const report = JSON.parse(
  readFileSync(new URL("../fixtures/javapoet.json", import.meta.url), "utf8"),
) as AnalysisResult;

const prod = (complexityPercentile: number, over: boolean): FileResult =>
  ({
    path: `src/F${complexityPercentile}.java`,
    status: "analyzed",
    isTest: false,
    complexityPercentile,
    exceedsCommonComplexityThreshold: over,
  }) as FileResult;

describe("treemap layout", () => {
  it("clamps cell area and gives unanalyzed files a fixed small area", () => {
    const analyzed = { status: "analyzed" } as FileResult;
    assert.equal(cellValue({ ...analyzed, complexity: 1 }), 2);
    assert.equal(cellValue({ ...analyzed, complexity: 90 }), 30);
    assert.equal(cellValue({ ...analyzed, complexity: 12 }), 12);
    assert.equal(
      cellValue({ status: "unsupported_language" } as FileResult),
      UNANALYZED_AREA,
    );
  });

  it("keeps the height between 320 and 560", () => {
    assert.equal(mapHeight(300), 320);
    assert.equal(mapHeight(700), 420);
    assert.equal(mapHeight(2000), 560);
  });

  it("places every file inside its folder group and inside the map", () => {
    const { groups, cells } = layoutTreemap(report.files, 900, 540);
    assert.equal(cells.length, report.files.length);
    assert.equal(
      groups.reduce((sum, g) => sum + g.count, 0),
      report.files.length,
    );
    for (const cell of cells) {
      assert.ok(cell.x0 >= 0 && cell.x1 <= 900 && cell.y0 >= 0);
      assert.ok(cell.y1 <= 540);
      const dir = cell.file.path.includes("/")
        ? cell.file.path.slice(0, cell.file.path.lastIndexOf("/"))
        : "(repository root)";
      const group = groups.find((g) => g.name === dir)!;
      assert.ok(cell.x0 >= group.x0 && cell.x1 <= group.x1);
      assert.ok(cell.y0 >= group.y0 + 22 && cell.y1 <= group.y1);
    }
  });

  it("zooms into one folder", () => {
    const dir = layoutTreemap(report.files, 900, 540).groups[0].name;
    const zoomed = layoutTreemap(report.files, 900, 540, dir);
    assert.equal(zoomed.groups.length, 1);
    assert.equal(zoomed.groups[0].name, dir);
    assert.ok(zoomed.cells.every((c) => c.file.path.startsWith(dir)));
  });

  it("returns nothing for an unknown folder or zero size", () => {
    assert.deepEqual(layoutTreemap(report.files, 900, 540, "nope"), {
      groups: [],
      cells: [],
    });
    assert.equal(layoutTreemap(report.files, 0, 540).cells.length, 0);
  });
});

describe("labels", () => {
  it("truncates folders from the start and names from the end", () => {
    assert.equal(truncateStart("src/main/java", 6), "…/java");
    assert.equal(truncateStart("src", 6), "src");
    assert.equal(truncateEnd("TypeSpecBuilder", 6), "TypeS…");
    assert.equal(truncateEnd("Type", 6), "Type");
  });
});

describe("scatter helpers", () => {
  it("puts the complexity seam between the two sides of the limit", () => {
    assert.equal(complexitySeam(report.files), (71 + 76) / 2);
    assert.equal(complexitySeam([prod(40, false), prod(80, true)]), 60);
  });

  it("skips the seam when one side is empty", () => {
    assert.equal(complexitySeam([prod(40, false)]), null);
    assert.equal(complexitySeam([prod(80, true)]), null);
    assert.equal(complexitySeam([]), null);
  });

  it("ignores tests when placing the seam", () => {
    const test = { ...prod(95, false), isTest: true } as FileResult;
    assert.equal(complexitySeam([prod(40, false), prod(80, true), test]), 60);
  });

  it("plots only analyzed files with both ranks", () => {
    const points = scatterFiles(report.files);
    assert.equal(points.length, 39);
    assert.ok(points.every((f) => f.status === "analyzed"));
  });

  it("jitters deterministically by a few pixels", () => {
    assert.deepEqual(jitter(3), jitter(3));
    for (let i = 0; i < 50; i++) {
      const { dx, dy } = jitter(i);
      assert.ok(Math.abs(dx) <= 3 && Math.abs(dy) <= 3);
    }
  });
});
