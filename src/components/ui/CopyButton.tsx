"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "./Button";

export function CopyButton({
  text,
  label,
  done,
}: {
  text: string;
  label: string;
  done: string;
}) {
  const [copied, setCopied] = useState(false);
  async function onClick() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  }
  return (
    <Button variant="line" size="sm" onClick={onClick} aria-live="polite">
      {copied ? (
        <Check size={15} strokeWidth={1.5} aria-hidden />
      ) : (
        <Copy size={15} strokeWidth={1.5} aria-hidden />
      )}
      {copied ? done : label}
    </Button>
  );
}
