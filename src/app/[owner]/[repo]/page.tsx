import { notFound, redirect } from "next/navigation";
import { parseRepo, reportPath } from "@/lib/repo";

type Props = { params: Promise<{ owner: string; repo: string }> };

/** Top-level paths that belong to the app, never to a GitHub owner. */
const RESERVED = new Set(["report", "analyze", "how-it-works"]);

/**
 * The github.com → huocode.app shortcut: /{owner}/{repo} opens that
 * repository's report. Static routes like /report win over this segment.
 */
export default async function RepoShortcut({ params }: Props) {
  const { owner, repo } = await params;
  const ref = RESERVED.has(owner.toLowerCase())
    ? null
    : parseRepo(`${owner}/${repo}`);
  if (!ref) notFound();
  redirect(reportPath(ref));
}
