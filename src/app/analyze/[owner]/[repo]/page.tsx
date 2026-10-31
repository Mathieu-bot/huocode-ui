import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AnalyzeScreen } from "@/features/analysis";
import { SiteFooter } from "@/shared/layout/SiteFooter";
import { SiteHeader } from "@/shared/layout/SiteHeader";
import { parseRepo, repoSlug } from "@/shared/lib/repo";

type Props = {
  params: Promise<{ owner: string; repo: string }>;
  searchParams: Promise<{ job?: string | string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { owner, repo } = await params;
  return {
    title: `Mapping ${owner}/${repo} · HuoCode`,
    robots: { index: false },
  };
}

export default async function AnalyzePage({ params, searchParams }: Props) {
  const { owner, repo } = await params;
  const { job } = await searchParams;
  const ref = parseRepo(`${owner}/${repo}`);
  if (!ref) notFound();
  const jobId = typeof job === "string" && job.trim() ? job.trim() : null;

  return (
    <>
      <SiteHeader />
      <main className="w-full flex-1 px-4 sm:px-6">
        <AnalyzeScreen
          key={repoSlug(ref)}
          owner={ref.owner}
          repo={ref.repo}
          jobId={jobId}
        />
      </main>
      <SiteFooter />
    </>
  );
}
