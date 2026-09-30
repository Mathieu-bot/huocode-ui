export type LandingCopy = {
  titleLines: [string, string];
  subtitle: string;
  subnote: string;
  fieldLabel: string;
  placeholder: string;
  cta: string;
  footnote: string;
};

export function landingCopy(): LandingCopy {
  return {
    titleLines: ["See where the", "risk hides"],
    subtitle:
      "Paste a public GitHub URL and HuoCode maps the files that are both complicated and changing fast.",
    subnote: "That's where bugs come from.",
    fieldLabel: "Repository URL",
    placeholder: "https://github.com/owner/repository",
    cta: "Analyze",
    footnote: "We need at least 15 files we can measure, and we stop at 3,000.",
  };
}
