"use client";

import { useEffect, useState } from "react";

/** Current time, refreshed every `ms` while `active` is true. */
export function useNow(active: boolean, ms = 1000): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!active) {
      return;
    }
    const id = window.setInterval(() => setNow(Date.now()), ms);
    return () => window.clearInterval(id);
  }, [active, ms]);
  return now;
}

/** Seconds left before `until` (epoch ms), or 0 once it has passed. */
export function useSecondsLeft(until: number | null): number {
  const now = useNow(until !== null);
  if (until === null) {
    return 0;
  }
  return Math.max(0, Math.ceil((until - now) / 1000));
}
