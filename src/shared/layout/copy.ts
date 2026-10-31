export type SiteCopy = {
  home: string;
  mainNav: string;
  howItWorks: string;
  source: string;
  footerStatic: string;
  footerReports: string;
};

export function siteCopy(): SiteCopy {
  return {
    home: "HuoCode home",
    mainNav: "Main",
    howItWorks: "How it works",
    source: "Source",
    footerStatic: "Static analysis only: your code is never run.",
    footerReports:
      "Opening an existing report never counts toward your analyses.",
  };
}
