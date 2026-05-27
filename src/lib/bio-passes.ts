import { and, eq, gt, sql } from "drizzle-orm";

import { db } from "@/db";
import { bioPasses } from "@/db/schema";

export const PASS_COOKIE_NAME = "bio_pass";
export const PASS_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 dagen

/** Lookup een pass; geeft null als hij niet bestaat. */
export async function getPass(code: string) {
  const rows = await db
    .select()
    .from(bioPasses)
    .where(eq(bioPasses.code, code.toUpperCase()))
    .limit(1);
  return rows[0] ?? null;
}

/**
 * Atomically reserveer 1 use van de pass. Returns true als het lukte, false als
 * er geen uses meer over zijn of de code niet bestaat.
 */
export async function tryUsePass(code: string): Promise<boolean> {
  const updated = await db
    .update(bioPasses)
    .set({
      uses: sql`${bioPasses.uses} + 1`,
      lastUsedAt: new Date(),
    })
    .where(
      and(
        eq(bioPasses.code, code.toUpperCase()),
        gt(bioPasses.maxUses, bioPasses.uses),
      ),
    )
    .returning({ uses: bioPasses.uses });
  return updated.length > 0;
}

/** Geef een use terug na een mislukte Claude-call. */
export async function refundPass(code: string): Promise<void> {
  await db
    .update(bioPasses)
    .set({ uses: sql`${bioPasses.uses} - 1` })
    .where(
      and(
        eq(bioPasses.code, code.toUpperCase()),
        gt(bioPasses.uses, 0),
      ),
    );
}
