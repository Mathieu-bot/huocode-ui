import type { ReactNode } from "react";

type HardPanelProps = {
  children: ReactNode;
  className?: string;
};

export function HardPanel({ children, className = "" }: HardPanelProps) {
  return (
    <div className={`hard bg-card p-6 sm:p-8 ${className}`}>{children}</div>
  );
}
