import { HardButton } from "@/components/ui/HardButton";
import { HardInput } from "@/components/ui/HardInput";
import { HardPanel } from "@/components/ui/HardPanel";
import { landingCopy } from "@/copy/landing";

export function RepoField() {
  const copy = landingCopy();

  return (
    <HardPanel>
      <form className="flex flex-col gap-5 md:flex-row md:items-stretch">
        <label className="sr-only" htmlFor="repo-url">
          {copy.fieldLabel}
        </label>
        <div className="relative w-full">
          <HardInput
            id="repo-url"
            name="repoUrl"
            type="text"
            inputMode="url"
            autoComplete="off"
            spellCheck={false}
            placeholder={copy.placeholder}
          />
        </div>
        <HardButton type="submit">{copy.cta}</HardButton>
      </form>
      <p className="mt-6 text-sm text-secondary">{copy.footnote}</p>
    </HardPanel>
  );
}
