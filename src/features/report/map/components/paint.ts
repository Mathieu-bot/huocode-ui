import type { FileResult, Quadrant } from "@/api-client/api";
import { DARK_KINDS, fileKind, isHatched, KIND_COLOR } from "../../model";

export const HATCH_ID = "map-hatch";
export const PINHEAD_ID = "map-pinhead";

/** Flat fill for a cell or point; files we could not analyze get the hatch pattern. */
export function fillFor(file: FileResult): string {
  const kind = fileKind(file);
  return isHatched(kind) ? `url(#${HATCH_ID})` : KIND_COLOR[kind];
}

export const lightText = (file: FileResult) => DARK_KINDS.has(fileKind(file));

/** True when the Overview asked to focus on a quadrant this file is not in. */
export function isDimmed(file: FileResult, focus: Quadrant | null): boolean {
  if (!focus) return false;
  return !(
    file.status === "analyzed" &&
    !file.isTest &&
    file.quadrant === focus
  );
}

export const isPinned = (file: FileResult) =>
  file.status === "analyzed" && !file.isTest && file.quadrant === "hotspot";
