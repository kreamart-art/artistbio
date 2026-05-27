import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CheckInboxPage() {
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
            Check je inbox
          </CardTitle>
          <CardDescription>
            We hebben je een inloglink gestuurd. Open de e-mail om door te gaan.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>
            Klik op de link in de e-mail om door te gaan naar ArtistBio. Geen
            e-mail ontvangen? Check je spam-map.
          </p>
          <Button asChild variant="outline" className="w-full">
            <Link href="/signin">Andere e-mail gebruiken</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
