import Link from "next/link";

export function AppFooter() {
  return (
    <footer className="border-t bg-muted/20">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-sm text-muted-foreground sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <p>CreatorBook is a KMAX marketplace MVP case study.</p>
        <div className="flex gap-4">
          <Link href="/explore" className="hover:text-foreground">
            Explore creators
          </Link>
          <Link href="/dashboard/admin" className="hover:text-foreground">
            Admin demo
          </Link>
        </div>
      </div>
    </footer>
  );
}

