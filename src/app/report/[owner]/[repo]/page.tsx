import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReportGate } from "@/features/report";
import { SiteFooter } from "@/shared/layout/SiteFooter";
import { SiteHeader } from "@/shared/layout/SiteHeader";
import { fetchReport } from "@/api/reports";
import { fmt, plural } from "@/features/report";
import { parseRepo, reportPath, repoSlug } from "@/shared/lib/repo";

type Props = { params: Promise<{ owner: string; repo: string }> };

const METADATA_TIMEOUT_MS = 2500;

async function reportDescription(owner: string, repo: string) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<null>((resolve) => {
    timer = setTimeout(() => resolve(null), METADATA_TIMEOUT_MS);
  });
  try {
    const report = await Promise.race([fetchReport(owner, repo), timeout]);
    if (!report) return null;
    if (!report.relativeScoringEnabled) return "Too few Java files for a score";
    const s = report.summary ?? {};
    const groups = [
      plural(s.hotspot ?? 0, "hotspot", "hotspots"),
      `${fmt(s.complexStable ?? 0)} complex but stable`,
      `${fmt(s.frequentSimple ?? 0)} changes often`,
      `${fmt(s.healthy ?? 0)} calm`,
    ].join(", ");
    const score = report.repoHealthScore;
    return score === undefined
      ? groups
      : `Repository health ${Math.round(score)}/100 · ${groups}`;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { owner, repo } = await params;
  const title = `HuoCode · ${owner}/${repo}`;
  const ref = parseRepo(`${owner}/${repo}`);
  if (!ref) return { title };
  const description = await reportDescription(ref.owner, ref.repo);
  return {
    title,
    ...(description ? { description } : {}),
    alternates: { canonical: reportPath(ref) },
    openGraph: {
      title,
      ...(description ? { description } : {}),
      url: reportPath(ref),
    },
  };
}

export default async function ReportPage({ params }: Props) {
  const { owner, repo } = await params;
  const ref = parseRepo(`${owner}/${repo}`);
  if (!ref) notFound();
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-[1280px] flex-1 px-4 pb-16 sm:px-6">
        <ReportGate key={repoSlug(ref)} owner={ref.owner} repo={ref.repo} />
      </main>
      <SiteFooter />
    </>
  );
}
