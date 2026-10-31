import assert from "node:assert/strict";
import { it } from "node:test";
import { plural } from "@/copy/report";

it("resolves the @/ alias the same way the app does", () => {
  assert.equal(plural(2, "file", "files"), "2 files");
});
