import NextAuth from "next-auth";
import { NextResponse } from "next/server";

import { authConfig } from "@/auth.config";

const { auth } = NextAuth(authConfig);

const PROTECTED_PREFIXES = ["/new", "/result", "/account", "/admin"];

export default auth((req) => {
  const { pathname, search } = req.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
  if (!isProtected) return NextResponse.next();
  if (req.auth) return NextResponse.next();

  const signInUrl = new URL("/signin", req.nextUrl.origin);
  signInUrl.searchParams.set("from", pathname + (search || ""));
  return NextResponse.redirect(signInUrl);
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
