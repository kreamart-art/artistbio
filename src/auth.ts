import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
import Resend from "next-auth/providers/resend";

import { authConfig } from "@/auth.config";
import { db } from "@/db";
import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from "@/db/schema";
import { ensureCollectiveInitialized } from "@/lib/credits";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [
    Resend({
      from: process.env.EMAIL_FROM ?? "ArtistBio <onboarding@resend.dev>",
    }),
  ],
  events: {
    async signIn({ user }) {
      if (user.id && user.email) {
        await ensureCollectiveInitialized(user.id, user.email).catch(() => {});
      }
    },
  },
});
