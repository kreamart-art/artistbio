import { and, eq, gt, sql } from "drizzle-orm";

import { db } from "@/db";
import { generations, users } from "@/db/schema";
import {
  collectiveInitialCredits,
  isCollectiveEmail,
} from "@/lib/admin";
import type { Answers, OutputSettings } from "@/lib/types";

/** Atomically deduct one credit. Returns true if successful, false if balance was 0. */
export async function tryDeductCredit(userId: string): Promise<boolean> {
  const updated = await db
    .update(users)
    .set({ credits: sql`${users.credits} - 1` })
    .where(and(eq(users.id, userId), gt(users.credits, 0)))
    .returning({ credits: users.credits });
  return updated.length > 0;
}

/** Refund one credit after a failed generation. */
export async function refundCredit(userId: string): Promise<void> {
  await db
    .update(users)
    .set({ credits: sql`${users.credits} + 1` })
    .where(eq(users.id, userId));
}

/** Get current credit balance + role flags for a user. */
export async function getUserBalance(userId: string) {
  const row = await db
    .select({
      credits: users.credits,
      isAdmin: users.isAdmin,
      isCollective: users.isCollective,
      email: users.email,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  return (
    row[0] ?? {
      credits: 0,
      isAdmin: false,
      isCollective: false,
      email: null,
    }
  );
}

/**
 * Idempotent: als de gebruiker op de COLLECTIVE_EMAILS-lijst staat en nog niet
 * is gemarkeerd als collectief-lid, geef ze het initiële aantal credits en zet
 * de vlag aan. Doet niets als de vlag al staat.
 */
export async function ensureCollectiveInitialized(
  userId: string,
  email: string | null | undefined,
): Promise<void> {
  if (!isCollectiveEmail(email)) return;
  const updated = await db
    .update(users)
    .set({
      isCollective: true,
      credits: sql`${users.credits} + ${collectiveInitialCredits()}`,
    })
    .where(and(eq(users.id, userId), eq(users.isCollective, false)))
    .returning({ id: users.id });
  if (updated.length === 0) return;
}

/** Persist a successful generation. */
export async function saveGeneration(
  userId: string,
  answers: Answers,
  settings: OutputSettings,
  bio: string,
  supplement: string,
): Promise<void> {
  await db.insert(generations).values({
    userId,
    answers,
    settings,
    bio,
    supplement,
  });
}
