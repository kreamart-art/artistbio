import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function ExpiredPage({
  searchParams,
}: {
  searchParams: { reason?: string };
}) {
  const depleted = searchParams.reason === "depleted";
  return (
    <main className="container flex min-h-screen max-w-md flex-col items-center justify-center text-center">
      <span className="mb-6 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        ARTISTBIO
      </span>
      <h1 className="display-serif mb-3 text-3xl">
        {depleted ? "Link is op" : "Link werkt niet"}
      </h1>
      <p className="mb-6 text-muted-foreground">
        {depleted
          ? "Deze persoonlijke link is al gebruikt. Vraag het artnomad-collectief om een nieuwe."
          : "We konden deze link niet vinden. Controleer of je de juiste link hebt gekopieerd."}
      </p>
      <Button asChild variant="outline">
        <Link href="/">Terug naar de homepage</Link>
      </Button>
    </main>
  );
}
