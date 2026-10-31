export type LandingCopy = {
  titleStart: string;
  titleStitched: string;
  subtitle: string;
  fieldLabel: string;
  placeholder: string;
  cta: string;
  examplesLabel: string;
  javaOnly: string;
  shortcut: [string, string, string, string, string];
  previewLabel: string;
  emptyError: string;
  previewScore: string;
  previewTests: string;
  previewOther: string;
  previewCta: string;
  previewOpen: (repo: string) => string;
  previewMapLabel: (repo: string) => string;
  invalidError: string;
};

export function landingCopy(): LandingCopy {
  return {
    titleStart: "Find the files where your next change is ",
    titleStitched: "most likely to hurt",
    subtitle:
      "Paste a public GitHub repository. HuoCode crosses how complex each file is with how much it changes, and shows you which ones to review first.",
    fieldLabel: "GitHub repository",
    placeholder: "owner/repo or https://github.com/owner/repo",
    cta: "Map this repository",
    examplesLabel: "Try one",
    javaOnly: "Java only for now. Other files are listed, never scored.",
    shortcut: [
      "Shortcut: replace ",
      "github.com",
      " with ",
      "huocode.app",
      " in any repository URL.",
    ],
    previewLabel: "How to read a result",
    previewScore: "Repository health",
    previewTests: "Test",
    previewOther: "Not analyzed",
    previewCta: "Open this report",
    previewOpen: (repo) => `Open the example report for ${repo}`,
    previewMapLabel: (repo) =>
      `Example map of ${repo}: every file, grouped by folder and coloured by group`,
    emptyError: "Paste a GitHub repository first, like square/javapoet.",
    invalidError:
      "Use a GitHub address like github.com/owner/repo, or just owner/repo.",
  };
}
