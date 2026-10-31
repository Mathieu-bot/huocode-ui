import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { analyzePath, parseRepo, repoUrl } from "../../src/lib/repo.ts";

const JAVAPOET = { owner: "square", repo: "javapoet" };

describe("parseRepo", () => {
  it("reads every way people paste a repository", () => {
    for (const input of [
      "square/javapoet",
      "  square/javapoet  ",
      "https://github.com/square/javapoet",
      "https://github.com/square/javapoet/",
      "https://github.com/square/javapoet.git",
      "http://www.github.com/square/javapoet",
      "github.com/square/javapoet",
      "https://github.com/square/javapoet/tree/master/src",
      "https://github.com/square/javapoet?tab=readme",
    ]) {
      assert.deepEqual(parseRepo(input), JAVAPOET, input);
    }
  });

  it("rejects what cannot be a public GitHub repository", () => {
    for (const input of [
      "",
      "javapoet",
      "gitlab.com/square/javapoet",
      "https://gitlab.com/square/javapoet",
      "ssh://git@github.com/square/javapoet",
      "github.com/square",
      "-bad/repo",
      "square/..",
      "a/b/c",
    ]) {
      assert.equal(parseRepo(input), null, input);
    }
  });
});

describe("paths", () => {
  it("builds the GitHub URL the API expects", () => {
    assert.equal(repoUrl(JAVAPOET), "https://github.com/square/javapoet");
  });

  it("keeps the job id in the progress URL so a reload resumes tracking", () => {
    assert.equal(
      analyzePath(JAVAPOET, "7f3c"),
      "/analyze/square/javapoet?job=7f3c",
    );
    assert.equal(analyzePath(JAVAPOET), "/analyze/square/javapoet");
  });
});
