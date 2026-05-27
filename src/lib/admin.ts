function parseEmailList(raw: string | undefined): string[] {
  return (raw ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

/** Whether the given email is in the ADMIN_EMAILS env list (comma-separated). */
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return parseEmailList(process.env.ADMIN_EMAILS).includes(email.toLowerCase());
}

/** Whether the given email is in the COLLECTIVE_EMAILS env list (comma-separated). */
export function isCollectiveEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return parseEmailList(process.env.COLLECTIVE_EMAILS).includes(
    email.toLowerCase(),
  );
}

/** Hoeveel credits een collectief-lid krijgt bij eerste login. Default 1. */
export function collectiveInitialCredits(): number {
  const n = Number(process.env.COLLECTIVE_INITIAL_CREDITS ?? "1");
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 1;
}

/** True if Stripe is configured (used to gate the buy flow in the UI). */
export function isStripeEnabled(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no O/0, I/1

export function generateInviteCode(prefix: string): string {
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  const body = Array.from(bytes, (b) => CODE_ALPHABET[b % CODE_ALPHABET.length]).join("");
  return `${prefix}-${body}`;
}
