import assert from "node:assert/strict";
import { it } from "node:test";
import { plural } from "@/features/report/copy";

it("resolves the @/ alias the same way the app does", () => {
  assert.equal(plural(2, "file", "files"), "2 files");
});
