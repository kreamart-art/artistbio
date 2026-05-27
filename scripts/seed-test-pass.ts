/**
 * One-off helper: maakt een test bio-pass aan met 1 generatie.
 * Gebruik: `npx tsx scripts/seed-test-pass.ts`
 */
import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import { bioPasses } from "../src/db/schema";

async function main() {
  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql);

  const code = `TEST-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  await db.insert(bioPasses).values({
    code,
    maxUses: 1,
    name: "Test pass voor lokaal gebruik",
  });

  console.log(`Test pass aangemaakt:`);
  console.log(`  Code:  ${code}`);
  console.log(`  URL:   http://localhost:5260/start/${code}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
