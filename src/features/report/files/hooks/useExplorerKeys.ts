import { type RefObject, useEffect } from "react";

/** Scroll the list itself (never the page) so the row is fully visible. */
export function revealInList(list: HTMLElement, row: HTMLElement) {
  const box = list.getBoundingClientRect();
  const r = row.getBoundingClientRect();
  if (r.top < box.top) list.scrollTop -= box.top - r.top + 6;
  else if (r.bottom > box.bottom) list.scrollTop += r.bottom - box.bottom + 6;
}

const TYPING = "input, textarea, select, [contenteditable='true']";

/** `/` anywhere on the page focuses the search box. */
export function useSlashToSearch(search: RefObject<HTMLInputElement | null>) {
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey)
        return;
      const target = event.target as HTMLElement | null;
      if (target?.closest?.(TYPING)) return;
      event.preventDefault();
      search.current?.focus();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [search]);
}

/** ArrowUp / ArrowDown move the selection among the rows currently shown. */
export function useArrowSelection(
  list: RefObject<HTMLElement | null>,
  selected: string | null,
  select: (path: string) => void,
) {
  return (event: React.KeyboardEvent) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    const host = list.current;
    if (!host) return;
    const rows = [...host.querySelectorAll<HTMLElement>('[role="option"]')];
    if (!rows.length) return;
    event.preventDefault();
    const i = rows.findIndex((row) => row.dataset.path === selected);
    const step = event.key === "ArrowDown" ? 1 : -1;
    const next =
      rows[Math.max(0, Math.min(rows.length - 1, i < 0 ? 0 : i + step))];
    select(next.dataset.path!);
    next.focus({ preventScroll: true });
    revealInList(host, next);
  };
}

/** On mount, bring the selected row into view inside the list. */
export function useRevealSelectedOnMount(list: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const host = list.current;
    const row = host?.querySelector<HTMLElement>('[aria-selected="true"]');
    if (host && row) revealInList(host, row);
  }, [list]);
}
