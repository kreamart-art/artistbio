import NextAuth from "next-auth";
import { NextResponse } from "next/server";

import { authConfig } from "@/auth.config";
import { PASS_COOKIE_NAME } from "@/lib/bio-passes";

const { auth } = NextAuth(authConfig);

const AUTH_ONLY_PREFIXES = ["/account", "/admin"];
const PASS_OR_AUTH_PREFIXES = ["/new", "/result"];

export default auth((req) => {
  const { pathname, search } = req.nextUrl;
  const isAuthOnly = AUTH_ONLY_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
  const isPassOrAuth = PASS_OR_AUTH_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
  if (!isAuthOnly && !isPassOrAuth) return NextResponse.next();

  const isAuthed = Boolean(req.auth);
  const hasPass = Boolean(req.cookies.get(PASS_COOKIE_NAME)?.value);

  if (isAuthOnly && !isAuthed) {
    const signInUrl = new URL("/signin", req.nextUrl.origin);
    signInUrl.searchParams.set("from", pathname + (search || ""));
    return NextResponse.redirect(signInUrl);
  }

  if (isPassOrAuth && !isAuthed && !hasPass) {
    return NextResponse.redirect(new URL("/", req.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
