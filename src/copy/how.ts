export type HowBand = {
  range: string;
  label: string;
  tone: "ok" | "warn" | "crit";
};

export type HowCopy = {
  title: string;
  intro: string;
  complexity: { heading: string; body: string };
  change: { heading: string; body: string };
  meet: { heading: string; body: string };
  score: { heading: string; body: string; formula: string; bandsLabel: string };
  bands: HowBand[];
  limits: { heading: string; body: string; disclaimer: string };
  cta: string;
};

export function howCopy(): HowCopy {
  return {
    title: "How HuoCode reads a repository",
    intro:
      "Two measurements per Java file, compared with the other files of the same repository. The code is never run or built.",
    complexity: {
      heading: "How complex the file is",
      body: "We take the file's most complex method and count its independent paths (cyclomatic complexity). Above 10 is the widely used limit where a method gets hard to test and to read.",
    },
    change: {
      heading: "How much it changes",
      body: "Over the last 500 commits, we add up the lines added and deleted in the file, blank lines aside. A file counts as changing a lot when it stands well above the rest of the repository.",
    },
    meet: {
      heading: "Where the two meet",
      body: "Crossing both gives four groups. A hotspot is complex and changing a lot: the place where a change most needs a careful review.",
    },
    score: {
      heading: "The score",
      body: "Each file gets a health score from 20 to 100. It drops with complexity and with change, and only drops sharply when both are high. The repository score averages production files, weighted by size. Test files are shown, never counted.",
      formula:
        "score = max(20, 100 − 55 × complexity penalty − 45 × activity penalty)",
      bandsLabel: "Score bands",
    },
    bands: [
      { range: "80–100", label: "Healthy", tone: "ok" },
      { range: "50–79", label: "Needs attention", tone: "warn" },
      { range: "20–49", label: "Critical", tone: "crit" },
    ],
    limits: {
      heading: "What it doesn't tell you",
      body: "Scores compare files within one repository; an 80 here is not an 80 elsewhere. Under 15 Java files there are too few to compare, so no score is given. Files in other languages are listed but never counted as healthy.",
      disclaimer:
        "This tool identifies areas to prioritize for human review. It is not a security audit, nor a guarantee of code reliability. For critical projects, manual review by experts and dedicated audit tools remain essential.",
    },
    cta: "Map a repository",
  };
}
