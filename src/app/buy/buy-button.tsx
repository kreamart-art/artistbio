"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export function BuyButton({
  packageKey,
  variant,
}: {
  packageKey: string;
  variant: "default" | "outline";
}) {
  const [loading, setLoading] = useState(false);

  async function buy() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageKey }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Kon checkout niet starten.");
      }
      window.location.href = data.url;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Er ging iets mis.";
      toast.error(message);
      setLoading(false);
    }
  }

  return (
    <Button
      className="w-full"
      variant={variant}
      onClick={buy}
      disabled={loading}
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin" />
          Bezig…
        </>
      ) : (
        "Kies dit pakket"
      )}
    </Button>
  );
}
