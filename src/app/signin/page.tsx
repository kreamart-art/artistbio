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

export default async function SignInPage({
  searchParams,
}: {
  searchParams: { from?: string; sent?: string; error?: string };
}) {
  const session = await auth();
  if (session?.user) {
    redirect(searchParams.from || "/account");
  }

  const sent = searchParams.sent === "1";
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
          <CardTitle className="display-serif text-2xl">
            {sent ? "Check je inbox" : "Inloggen of registreren"}
          </CardTitle>
          <CardDescription>
            {sent
              ? "We hebben je een inloglink gestuurd. Open de e-mail om door te gaan."
              : "Vul je e-mailadres in. We sturen je een magic link om in te loggen."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sent ? (
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                Klik op de link in de e-mail om door te gaan naar ArtistBio.
                Geen e-mail ontvangen? Check je spam-map.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/signin">Andere e-mail gebruiken</Link>
              </Button>
            </div>
          ) : (
            <form action={sendLink} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mailadres</Label>
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
                <p className="text-sm text-destructive">
                  Er ging iets mis. Probeer het opnieuw.
                </p>
              )}
              <Button type="submit" className="w-full">
                Stuur magic link
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Door door te gaan ga je akkoord met het gebruik van ArtistBio.
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
