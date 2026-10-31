import { readFile } from "node:fs/promises";
import { check } from "./contrast.mjs";

const tokensPath = new URL("../src/styles/tokens.css", import.meta.url);
const css = await readFile(tokensPath, "utf8");
const { failures, measured } = check(css);

for (const row of measured) {
  const status = row.value >= row.required ? "ok  " : "FAIL";
  console.log(
    `${status}  ${row.foreground} on ${row.background}: ${row.value.toFixed(2)} (needs ${row.required})`,
  );
}

if (failures.length > 0) {
  console.error("\ncontrast failures:");
  for (const failure of failures) {
    console.error(`  ${failure}`);
  }
  process.exit(1);
}

console.log(`\nall ${measured.length} pairs pass`);
