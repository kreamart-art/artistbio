import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import { desc, sql } from "drizzle-orm";

import { auth } from "@/auth";
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
import { generateInviteCode, isAdminEmail } from "@/lib/admin";

import { CopyCode } from "./copy-code";

async function createCodes(formData: FormData) {
  "use server";
  const session = await auth();
  if (!isAdminEmail(session?.user?.email)) return;

  const count = Math.max(
    1,
    Math.min(100, Number(formData.get("count")) || 1),
  );
  const credits = Math.max(
    1,
    Math.min(50, Number(formData.get("credits")) || 1),
  );
  const type = (String(formData.get("type") || "collective") === "promo"
    ? "promo"
    : "collective") as "promo" | "collective";
  const prefix = (String(formData.get("prefix") || "ARTNOMAD")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "") || "ARTNOMAD").slice(0, 16);
  const note = String(formData.get("note") || "").trim() || null;

  const rows = Array.from({ length: count }, () => ({
    code: generateInviteCode(prefix),
    credits,
    type,
    note,
  }));

  await db.insert(inviteCodes).values(rows);
  redirect(`/admin?created=${count}`);
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { created?: string };
}) {
  const session = await auth();
  if (!session?.user) redirect("/signin?from=/admin");
  if (!isAdminEmail(session.user.email)) redirect("/account");

  const [stats] = await db
    .select({
      totalUsers: sql<number>`(select count(*) from "user")::int`,
      totalCollective: sql<number>`(select count(*) from "user" where "isCollective" = true)::int`,
      totalGenerations: sql<number>`(select count(*) from generation)::int`,
      totalCodes: sql<number>`(select count(*) from invite_code)::int`,
      redeemedCodes: sql<number>`(select count(*) from invite_code where redeemed_by is not null)::int`,
      creditsOutstanding: sql<number>`(select coalesce(sum(credits), 0) from "user")::int`,
    })
    .from(users)
    .limit(1);

  const recent = await db
    .select()
    .from(inviteCodes)
    .orderBy(desc(inviteCodes.createdAt))
    .limit(50);

  return (
    <main className="container max-w-4xl py-10">
      <div className="mb-8 flex items-center justify-between">
        <Button asChild variant="ghost" size="sm">
          <Link href="/account">
            <ArrowLeft />
            Terug naar account
          </Link>
        </Button>
        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          ARTISTBIO ADMIN
        </span>
      </div>

      <h1 className="display-serif mb-2 text-3xl">Admin</h1>
      <p className="mb-8 text-muted-foreground">
        Maak invite-codes voor het artnomad-collectief en bekijk gebruik.
      </p>

      <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: "Gebruikers", value: stats?.totalUsers ?? 0 },
          { label: "Collectief", value: stats?.totalCollective ?? 0 },
          { label: "Generaties", value: stats?.totalGenerations ?? 0 },
          {
            label: "Codes (ingewisseld)",
            value: `${stats?.redeemedCodes ?? 0} / ${stats?.totalCodes ?? 0}`,
          },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-md border border-border bg-card/40 p-4"
          >
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              {s.label}
            </p>
            <p className="display-serif mt-1 text-2xl">{s.value}</p>
          </div>
        ))}
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-base">Codes aanmaken</CardTitle>
          <CardDescription>
            Per gegenereerde code krijgt de inwisselaar het opgegeven aantal
            credits. "Collective" markeert de gebruiker ook als artnomad-lid.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action={createCodes}
            className="grid gap-4 md:grid-cols-[1fr_1fr_1fr_auto]"
          >
            <div className="space-y-2">
              <Label htmlFor="prefix">Prefix</Label>
              <Input
                id="prefix"
                name="prefix"
                defaultValue="ARTNOMAD"
                maxLength={16}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="count">Aantal codes</Label>
              <Input
                id="count"
                name="count"
                type="number"
                defaultValue="10"
                min={1}
                max={100}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="credits">Credits per code</Label>
              <Input
                id="credits"
                name="credits"
                type="number"
                defaultValue="1"
                min={1}
                max={50}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <select
                id="type"
                name="type"
                defaultValue="collective"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="collective">collective</option>
                <option value="promo">promo</option>
              </select>
            </div>
            <div className="space-y-2 md:col-span-3">
              <Label htmlFor="note">Notitie (intern, optioneel)</Label>
              <Input
                id="note"
                name="note"
                placeholder="bv. batch maart 2026"
              />
            </div>
            <div className="flex items-end">
              <Button type="submit" className="w-full">
                Aanmaken
              </Button>
            </div>
          </form>

          {searchParams.created && (
            <div className="mt-4 flex items-center gap-2 rounded-md border border-emerald-500/40 bg-emerald-500/5 p-3 text-sm text-emerald-500">
              <Check className="h-4 w-4" />
              <span>
                {searchParams.created} code(s) aangemaakt. Scroll naar beneden om
                ze te kopiëren.
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recente codes</CardTitle>
          <CardDescription>
            Klik op een code om hem naar je klembord te kopiëren.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recent.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nog geen codes aangemaakt.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {recent.map((c) => (
                <li
                  key={c.code}
                  className="flex items-center justify-between gap-4 py-2.5 text-sm"
                >
                  <CopyCode code={c.code} />
                  <div className="flex shrink-0 items-center gap-3 text-xs text-muted-foreground">
                    <span>{c.credits} cr</span>
                    <span className="rounded-full border border-border px-2 py-0.5">
                      {c.type}
                    </span>
                    {c.redeemedBy ? (
                      <span className="text-emerald-500">ingewisseld</span>
                    ) : (
                      <span className="text-muted-foreground">open</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
