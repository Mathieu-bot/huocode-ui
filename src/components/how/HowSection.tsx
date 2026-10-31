import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  id: string;
  icon: LucideIcon;
  heading: string;
  body: string;
  children?: ReactNode;
};

export function HowSection({ id, icon: Icon, heading, body, children }: Props) {
  return (
    <section aria-labelledby={id}>
      <h2
        id={id}
        className="mt-10 mb-2 flex items-center gap-2.5 text-[26px] leading-tight font-bold tracking-[-0.02em]"
      >
        <Icon
          size={22}
          strokeWidth={1.5}
          className="shrink-0 text-garnet"
          aria-hidden
        />
        {heading}
      </h2>
      <p className="max-w-[65ch] text-[17px] text-ink-2">{body}</p>
      {children}
    </section>
  );
}
