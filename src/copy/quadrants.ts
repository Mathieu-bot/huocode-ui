import type { Quadrant } from "@/api-client/api";

export type QuadrantCopy = {
  label: string;
  detail: string;
  heat: 0 | 1 | 2 | 3 | 4;
};

const COPY: Record<Quadrant, QuadrantCopy> = {
  hotspot: {
    label: "Hotspots",
    detail: "Complicated and changing fast. This is where bugs live.",
    heat: 4,
  },
  complex_stable: {
    label: "Complicated, quiet",
    detail: "Hard to read, but rarely touched. Fix it when you next go in.",
    heat: 2,
  },
  frequent_simple: {
    label: "Simple, busy",
    detail: "Low risk, but a lot of eyes on it.",
    heat: 1,
  },
  healthy: {
    label: "Healthy",
    detail: "Simple and stable. Nothing to do here.",
    heat: 0,
  },
};

export function quadrantCopy(quadrant: Quadrant): QuadrantCopy {
  return COPY[quadrant];
}

export const QUADRANT_ORDER: Quadrant[] = [
  "hotspot",
  "complex_stable",
  "frequent_simple",
  "healthy",
];
