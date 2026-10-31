import type { Metadata } from "next";
import { HowArticle } from "@/components/how/HowArticle";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

export const metadata: Metadata = {
  title: "How it works · HuoCode",
  description:
    "How HuoCode crosses file complexity with how often a file changes to find the files to review first.",
  alternates: { canonical: "/how-it-works" },
};

export default function HowItWorksPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-[1280px] flex-1 px-4 pb-16 sm:px-6">
        <HowArticle />
      </main>
      <SiteFooter />
    </>
  );
}
