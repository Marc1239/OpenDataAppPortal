import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container-page py-24 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-primary">
        404
      </p>
      <h1 className="mt-3 text-4xl md:text-5xl font-[var(--font-display)] font-bold">
        Seite nicht gefunden
      </h1>
      <p className="mt-4 text-muted-foreground max-w-md mx-auto">
        Diese Seite existiert nicht oder wurde verschoben. Finde stattdessen
        Apps im Katalog.
      </p>
      <div className="mt-8 flex items-center justify-center gap-3">
        <Link href="/">
          <Button variant="primary">Zur Startseite</Button>
        </Link>
        <Link href="/apps">
          <Button variant="outline">Apps durchsuchen</Button>
        </Link>
      </div>
    </div>
  );
}
