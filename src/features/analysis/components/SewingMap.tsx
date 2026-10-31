const CELLS = [
  [8, 8, 170, 82],
  [184, 8, 120, 82],
  [310, 8, 96, 50],
  [412, 8, 180, 50],
  [310, 64, 140, 26],
  [456, 64, 136, 26],
  [8, 96, 96, 46],
  [110, 96, 194, 46],
  [310, 96, 70, 46],
  [386, 96, 110, 46],
  [502, 96, 90, 46],
];

/** Decorative: a ghost treemap being stitched while the real one is measured. */
export function SewingMap({ height = 150 }: { height?: number }) {
  const rects = CELLS.map(([x, y, w, h]) => (
    <rect key={`${x}-${y}`} x={x} y={y} width={w} height={h} rx={4} />
  ));
  return (
    <div
      className="mt-7 overflow-hidden rounded-[10px] border border-seam bg-linen"
      style={{ height }}
      aria-hidden
    >
      <svg
        viewBox="0 0 600 150"
        preserveAspectRatio="none"
        className="block size-full"
      >
        <g className="stitch-ghost">{rects}</g>
        <g className="stitch-thread">{rects}</g>
      </svg>
    </div>
  );
}
