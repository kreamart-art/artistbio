import Link from "next/link";
import { Coins } from "lucide-react";

import { auth } from "@/auth";
import { getUserBalance } from "@/lib/credits";

export async function AccountChip() {
  const session = await auth();
  if (!session?.user?.id) {
    return (
      <Link
        href="/signin"
        className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"
      >
        Inloggen
      </Link>
    );
  }
  const { credits } = await getUserBalance(session.user.id);
  return (
    <Link
      href="/account"
      className="group inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/40 px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:border-border hover:text-foreground"
    >
      <Coins className="h-3.5 w-3.5" />
      <span>
        <span className="text-foreground">{credits}</span> credits
      </span>
    </Link>
  );
}
