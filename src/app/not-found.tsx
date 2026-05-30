import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 py-12 text-center">
      <h1 className="text-3xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        This route does not exist in the CreatorBook marketplace demo.
      </p>
      <Button asChild className="mt-6">
        <Link href="/explore">Explore creators</Link>
      </Button>
    </main>
  );
}

