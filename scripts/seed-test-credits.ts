/**
 * One-off helper: maakt een test invite-code aan met 5 credits.
 * Gebruik: `npx tsx scripts/seed-test-credits.ts`
 */
import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import { inviteCodes } from "../src/db/schema";

async function main() {
  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql);

  const code = `TEST-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  await db.insert(inviteCodes).values({
    code,
    credits: 5,
    type: "promo",
    note: "Test code voor lokaal gebruik",
  });

  console.log(`Test code aangemaakt: ${code} (5 credits)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
