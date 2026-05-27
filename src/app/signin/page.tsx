import Link from "next/link";
import { redirect } from "next/navigation";

import { signIn, auth } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getStrings } from "@/lib/get-locale";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: { from?: string; error?: string };
}) {
  const session = await auth();
  if (session?.user) {
    redirect(searchParams.from || "/account");
  }

  const strings = getStrings();
  const S = strings.signinPage;
  const error = searchParams.error;

  async function sendLink(formData: FormData) {
    "use server";
    const email = String(formData.get("email") ?? "").trim();
    if (!email) return;
    await signIn("resend", {
      email,
      redirectTo: searchParams.from || "/account",
    });
  }

  return (
    <main className="container flex min-h-screen max-w-md flex-col items-center justify-center py-12">
      <Link
        href="/"
        className="mb-8 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground"
      >
        ARTISTBIO
      </Link>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="display-serif text-2xl">{S.title}</CardTitle>
          <CardDescription>{S.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={sendLink} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{S.emailLabel}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                autoFocus
                placeholder="jij@voorbeeld.nl"
              />
            </div>
            {error && (
              <p className="text-sm text-destructive">{S.genericError}</p>
            )}
            <Button type="submit" className="w-full">
              {S.submit}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              {S.legalNote}
            </p>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
