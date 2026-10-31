import { HATCH_ID, PINHEAD_ID } from "./paint";

/** Shared SVG patterns: hatch for unanalyzed files, garnet head for the hotspot pin. */
export function MapDefs() {
  return (
    <defs>
      <pattern
        id={HATCH_ID}
        width="6"
        height="6"
        patternUnits="userSpaceOnUse"
        patternTransform="rotate(45)"
      >
        <rect width="6" height="6" fill="#EEE6E4" />
        <line x1="0" y1="0" x2="0" y2="6" stroke="#C4B5B6" strokeWidth="2" />
      </pattern>
      <radialGradient id={PINHEAD_ID} cx=".35" cy=".35" r=".7">
        <stop offset="0" stopColor="#F6B3C4" />
        <stop offset=".6" stopColor="#A8234B" />
      </radialGradient>
    </defs>
  );
}

/** Pin stuck in the top-right corner of a hotspot cell. */
export function Pin({ x, y }: { x: number; y: number }) {
  return (
    <g pointerEvents="none" aria-hidden>
      <line
        x1={x}
        y1={y}
        x2={x - 5}
        y2={y + 13}
        stroke="#4A3A4F"
        strokeWidth="1.2"
      />
      <circle
        cx={x}
        cy={y}
        r="5.5"
        fill={`url(#${PINHEAD_ID})`}
        stroke="#fff"
        strokeWidth="1"
      />
    </g>
  );
}
