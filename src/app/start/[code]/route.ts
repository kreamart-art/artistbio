import { NextResponse } from "next/server";

import {
  PASS_COOKIE_MAX_AGE,
  PASS_COOKIE_NAME,
  getPass,
} from "@/lib/bio-passes";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: { code: string } },
) {
  const code = (params.code || "").toUpperCase();
  const origin = new URL(req.url).origin;

  const pass = await getPass(code);
  if (!pass) {
    return NextResponse.redirect(new URL("/expired?reason=unknown", origin));
  }
  if (pass.uses >= pass.maxUses) {
    return NextResponse.redirect(new URL("/expired?reason=depleted", origin));
  }

  const res = NextResponse.redirect(new URL("/new", origin));
  res.cookies.set(PASS_COOKIE_NAME, code, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: PASS_COOKIE_MAX_AGE,
  });
  return res;
}
