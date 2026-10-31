"use client";

import { Github, ScanSearch } from "lucide-react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { landingCopy } from "@/copy/landing";

export function RepoField() {
  const copy = landingCopy();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <form noValidate onSubmit={onSubmit}>
      <label
        htmlFor="repo-url"
        className="mb-2 ml-5 block text-sm font-semibold text-ink-2"
      >
        {copy.fieldLabel}
      </label>
      <div className="flex flex-col gap-2.5 sm:flex-row">
        <div className="flex h-14 flex-1 items-center gap-3 rounded-full border border-ink bg-linen px-5 transition-shadow focus-within:border-garnet focus-within:shadow-[0_0_0_4px_var(--blush)]">
          <Github
            size={18}
            strokeWidth={1.5}
            className="text-ink-3"
            aria-hidden
          />
          <input
            id="repo-url"
            name="repoUrl"
            type="text"
            inputMode="url"
            autoComplete="off"
            spellCheck={false}
            placeholder={copy.placeholder}
            className="w-full bg-transparent font-mono text-[15px] outline-none placeholder:text-ink-3"
          />
        </div>
        <Button type="submit" variant="rose" size="lg">
          <ScanSearch size={18} strokeWidth={1.5} aria-hidden />
          {copy.cta}
        </Button>
      </div>
    </form>
  );
}
