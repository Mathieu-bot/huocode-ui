export type RepoRef = { owner: string; repo: string };

const OWNER = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})$/;
const REPO = /^[A-Za-z0-9_.-]{1,100}$/;
const URL_FORM =
  /^(?:https?:\/\/)?(?:www\.)?github\.com\/([^/\s?#]+)\/([^/\s?#]+)(?:[/?#].*)?$/i;
const SHORT_FORM = /^([^/\s]+)\/([^/\s]+)$/;

/**
 * Reads what a visitor pastes: a full GitHub URL (even one pointing inside the
 * repository, like /tree/main), a URL without the scheme, or owner/repo.
 * Returns null for anything that cannot be a public GitHub repository.
 */
export function parseRepo(input: string): RepoRef | null {
  const text = input.trim().replace(/\/+$/, "");
  const match = URL_FORM.exec(text) ?? SHORT_FORM.exec(text);
  if (!match) {
    return null;
  }
  const owner = match[1];
  const repo = match[2].replace(/\.git$/i, "");
  if (!OWNER.test(owner) || !REPO.test(repo) || /^\.+$/.test(repo)) {
    return null;
  }
  return { owner, repo };
}

export function repoSlug({ owner, repo }: RepoRef): string {
  return `${owner}/${repo}`;
}

export function repoUrl(ref: RepoRef): string {
  return `https://github.com/${repoSlug(ref)}`;
}

export function reportPath(ref: RepoRef): string {
  return `/report/${repoSlug(ref)}`;
}

export function analyzePath(ref: RepoRef, jobId?: string): string {
  const path = `/analyze/${repoSlug(ref)}`;
  return jobId ? `${path}?job=${encodeURIComponent(jobId)}` : path;
}
