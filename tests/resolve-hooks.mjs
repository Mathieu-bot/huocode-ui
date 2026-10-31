import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const HAS_EXTENSION = /\.[cm]?[jt]sx?$/;
const SRC = new URL("../src/", import.meta.url);
const SUFFIXES = ["", ".ts", "/index.ts"];

function firstExisting(base) {
  for (const suffix of SUFFIXES) {
    const candidate = new URL(base + suffix);
    if (existsSync(fileURLToPath(candidate))) return candidate.href;
  }
  return null;
}

/** Lets tests import source files the way the app does: "@/..." and extensionless relative paths. */
export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("@/")) {
    const found = firstExisting(new URL(specifier.slice(2), SRC).href);
    if (found) return nextResolve(found, context);
  }
  if (specifier.startsWith(".") && !HAS_EXTENSION.test(specifier)) {
    const found = firstExisting(new URL(specifier, context.parentURL).href);
    if (found) return nextResolve(found, context);
  }
  return nextResolve(specifier, context);
}
