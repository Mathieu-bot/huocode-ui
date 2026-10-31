import type { KeyboardEvent } from "react";

/** Enter or Space runs the action, like a native button. */
export function onActivate(action: () => void) {
  return (event: KeyboardEvent) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    action();
  };
}
