import type { FileErrorCode, FileStatus } from "@/api-client/api";

export type FileStatusCopy = {
  label: string;
  detail: string;
  measured: boolean;
};

const COPY: Record<FileStatus, FileStatusCopy> = {
  analyzed: {
    label: "Measured",
    detail: "We read this file and scored it.",
    measured: true,
  },
  unsupported_language: {
    label: "Not measured",
    detail:
      "This language isn't one we score yet, so we have no idea whether this file is a risk. Treat it as unknown, not as safe.",
    measured: false,
  },
  error: {
    label: "Couldn't read",
    detail:
      "We tried and failed to read this file, so it's unmeasured. Treat it as unknown, not as safe.",
    measured: false,
  },
};

const ERROR_DETAIL: Record<FileErrorCode, string> = {
  PARSE_ERROR: "We hit a parsing error on this file.",
  FILE_TOO_LARGE: "This file is larger than we're willing to read.",
};

export function fileStatusCopy(status: FileStatus): FileStatusCopy {
  return COPY[status];
}

export function fileErrorCopy(code: FileErrorCode): string {
  return ERROR_DETAIL[code];
}
