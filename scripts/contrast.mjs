const CONTRAST = { AA_BODY: 4.5, AA_LARGE: 3, UI: 3 };

const PAIRS = [
  ["ink", "toile", "AA_BODY"],
  ["ink", "linen", "AA_BODY"],
  ["ink", "blush", "AA_BODY"],
  ["ink-2", "toile", "AA_BODY"],
  ["ink-2", "linen", "AA_BODY"],
  ["ink-3", "toile", "AA_BODY"],
  ["ink-3", "linen", "AA_BODY"],
  ["garnet", "toile", "AA_BODY"],
  ["garnet", "linen", "AA_BODY"],
  ["garnet-deep", "blush", "AA_BODY"],
  ["on-dark", "garnet", "AA_BODY"],
  ["on-dark", "ink", "AA_BODY"],
  ["ok", "linen", "AA_BODY"],
  ["warn", "linen", "AA_BODY"],
  ["warn", "toile", "AA_BODY"],
  ["crit", "linen", "AA_BODY"],
  ["on-dark", "q-hot", "AA_BODY"],
  ["ink", "q-cs", "AA_BODY"],
  ["on-dark", "q-fs", "AA_BODY"],
  ["ink", "q-ok", "AA_BODY"],
  ["ink", "q-test", "AA_BODY"],
  ["ink", "slate", "AA_BODY"],
  ["on-dark", "slate-dark", "AA_BODY"],
];

function channels(hex) {
  const value = hex.trim().replace("#", "");
  return [0, 2, 4].map((i) => parseInt(value.slice(i, i + 2), 16) / 255);
}

function luminance(hex) {
  const [r, g, b] = channels(hex).map((c) =>
    c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function ratio(a, b) {
  const [lighter, darker] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (lighter + 0.05) / (darker + 0.05);
}

function readTokens(css) {
  const tokens = {};
  const body = css.slice(css.indexOf(":root"));
  for (const line of body.split("\n")) {
    const found = /^\s*--([a-z0-9-]+):\s*(#[0-9a-fA-F]{3,8})\s*;/.exec(line);
    if (found) {
      tokens[found[1]] = found[2];
    }
  }
  return tokens;
}

export function check(css) {
  const tokens = readTokens(css);
  const failures = [];
  const measured = [];

  for (const [foreground, background, level] of PAIRS) {
    const fg = tokens[foreground];
    const bg = tokens[background];
    if (!fg || !bg) {
      failures.push(`missing token: --${foreground} or --${background}`);
      continue;
    }
    const value = ratio(fg, bg);
    const required = CONTRAST[level];
    measured.push({ foreground, background, value, required });
    if (value < required) {
      failures.push(
        `${foreground} on ${background} is ${value.toFixed(2)}, needs ${required}`,
      );
    }
  }

  return { failures, measured, tokens };
}
