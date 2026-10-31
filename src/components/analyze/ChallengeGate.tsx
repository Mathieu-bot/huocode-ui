"use client";

import { Turnstile } from "@marsidev/react-turnstile";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { analyzeCopy } from "@/copy/analyze";

type Props = {
  repo: string;
  onToken: (token: string) => void;
  onRetry: () => void;
};

export function ChallengeGate({ repo, onToken, onRetry }: Props) {
  const copy = analyzeCopy(repo);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  return (
    <section className="panel grid max-w-[560px] gap-3 p-6">
      <span className="grid size-10 place-items-center rounded-full bg-[#eef5ec] text-ok">
        <ShieldCheck size={20} strokeWidth={1.5} aria-hidden />
      </span>
      <h2 className="text-lg font-bold">{copy.challengeTitle}</h2>
      {siteKey ? (
        <>
          <Turnstile
            siteKey={siteKey}
            onSuccess={onToken}
            options={{ theme: "light" }}
          />
          <p className="text-sm text-ink-2">{copy.challengeBody}</p>
        </>
      ) : (
        <>
          <p className="text-sm text-ink-2">{copy.challengeMissing}</p>
          <Button className="justify-self-start" size="sm" onClick={onRetry}>
            {copy.tryAgain}
          </Button>
        </>
      )}
    </section>
  );
}
