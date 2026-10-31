import type { FileFilter } from "./filters";

export const FILTER_LABEL: Record<FileFilter, string> = {
  all: "All",
  prod: "Production",
  test: "Tests",
  other: "Other languages",
  error: "Couldn't read",
};

export const filesCopy = {
  panelLabel: "All files",
  detailLabel: "Selected file",
  search: "Search a path",
  searchLabel: "Search files by path",
  filtersLabel: "Show",
  arrangeLabel: "Arrange",
  folders: "Folders",
  worstFirst: "Worst first",
  mostComplex: "Most complex",
  listLabel: "Files",
  focusOnly: (label: string) => `${label} only`,
  clearFocus: "Show every group",
  root: "repository root",
  hotspot: "Hotspot",
  test: "Test file",
  couldNotRead: "Couldn't read",
  noScore: "No score",
  empty: "No file matches these filters.",
  clear: "Clear filters",
  move: "move",
  searchKey: "search",
  shown: (shown: number, total: number) => `${shown} of ${total} shown`,
  noSelection: "Pick a file on the left to see why it stands out.",
};
