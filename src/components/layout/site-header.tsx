import Link from "next/link";
import { CalendarCheck, Search } from "lucide-react";

import { AuthStatus } from "@/components/auth/auth-status";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/explore", label: "Explore" },
  { href: "/case-study", label: "Case study" },
];

export async function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b bg-background/85 shadow-[0_10px_30px_rgba(15,23,42,0.05)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-2 font-semibold">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-[0_10px_25px_rgba(16,94,150,0.28)]">
            <CalendarCheck className="size-5" />
          </span>
          <span className="truncate">CreatorBook</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Button key={item.href} asChild variant="ghost" size="sm">
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <AuthStatus />
          <Button asChild size="sm">
            <Link href="/explore">
              <Search className="size-4" />
              <span className="hidden sm:inline">Browse</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
