import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ArrowLeft, Check, Link as LinkIcon } from "lucide-react";
import { desc, sql } from "drizzle-orm";

import { auth } from "@/auth";
import { db } from "@/db";
import { bioPasses, inviteCodes, users } from "@/db/schema";
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

async function createPasses(formData: FormData) {
  "use server";
  const session = await auth();
  if (!isAdminEmail(session?.user?.email)) return;

  const name = String(formData.get("name") || "").trim() || null;
  const maxUses = Math.max(
    1,
    Math.min(20, Number(formData.get("maxUses")) || 1),
  );
  const count = Math.max(1, Math.min(50, Number(formData.get("count")) || 1));
  const prefix = (
    String(formData.get("prefix") || "ARTNOMAD")
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "") || "ARTNOMAD"
  ).slice(0, 16);

  const rows = Array.from({ length: count }, () => ({
    code: generateInviteCode(prefix),
    maxUses,
    name: count === 1 ? name : null,
  }));

  await db.insert(bioPasses).values(rows);
  redirect(`/admin?passes=${count}`);
}

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
  const prefix = (
    String(formData.get("prefix") || "ARTNOMAD")
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "") || "ARTNOMAD"
  ).slice(0, 16);
  const note = String(formData.get("note") || "").trim() || null;

  const rows = Array.from({ length: count }, () => ({
    code: generateInviteCode(prefix),
    credits,
    type,
    note,
  }));

  await db.insert(inviteCodes).values(rows);
  redirect(`/admin?codes=${count}`);
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { passes?: string; codes?: string };
}) {
  const session = await auth();
  if (!session?.user) redirect("/signin?from=/admin");
  if (!isAdminEmail(session.user.email)) redirect("/account");

  const h = headers();
  const host = h.get("host") ?? "localhost:5260";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  const [stats] = await db
    .select({
      totalUsers: sql<number>`(select count(*) from "user")::int`,
      totalGenerations: sql<number>`(select count(*) from generation)::int`,
      totalPasses: sql<number>`(select count(*) from bio_pass)::int`,
      usedPasses: sql<number>`(select count(*) from bio_pass where uses >= max_uses)::int`,
      totalCodes: sql<number>`(select count(*) from invite_code)::int`,
    })
    .from(users)
    .limit(1);

  const recentPasses = await db
    .select()
    .from(bioPasses)
    .orderBy(desc(bioPasses.createdAt))
    .limit(50);

  const recentCodes = await db
    .select()
    .from(inviteCodes)
    .orderBy(desc(inviteCodes.createdAt))
    .limit(20);

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
        Maak persoonlijke links voor leden van het artnomad-collectief.
      </p>

      <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: "Gebruikers", value: stats?.totalUsers ?? 0 },
          { label: "Generaties", value: stats?.totalGenerations ?? 0 },
          {
            label: "Links (gebruikt)",
            value: `${stats?.usedPasses ?? 0} / ${stats?.totalPasses ?? 0}`,
          },
          { label: "Invite-codes", value: stats?.totalCodes ?? 0 },
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
          <CardTitle className="text-base">Persoonlijke link aanmaken</CardTitle>
          <CardDescription>
            Voor leden zonder account. Ontvanger klikt de link → krijgt direct
            toegang tot de bio-flow. Geen e-mail, geen login.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action={createPasses}
            className="grid gap-4 md:grid-cols-[1fr_auto_auto_auto]"
          >
            <div className="space-y-2">
              <Label htmlFor="name">Naam (optioneel, intern)</Label>
              <Input
                id="name"
                name="name"
                placeholder="bv. Voor Sanne"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prefix">Prefix</Label>
              <Input
                id="prefix"
                name="prefix"
                defaultValue="ARTNOMAD"
                maxLength={16}
                className="w-32"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxUses">Generaties</Label>
              <Input
                id="maxUses"
                name="maxUses"
                type="number"
                defaultValue="1"
                min={1}
                max={20}
                className="w-24"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="count">Aantal</Label>
              <Input
                id="count"
                name="count"
                type="number"
                defaultValue="1"
                min={1}
                max={50}
                className="w-24"
              />
            </div>
            <div className="md:col-span-4 md:justify-self-end">
              <Button type="submit">Aanmaken</Button>
            </div>
          </form>

          {searchParams.passes && (
            <div className="mt-4 flex items-center gap-2 rounded-md border border-emerald-500/40 bg-emerald-500/5 p-3 text-sm text-emerald-500">
              <Check className="h-4 w-4" />
              <span>
                {searchParams.passes} link(s) aangemaakt — scroll naar beneden om
                ze te kopiëren.
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-base">Persoonlijke links</CardTitle>
          <CardDescription>
            Klik op een link om hem te kopiëren. Stuur naar het juiste lid via
            WhatsApp, DM of e-mail.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentPasses.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nog geen links aangemaakt.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {recentPasses.map((p) => {
                const url = `${baseUrl}/start/${p.code}`;
                const depleted = p.uses >= p.maxUses;
                return (
                  <li
                    key={p.code}
                    className="flex flex-col gap-1 py-3 text-sm sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <LinkIcon className="h-3.5 w-3.5 shrink-0 opacity-60" />
                      <CopyCode code={url} />
                    </div>
                    <div className="ml-6 flex shrink-0 items-center gap-3 text-xs text-muted-foreground sm:ml-0">
                      {p.name && (
                        <span className="italic">{p.name}</span>
                      )}
                      <span>
                        {p.uses} / {p.maxUses}
                      </span>
                      {depleted ? (
                        <span className="rounded-full border border-border px-2 py-0.5 text-muted-foreground">
                          op
                        </span>
                      ) : (
                        <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-emerald-500">
                          actief
                        </span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Invite-codes (voor later, niet actief)
          </CardTitle>
          <CardDescription>
            Codes die in een ingelogde account worden ingewisseld voor credits.
            Wordt straks gebruikt wanneer Resend-domein en/of Stripe live zijn.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action={createCodes}
            className="grid gap-4 md:grid-cols-[1fr_1fr_1fr_auto]"
          >
            <div className="space-y-2">
              <Label htmlFor="ic-prefix">Prefix</Label>
              <Input
                id="ic-prefix"
                name="prefix"
                defaultValue="ARTNOMAD"
                maxLength={16}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ic-count">Aantal</Label>
              <Input
                id="ic-count"
                name="count"
                type="number"
                defaultValue="10"
                min={1}
                max={100}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ic-credits">Credits / code</Label>
              <Input
                id="ic-credits"
                name="credits"
                type="number"
                defaultValue="1"
                min={1}
                max={50}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ic-type">Type</Label>
              <select
                id="ic-type"
                name="type"
                defaultValue="collective"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="collective">collective</option>
                <option value="promo">promo</option>
              </select>
            </div>
            <div className="space-y-2 md:col-span-3">
              <Label htmlFor="ic-note">Notitie (intern, optioneel)</Label>
              <Input
                id="ic-note"
                name="note"
                placeholder="bv. batch maart 2026"
              />
            </div>
            <div className="flex items-end">
              <Button type="submit" variant="outline" className="w-full">
                Aanmaken
              </Button>
            </div>
          </form>

          {searchParams.codes && (
            <div className="mt-4 flex items-center gap-2 rounded-md border border-emerald-500/40 bg-emerald-500/5 p-3 text-sm text-emerald-500">
              <Check className="h-4 w-4" />
              <span>{searchParams.codes} code(s) aangemaakt.</span>
            </div>
          )}

          {recentCodes.length > 0 && (
            <ul className="mt-6 divide-y divide-border">
              {recentCodes.map((c) => (
                <li
                  key={c.code}
                  className="flex items-center justify-between gap-4 py-2.5 text-sm"
                >
                  <CopyCode code={c.code} />
                  <div className="flex shrink-0 items-center gap-3 text-xs text-muted-foreground">
                    <span>{c.credits} cr</span>
                    {c.redeemedBy ? (
                      <span className="text-emerald-500">ingewisseld</span>
                    ) : (
                      <span>open</span>
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
