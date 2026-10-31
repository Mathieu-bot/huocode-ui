import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { AnalysisResult } from "@/api-client/api";
import {
  AsyncFailureCode,
  FailureCode,
  FileErrorCode,
  LimitationCode,
  Quadrant,
} from "@/api-client/api";
import type { ApiFailure } from "@/api/failures";
import { failureCopy } from "@/features/analysis/failure-copy";
import { caveats } from "@/features/report/overview/copy";
import { quadrantCopy } from "@/shared/copy/quadrants";
import { explain, FILE_ERROR, languageName } from "@/features/report/copy";

const ACTION =
  /\b(try|check|need|want|start|run|worth|wait|queued|give it|second attempt|again|smaller)\b/i;
const JARGON = /\b(percentile|api|cached|jobid|strategy|ttl|polling)\b/i;

function nonEmpty(value: string | null | undefined, what: string) {
  assert.ok(value && value.trim().length > 0, `${what} has empty copy`);
}

describe("every code the API can send has copy", () => {
  it("covers every failure code with a way forward and no jargon", () => {
    const codes = [
      ...Object.values(FailureCode),
      ...Object.values(AsyncFailureCode),
    ] as FailureCode[];
    for (const code of codes) {
      const { title, detail } = failureCopy({
        kind: "api",
        code,
        retryAfterSeconds: null,
      });
      nonEmpty(title, code);
      assert.ok(
        ACTION.test(detail),
        `${code} gives no way forward: "${detail}"`,
      );
      assert.doesNotMatch(`${title} ${detail}`, JARGON, code);
    }
  });

  it("covers the non-code failure kinds", () => {
    const kinds: ApiFailure[] = [
      { kind: "offline" },
      { kind: "http", status: 502, retryAfterSeconds: null },
    ];
    for (const failure of kinds)
      assert.ok(ACTION.test(failureCopy(failure).detail), failure.kind);
  });

  it("covers every quadrant, file error and limitation", () => {
    for (const quadrant of Object.values(Quadrant))
      nonEmpty(quadrantCopy(quadrant).label, quadrant);
    for (const code of Object.values(FileErrorCode))
      nonEmpty(FILE_ERROR[code], code);
    for (const code of Object.values(LimitationCode)) {
      const report = {
        limitations: [{ code, fileCount: 3 }],
        strategy: "clone",
      } as unknown as AnalysisResult;
      nonEmpty(caveats(report)[0]?.title, code);
    }
  });

  it("names unknown languages by their code instead of inventing one", () => {
    assert.equal(languageName("markdown"), "Markdown");
    assert.equal(languageName("zig"), "zig");
    assert.equal(languageName(undefined), "Unknown type");
  });
});

describe("narration only uses numbers the API sent", () => {
  it("explains every quadrant, and nothing for unscored files", () => {
    const churn = {
      commits: 63,
      authors: 22,
      linesAdded: 1244,
      linesDeleted: 500,
      effectiveLines: 1744,
    };
    for (const quadrant of Object.values(Quadrant)) {
      const text = explain({
        path: "A.java",
        status: "analyzed",
        complexity: 42,
        churn,
        quadrant,
      });
      nonEmpty(text, quadrant);
      assert.doesNotMatch(text!, JARGON, quadrant);
    }
    assert.equal(
      explain({ path: "A.java", status: "analyzed", complexity: 4, churn }),
      null,
    );
  });
});
