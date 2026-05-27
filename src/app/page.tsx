import { cookies } from "next/headers";
import Link from "next/link";
import { ArrowRight, FileText, ListChecks, Sparkles } from "lucide-react";

import { auth } from "@/auth";
import { AccountChip } from "@/components/account-chip";
import { LocaleToggle } from "@/components/locale-toggle";
import { Button } from "@/components/ui/button";
import { PASS_COOKIE_NAME } from "@/lib/bio-passes";
import { getLocale, getStrings } from "@/lib/get-locale";

export default async function HomePage() {
  const locale = getLocale();
  const strings = getStrings();
  const L = strings.landing;

  const session = await auth();
  const hasPass = Boolean(cookies().get(PASS_COOKIE_NAME)?.value);
  const hasAccess = Boolean(session?.user) || hasPass;

  const steps = [
    { icon: ListChecks, title: L.step1Title, body: L.step1Body },
    { icon: Sparkles, title: L.step2Title, body: L.step2Body },
    { icon: FileText, title: L.step3Title, body: L.step3Body },
  ];

  return (
    <main className="relative flex min-h-screen flex-col">
      <header className="container flex items-center justify-between py-6">
        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          ArtistBio
        </span>
        <div className="flex items-center gap-3">
          <LocaleToggle current={locale} />
          <AccountChip />
        </div>
      </header>

      <section className="bg-grain flex flex-1 items-center">
        <div className="container grid items-center gap-12 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
          <div className="space-y-8">
            <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">
              {L.tag}
            </p>
            <h1 className="display-serif text-balance text-5xl leading-[1.05] sm:text-6xl lg:text-7xl">
              {L.headlinePre}{" "}
              <span className="italic text-muted-foreground">
                {L.headlineEm}
              </span>
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground">{L.sub}</p>
            {hasAccess ? (
              <div className="flex flex-wrap items-center gap-4">
                <Button asChild size="lg">
                  <Link href="/new">
                    {L.cta}
                    <ArrowRight />
                  </Link>
                </Button>
                <span className="text-sm text-muted-foreground">
                  {L.ctaSub}
                </span>
              </div>
            ) : (
              <div className="max-w-md rounded-lg border border-border bg-card/40 p-5">
                <p className="text-sm font-medium">{L.noLinkTitle}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {L.noLinkBody}
                </p>
              </div>
            )}
          </div>

          <ol className="space-y-4">
            {steps.map((step, i) => (
              <li
                key={step.title}
                className="flex gap-4 rounded-lg border border-border bg-card/60 p-5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-secondary text-foreground">
                  <step.icon className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <p className="font-medium">
                    <span className="mr-2 text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {step.title}
                  </p>
                  <p className="text-sm text-muted-foreground">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}
