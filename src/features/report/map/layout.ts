import { hierarchy, treemap, treemapSquarify } from "d3-hierarchy";
import type { FileResult } from "@/api-client/api";
import { groupByDir, isProduction } from "../model";

export type Box = { x0: number; y0: number; x1: number; y1: number };
export type GroupBox = Box & { name: string; count: number };
export type CellBox = Box & { file: FileResult };
export type TreemapLayout = { groups: GroupBox[]; cells: CellBox[] };

/** Fixed small area for files we could not analyze. */
export const UNANALYZED_AREA = 1.6;

/** Cell area: worst-method complexity clamped to [2, 30] so outliers don't crush small files. */
export function cellValue(file: FileResult): number {
  if (file.status !== "analyzed") return UNANALYZED_AREA;
  return Math.max(2, Math.min(30, file.complexity ?? 0));
}

/** Map height for a given width: about 0.6 of it, kept between 320 and 560. */
export function mapHeight(width: number): number {
  return Math.round(Math.max(320, Math.min(560, width * 0.6)));
}

type Node = { name?: string; file?: FileResult; children?: Node[] };

/** Squarified treemap with one level of folder groups; `dir` keeps only that folder. */
export function layoutTreemap(
  files: FileResult[],
  width: number,
  height: number,
  dir: string | null = null,
): TreemapLayout {
  let children: Node[] = [...groupByDir(files)].map(([name, list]) => ({
    name,
    children: list.map((file) => ({ file })),
  }));
  if (dir) children = children.filter((group) => group.name === dir);
  if (children.length === 0 || width <= 0 || height <= 0)
    return { groups: [], cells: [] };
  const root = hierarchy<Node>({ children })
    .sum((d) => (d.file ? cellValue(d.file) : 0))
    .sort(
      (a, b) =>
        (b.value ?? 0) - (a.value ?? 0) ||
        (a.data.file?.path ?? a.data.name ?? "").localeCompare(
          b.data.file?.path ?? b.data.name ?? "",
        ),
    );
  const laid = treemap<Node>()
    .tile(treemapSquarify.ratio(1.3))
    .size([width, height])
    .paddingOuter(4)
    .paddingTop((d) => (d.depth === 1 ? 22 : 4))
    .paddingInner(2)
    .round(true)(root);
  const groups = (laid.children ?? []).map((g) => ({
    name: g.data.name ?? "",
    count: g.leaves().length,
    x0: g.x0,
    y0: g.y0,
    x1: g.x1,
    y1: g.y1,
  }));
  const cells = laid.leaves().map((leaf) => ({
    file: leaf.data.file!,
    x0: leaf.x0,
    y0: leaf.y0,
    x1: leaf.x1,
    y1: leaf.y1,
  }));
  return { groups, cells };
}

/** Keeps the end of a folder path, which is the part that tells folders apart. */
export function truncateStart(text: string, max: number): string {
  if (max <= 1) return "…";
  return text.length > max ? `…${text.slice(-(max - 1))}` : text;
}

export function truncateEnd(text: string, max: number): string {
  if (max <= 1) return "…";
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

/**
 * Complexity rank that separates production files whose most complex method is within
 * the common limit of 10 from those over it. Null when either side is empty.
 */
export function complexitySeam(files: FileResult[]): number | null {
  let below = -Infinity;
  let above = Infinity;
  for (const file of files) {
    if (!isProduction(file) || file.complexityPercentile === undefined)
      continue;
    if (file.exceedsCommonComplexityThreshold)
      above = Math.min(above, file.complexityPercentile);
    else below = Math.max(below, file.complexityPercentile);
  }
  if (below === -Infinity || above === Infinity) return null;
  return (below + above) / 2;
}

/** Analyzed files that carry both ranks, the only ones the scatter can place. */
export function scatterFiles(files: FileResult[]): FileResult[] {
  return files.filter(
    (f) =>
      f.status === "analyzed" &&
      f.churnPercentile !== undefined &&
      f.complexityPercentile !== undefined,
  );
}

/** Small deterministic offset (pixels) so files with equal ranks don't hide each other. */
export function jitter(index: number): { dx: number; dy: number } {
  return {
    dx: (((index * 37) % 11) - 5) * 0.6,
    dy: (((index * 53) % 9) - 4) * 0.6,
  };
}
