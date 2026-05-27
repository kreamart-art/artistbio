import { eq } from "drizzle-orm";

import { auth } from "@/auth";
import { db } from "@/db";
import { purchases, users } from "@/db/schema";
import { getPackage } from "@/lib/credit-packages";
import { isStripeEnabled } from "@/lib/admin";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!isStripeEnabled()) {
    return Response.json(
      { error: "Credits kopen is nog niet beschikbaar." },
      { status: 503 },
    );
  }

  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Niet ingelogd." }, { status: 401 });
  }

  let body: { packageKey?: string };
  try {
    body = (await req.json()) as { packageKey?: string };
  } catch {
    return Response.json({ error: "Ongeldige aanvraag." }, { status: 400 });
  }

  const pkg = getPackage(body.packageKey ?? "");
  if (!pkg) {
    return Response.json({ error: "Onbekend pakket." }, { status: 400 });
  }

  const userRow = await db
    .select({ email: users.email })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);
  const email = userRow[0]?.email ?? session.user.email ?? undefined;

  const origin = process.env.AUTH_URL || new URL(req.url).origin;

  const purchase = await db
    .insert(purchases)
    .values({
      userId: session.user.id,
      packageKey: pkg.key,
      credits: pkg.credits,
      amountCents: pkg.amountCents,
      status: "pending",
    })
    .returning({ id: purchases.id });
  const purchaseId = purchase[0]!.id;

  const checkout = await getStripe().checkout.sessions.create({
    mode: "payment",
    customer_email: email,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: pkg.amountCents,
          product_data: {
            name: `ArtistBio · ${pkg.credits} credits (${pkg.title})`,
            description: pkg.blurb,
          },
        },
      },
    ],
    metadata: {
      userId: session.user.id,
      packageKey: pkg.key,
      credits: String(pkg.credits),
      purchaseId,
    },
    success_url: `${origin}/account?purchased=1`,
    cancel_url: `${origin}/buy?cancelled=1`,
  });

  await db
    .update(purchases)
    .set({ stripeSessionId: checkout.id })
    .where(eq(purchases.id, purchaseId));

  if (!checkout.url) {
    return Response.json(
      { error: "Stripe gaf geen redirect-URL terug." },
      { status: 500 },
    );
  }

  return Response.json({ url: checkout.url });
}
