import { eq, sql } from "drizzle-orm";
import type Stripe from "stripe";

import { db } from "@/db";
import { purchases, users } from "@/db/schema";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return Response.json(
      { error: "STRIPE_WEBHOOK_SECRET niet ingesteld." },
      { status: 500 },
    );
  }

  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return Response.json({ error: "Ontbrekende signature." }, { status: 400 });
  }

  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(raw, sig, secret);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Onbekende fout.";
    return Response.json(
      { error: `Webhook-verificatie mislukt: ${message}` },
      { status: 400 },
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const credits = Number(session.metadata?.credits ?? 0);
    const purchaseId = session.metadata?.purchaseId;

    if (userId && credits > 0 && purchaseId) {
      await db.transaction(async (tx) => {
        const existing = await tx
          .select({ status: purchases.status })
          .from(purchases)
          .where(eq(purchases.id, purchaseId))
          .limit(1);
        if (existing[0]?.status === "completed") return;

        await tx
          .update(purchases)
          .set({
            status: "completed",
            completedAt: new Date(),
          })
          .where(eq(purchases.id, purchaseId));

        await tx
          .update(users)
          .set({ credits: sql`${users.credits} + ${credits}` })
          .where(eq(users.id, userId));
      });
    }
  }

  return Response.json({ received: true });
}
