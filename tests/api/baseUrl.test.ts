import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { resolveApiBase } from "../../src/api/baseUrl.ts";

describe("resolveApiBase", () => {
  it("uses the configured URL without its trailing slashes", () => {
    assert.deepEqual(
      resolveApiBase(" https://api.example.com// ", "production"),
      {
        basePath: "https://api.example.com",
        configured: true,
      },
    );
  });

  it("falls back to the local API in development", () => {
    assert.deepEqual(resolveApiBase(undefined, "development"), {
      basePath: "http://localhost:8080",
      configured: true,
    });
  });

  it("reports an unconfigured production build instead of throwing", () => {
    assert.deepEqual(resolveApiBase("  ", "production"), {
      basePath: "",
      configured: false,
    });
  });
});
