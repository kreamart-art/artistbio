import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getStrings } from "@/lib/get-locale";

export default function CheckInboxPage() {
  const strings = getStrings();
  const S = strings.checkInbox;
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
          <CardDescription>{S.desc}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>{S.body}</p>
          <Button asChild variant="outline" className="w-full">
            <Link href="/signin">{S.useOther}</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
