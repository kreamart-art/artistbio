import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getStrings } from "@/lib/get-locale";

export default function ExpiredPage({
  searchParams,
}: {
  searchParams: { reason?: string };
}) {
  const strings = getStrings();
  const S = strings.expired;
  const depleted = searchParams.reason === "depleted";
  return (
    <main className="container flex min-h-screen max-w-md flex-col items-center justify-center text-center">
      <span className="mb-6 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        ARTISTBIO
      </span>
      <h1 className="display-serif mb-3 text-3xl">
        {depleted ? S.depletedTitle : S.unknownTitle}
      </h1>
      <p className="mb-6 text-muted-foreground">
        {depleted ? S.depletedBody : S.unknownBody}
      </p>
      <Button asChild variant="outline">
        <Link href="/">{S.backHome}</Link>
      </Button>
    </main>
  );
}
