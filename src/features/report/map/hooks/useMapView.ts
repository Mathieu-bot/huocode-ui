"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export type MapView = "treemap" | "scatter";

/** Treemap or scatter, kept in `?view=` next to the other query params and the `#file=` hash. */
export function useMapView(
  scatterAllowed: boolean,
): [MapView, (view: MapView) => void] {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const view: MapView =
    scatterAllowed && params.get("view") === "scatter" ? "scatter" : "treemap";

  const setView = useCallback(
    (next: MapView) => {
      const query = new URLSearchParams(window.location.search);
      if (next === "scatter") query.set("view", "scatter");
      else query.delete("view");
      const search = query.toString();
      router.replace(
        `${pathname}${search ? `?${search}` : ""}${window.location.hash}`,
        { scroll: false },
      );
    },
    [router, pathname],
  );

  return [view, setView];
}
