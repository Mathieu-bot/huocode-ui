import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  AnalysisResultStrategyEnum,
  AsyncFailureCode,
  FailureCode,
  FileErrorCode,
  FileStatus,
  LimitationCode,
  Quadrant,
} from "../../src/api-client/api.ts";
import { failureCopy } from "../../src/copy/failures.ts";
import { fileErrorCopy, fileStatusCopy } from "../../src/copy/fileStatus.ts";
import { limitationCopy } from "../../src/copy/limitations.ts";
import { quadrantCopy } from "../../src/copy/quadrants.ts";
import { strategyCopy } from "../../src/copy/strategy.ts";
import type { ApiFailure } from "../../src/api/failures.ts";

const ACTION =
  /\b(try|check|need|want|start|run|worth|wait|queued|give it|second attempt|again|smaller)\b/i;

function nonEmpty(value: string, what: string) {
  assert.ok(value.trim().length > 0, `${what} has empty copy`);
}

describe("every code the API can send has copy", () => {
  it("covers all failure codes", () => {
    for (const code of Object.values(FailureCode)) {
      const copy = failureCopy({ kind: "api", code, retryAfterSeconds: null });
      nonEmpty(copy.title, `FailureCode.${code}.title`);
      nonEmpty(copy.detail, `FailureCode.${code}.detail`);
    }
  });

  it("covers all async failure codes", () => {
    for (const code of Object.values(AsyncFailureCode)) {
      const copy = failureCopy({ kind: "api", code, retryAfterSeconds: null });
      nonEmpty(copy.title, `AsyncFailureCode.${code}.title`);
    }
  });

  it("covers the two non-api failure kinds", () => {
    const offline: ApiFailure = { kind: "offline" };
    const http: ApiFailure = {
      kind: "http",
      status: 502,
      retryAfterSeconds: null,
    };
    nonEmpty(failureCopy(offline).detail, "offline");
    nonEmpty(failureCopy(http).detail, "http");
  });

  it("covers all limitation codes", () => {
    for (const code of Object.values(LimitationCode)) {
      nonEmpty(limitationCopy({ code, fileCount: 12 }).text, `${code}`);
    }
  });

  it("counts the affected files where the contract supplies a count", () => {
    assert.match(
      limitationCopy({
        code: "UNSUPPORTED_LANGUAGE_FILES",
        fileCount: 12,
      }).text,
      /\b12 files\b/,
    );
    assert.match(
      limitationCopy({
        code: "UNSUPPORTED_LANGUAGE_FILES",
        fileCount: 1,
      }).text,
      /\b1 file\b/,
    );
  });

  it("invents no count where the contract omits one", () => {
    const text = limitationCopy({
      code: "INSUFFICIENT_FILES_FOR_RELATIVE_SCORING",
    }).text;
    assert.doesNotMatch(text, /\d/, "a file count was fabricated");
  });

  it("covers all quadrants", () => {
    for (const quadrant of Object.values(Quadrant)) {
      const copy = quadrantCopy(quadrant);
      nonEmpty(copy.label, `Quadrant.${quadrant}.label`);
      nonEmpty(copy.detail, `Quadrant.${quadrant}.detail`);
    }
  });

  it("covers all file statuses and error codes", () => {
    for (const status of Object.values(FileStatus)) {
      nonEmpty(fileStatusCopy(status).label, `FileStatus.${status}`);
    }
    for (const code of Object.values(FileErrorCode)) {
      nonEmpty(fileErrorCopy(code), `FileErrorCode.${code}`);
    }
  });

  it("covers all retrieval strategies", () => {
    for (const strategy of Object.values(AnalysisResultStrategyEnum)) {
      nonEmpty(strategyCopy(strategy).label, `Strategy.${strategy}`);
    }
  });
});

describe("a file we did not measure never reads as safe", () => {
  it("marks only 'analyzed' as measured", () => {
    for (const status of Object.values(FileStatus)) {
      const copy = fileStatusCopy(status);
      assert.equal(copy.measured, status === "analyzed");
    }
  });

  it("tells the reader to treat unmeasured files as unknown, not safe", () => {
    for (const status of ["unsupported_language", "error"] as const) {
      const copy = fileStatusCopy(status);
      assert.match(copy.detail, /unknown, not as safe/);
    }
  });
});

describe("failure copy always names a way forward", () => {
  const codes = [
    ...Object.values(FailureCode),
    ...Object.values(AsyncFailureCode),
  ] as FailureCode[];

  it("never leaves the reader stuck", () => {
    for (const code of codes) {
      const { detail } = failureCopy({
        kind: "api",
        code,
        retryAfterSeconds: null,
      });
      assert.ok(
        ACTION.test(detail),
        `${code} gives no way forward: "${detail}"`,
      );
    }
  });

  it("covers the non-code failure kinds too", () => {
    const kinds: ApiFailure[] = [
      { kind: "offline" },
      { kind: "http", status: 502, retryAfterSeconds: null },
    ];
    for (const failure of kinds) {
      assert.ok(
        ACTION.test(failureCopy(failure).detail),
        `${failure.kind} gives no way forward: "${failureCopy(failure).detail}"`,
      );
    }
  });
});
