import Link from "next/link";
import { redirect } from "next/navigation";
import { eq, sql } from "drizzle-orm";

import { auth, signOut } from "@/auth";
import { db } from "@/db";
import { inviteCodes, users } from "@/db/schema";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isAdminEmail, isStripeEnabled } from "@/lib/admin";
import { ensureCollectiveInitialized } from "@/lib/credits";

async function redeemCode(formData: FormData) {
  "use server";
  const session = await auth();
  if (!session?.user) return;
  const raw = String(formData.get("code") ?? "")
    .trim()
    .toUpperCase();
  if (!raw) return;

  const found = await db
    .select()
    .from(inviteCodes)
    .where(eq(inviteCodes.code, raw))
    .limit(1);
  const code = found[0];
  if (!code || code.redeemedBy) return;

  await db.transaction(async (tx) => {
    await tx
      .update(inviteCodes)
      .set({ redeemedBy: session.user.id, redeemedAt: new Date() })
      .where(eq(inviteCodes.code, raw));
    await tx
      .update(users)
      .set({
        credits: sql`${users.credits} + ${code.credits}`,
        isCollective:
          code.type === "collective" ? true : undefined,
      })
      .where(eq(users.id, session.user.id));
  });

  redirect("/account?redeemed=1");
}

export default async function AccountPage({
  searchParams,
}: {
  searchParams: { redeemed?: string; purchased?: string };
}) {
  const session = await auth();
  if (!session?.user) redirect("/signin?from=/account");

  // Auto-grant collectief leden hun initiële credits (idempotent).
  await ensureCollectiveInitialized(session.user.id, session.user.email);

  const row = await db
    .select({
      credits: users.credits,
      isCollective: users.isCollective,
    })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);
  const { credits = 0, isCollective = false } = row[0] ?? {};
  const isAdmin = isAdminEmail(session.user.email);
  const stripeOn = isStripeEnabled();

  return (
    <main className="container max-w-2xl py-10">
      <div className="mb-8 flex items-center justify-between">
        <Link
          href="/"
          className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground"
        >
          ARTISTBIO
        </Link>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <Button variant="ghost" size="sm" type="submit">
            Uitloggen
          </Button>
        </form>
      </div>

      <h1 className="display-serif mb-2 text-3xl">Account</h1>
      <p className="mb-8 text-muted-foreground">{session.user.email}</p>

      {searchParams.purchased === "1" && (
        <div className="mb-6 rounded-md border border-emerald-500/40 bg-emerald-500/5 p-4 text-sm">
          <span className="font-medium text-emerald-500">
            Aankoop gelukt.
          </span>{" "}
          <span className="text-muted-foreground">
            Credits worden binnen enkele seconden toegevoegd — refresh de pagina
            als de balans nog niet bijgewerkt is.
          </span>
        </div>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Credits</CardTitle>
          <CardDescription>
            Eén credit = één bio-generatie. Mislukte generaties tellen niet mee.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="display-serif text-4xl">{credits}</div>
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/new">Nieuwe bio</Link>
            </Button>
            {stripeOn && (
              <Button asChild variant="outline">
                <Link href="/buy">Credits kopen</Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Invite-code inwisselen</CardTitle>
          <CardDescription>
            Heb je een code van het artnomad-collectief? Wissel hem hier in voor
            credits.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {searchParams.redeemed === "1" && (
            <p className="mb-3 text-sm text-emerald-500">
              Code ingewisseld — credits toegevoegd.
            </p>
          )}
          <form action={redeemCode} className="flex gap-2">
            <div className="flex-1 space-y-2">
              <Label htmlFor="code" className="sr-only">
                Code
              </Label>
              <Input
                id="code"
                name="code"
                placeholder="ARTNOMAD-..."
                autoComplete="off"
              />
            </div>
            <Button type="submit">Inwisselen</Button>
          </form>
        </CardContent>
      </Card>

      {(isCollective || isAdmin) && (
        <p className="text-center text-xs text-muted-foreground">
          {isAdmin && (
            <>
              <Link href="/admin" className="underline">
                Admin
              </Link>
              {" · "}
            </>
          )}
          {isCollective && "Lid van het artnomad-collectief"}
        </p>
      )}
    </main>
  );
}
