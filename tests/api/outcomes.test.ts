import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  UnexpectedPayloadError,
  toJobPoll,
  toSubmitOutcome,
} from "../../src/api/outcomes.ts";

describe("toSubmitOutcome", () => {
  it("reads a synchronous 200 as a finished result", () => {
    const outcome = toSubmitOutcome({ status: "completed", repo: "a/b" });
    assert.equal(outcome.kind, "ready");
  });

  it("reads a 202 as an accepted job", () => {
    const outcome = toSubmitOutcome({
      jobId: "3f0e",
      status: "processing",
      estimatedSeconds: 60,
    });
    assert.equal(outcome.kind, "accepted");
  });
});

describe("toJobPoll", () => {
  it("maps each of the three job states", () => {
    assert.equal(
      toJobPoll({ jobId: "x", status: "processing" }).kind,
      "processing",
    );
    assert.equal(toJobPoll({ status: "completed", repo: "a/b" }).kind, "ready");
    assert.equal(
      toJobPoll({ jobId: "x", status: "failed", errorCode: "ANALYSIS_TIMEOUT" })
        .kind,
      "failed",
    );
  });

  it("carries the failure code instead of swallowing it", () => {
    const poll = toJobPoll({
      jobId: "x",
      status: "failed",
      errorCode: "GITHUB_RATE_LIMIT_REACHED",
    });
    assert.equal(
      "code" in poll ? poll.code : "MISSING",
      "GITHUB_RATE_LIMIT_REACHED",
    );
  });

  it("refuses a payload it cannot read rather than crashing on it", () => {
    const unreadable = [null, undefined, {}, { status: "weird" }, 42, "nope"];
    for (const body of unreadable) {
      assert.throws(() => toJobPoll(body), UnexpectedPayloadError);
    }
  });
});
