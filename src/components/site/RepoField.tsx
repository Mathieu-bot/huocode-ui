"use client";

import { CircleAlert, GitBranch, Github, ScanSearch } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useId, useState } from "react";
import { fetchExamples } from "@/api/reports";
import { Button } from "@/components/ui/Button";
import { landingCopy } from "@/copy/landing";
import { analyzePath, parseRepo } from "@/lib/repo";

type Props = { initialValue?: string; label?: string; showExamples?: boolean };

export function RepoField({
  initialValue = "",
  label,
  showExamples = false,
}: Props) {
  const copy = landingCopy();
  const router = useRouter();
  const id = useId();
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);
  const [examples, setExamples] = useState<string[]>([]);

  useEffect(() => {
    if (!showExamples) return;
    let alive = true;
    fetchExamples()
      .then(
        (list) =>
          alive &&
          setExamples(
            list.map((e) => e.repo ?? "").filter((r) => parseRepo(r)),
          ),
      )
      .catch(() => alive && setExamples([]));
    return () => {
      alive = false;
    };
  }, [showExamples]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!value.trim()) return setError(copy.emptyError);
    const ref = parseRepo(value);
    if (!ref) return setError(copy.invalidError);
    setError(null);
    router.push(analyzePath(ref));
  }

  return (
    <form noValidate onSubmit={onSubmit}>
      <label
        htmlFor={id}
        className="mb-2 ml-5 block text-sm font-semibold text-ink-2"
      >
        {label ?? copy.fieldLabel}
      </label>
      <div className="flex flex-col gap-2.5 sm:flex-row">
        <div
          className={`flex h-14 flex-1 items-center gap-3 rounded-full border bg-linen px-5 transition-shadow focus-within:border-garnet focus-within:shadow-[0_0_0_4px_var(--blush)] ${error ? "border-crit" : "border-ink"}`}
        >
          <Github
            size={18}
            strokeWidth={1.5}
            className="text-ink-3"
            aria-hidden
          />
          <input
            id={id}
            name="repoUrl"
            type="text"
            inputMode="url"
            autoComplete="off"
            spellCheck={false}
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
              setError(null);
            }}
            placeholder={copy.placeholder}
            aria-invalid={error ? true : undefined}
            aria-describedby={`${id}-msg`}
            className="w-full bg-transparent font-mono text-[15px] outline-none placeholder:text-ink-3"
          />
        </div>
        <Button type="submit" variant="rose" size="lg">
          <ScanSearch size={18} strokeWidth={1.5} aria-hidden />
          {copy.cta}
        </Button>
      </div>
      <p
        id={`${id}-msg`}
        role="alert"
        className="mt-2 ml-5 flex min-h-6 items-center gap-2 text-sm text-crit"
      >
        {error && <CircleAlert size={15} strokeWidth={1.5} aria-hidden />}
        {error}
      </p>
      {examples.length > 0 && (
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <span className="mr-0.5 text-[13.5px] text-ink-2">
            {copy.examplesLabel}
          </span>
          {examples.map((repo) => (
            <button
              key={repo}
              type="button"
              onClick={() => {
                setValue(repo);
                setError(null);
              }}
              className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full border border-seam-strong bg-linen px-3 font-mono text-[13px] transition-colors hover:border-garnet hover:bg-blush"
            >
              <GitBranch size={14} strokeWidth={1.5} aria-hidden />
              {repo}
            </button>
          ))}
        </div>
      )}
    </form>
  );
}
