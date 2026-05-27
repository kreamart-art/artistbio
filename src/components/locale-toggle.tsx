"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import type { Locale } from "@/lib/i18n";

export function LocaleToggle({ current }: { current: Locale }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function setLocale(next: Locale) {
    if (next === current || pending) return;
    startTransition(async () => {
      await fetch("/api/locale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale: next }),
      });
      router.refresh();
    });
  }

  return (
    <div
      role="group"
      aria-label="Taal kiezen"
      className="inline-flex items-center gap-0.5 rounded-full border border-border bg-background/40 p-0.5 text-xs"
    >
      {(["nl", "en"] as const).map((loc) => {
        const active = loc === current;
        return (
          <button
            key={loc}
            type="button"
            onClick={() => setLocale(loc)}
            aria-pressed={active}
            disabled={pending}
            className={`rounded-full px-2 py-0.5 uppercase tracking-wider transition ${
              active
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {loc}
          </button>
        );
      })}
    </div>
  );
}
