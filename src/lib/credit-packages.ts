export interface CreditPackage {
  key: "small" | "standard" | "pro";
  title: string;
  credits: number;
  /** Prijs in eurocenten (Stripe). */
  amountCents: number;
  perCreditCents: number;
  blurb: string;
  recommended?: boolean;
}

export const CREDIT_PACKAGES: CreditPackage[] = [
  {
    key: "small",
    title: "Klein",
    credits: 5,
    amountCents: 300,
    perCreditCents: 60,
    blurb: "Eén bio, zonder veel regenereren.",
  },
  {
    key: "standard",
    title: "Standaard",
    credits: 15,
    amountCents: 700,
    perCreditCents: 47,
    blurb: "Eén bio met ruim experimenteren in toon en lengte.",
    recommended: true,
  },
  {
    key: "pro",
    title: "Pro",
    credits: 50,
    amountCents: 1900,
    perCreditCents: 38,
    blurb: "Voor meerdere bio's of agencies.",
  },
];

export function getPackage(key: string): CreditPackage | undefined {
  return CREDIT_PACKAGES.find((p) => p.key === key);
}

export function formatEuro(cents: number): string {
  return `€${(cents / 100).toFixed(2).replace(".", ",")}`;
}
