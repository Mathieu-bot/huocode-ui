import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReportGate } from "@/components/report/ReportGate";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { parseRepo, repoSlug } from "@/lib/repo";

type Props = { params: Promise<{ owner: string; repo: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { owner, repo } = await params;
  return { title: `HuoCode · ${owner}/${repo}` };
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
