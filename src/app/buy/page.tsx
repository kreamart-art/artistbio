import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";

import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CREDIT_PACKAGES,
  formatEuro,
} from "@/lib/credit-packages";
import { BuyButton } from "./buy-button";

export default async function BuyPage({
  searchParams,
}: {
  searchParams: { cancelled?: string };
}) {
  const session = await auth();
  if (!session?.user) redirect("/signin?from=/buy");

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
          ARTISTBIO
        </span>
      </div>

      <h1 className="display-serif mb-2 text-3xl">Credits kopen</h1>
      <p className="mb-8 text-muted-foreground">
        Eén credit = één bio-generatie. Mislukte generaties worden automatisch
        teruggegeven.
      </p>

      {searchParams.cancelled === "1" && (
        <div className="mb-6 rounded-md border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
          Aankoop geannuleerd — er is niets afgeschreven.
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        {CREDIT_PACKAGES.map((pkg) => (
          <Card
            key={pkg.key}
            className={
              pkg.recommended
                ? "relative border-foreground/40"
                : "relative"
            }
          >
            {pkg.recommended && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-foreground px-3 py-1 text-xs font-semibold uppercase tracking-wider text-background">
                Aanbevolen
              </span>
            )}
            <CardHeader>
              <CardTitle className="text-base">{pkg.title}</CardTitle>
              <CardDescription>{pkg.blurb}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="display-serif text-4xl">
                  {formatEuro(pkg.amountCents)}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatEuro(pkg.perCreditCents)} per credit
                </p>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
                  <span>
                    <span className="font-medium">{pkg.credits}</span> credits
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
                  <span>Refund bij Claude-fout</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
                  <span>Geen abonnement</span>
                </li>
              </ul>
              <BuyButton
                packageKey={pkg.key}
                variant={pkg.recommended ? "default" : "outline"}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        Betalingen worden veilig verwerkt door Stripe. Iban, creditcard, en
        iDEAL beschikbaar.
      </p>
    </main>
  );
}
