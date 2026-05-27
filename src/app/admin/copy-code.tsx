"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";

export function CopyCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success(`Gekopieerd: ${code}`);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Kopiëren niet gelukt.");
    }
  }

  return (
    <button
      onClick={copy}
      className="group inline-flex items-center gap-2 font-mono text-sm tracking-wider transition hover:text-foreground"
      type="button"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-emerald-500" />
      ) : (
        <Copy className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100" />
      )}
      <span>{code}</span>
    </button>
  );
}
