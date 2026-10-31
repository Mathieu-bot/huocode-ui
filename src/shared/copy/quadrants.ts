import type { Quadrant } from "@/api-client/api";

export type QuadrantCopy = {
  label: string;
  short: string;
  detail: string;
  color: string;
};

const COPY: Record<Quadrant, QuadrantCopy> = {
  hotspot: {
    label: "Hotspot",
    short: "Complex and changing a lot",
    detail: "Complex and changing a lot. Review these first.",
    color: "var(--q-hot)",
  },
  complex_stable: {
    label: "Complex but stable",
    short: "Complex, rarely changed",
    detail: "Hard to read, rarely touched. Lower urgency.",
    color: "var(--q-cs)",
  },
  frequent_simple: {
    label: "Changes often",
    short: "Simple, changed a lot",
    detail: "Busy but simple. Generally fine.",
    color: "var(--q-fs)",
  },
  healthy: {
    label: "Calm",
    short: "Simple and stable",
    detail: "Simple and stable. Nothing to flag.",
    color: "var(--q-ok)",
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
