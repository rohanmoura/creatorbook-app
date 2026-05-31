import Link from "next/link";
import { CalendarCheck, LayoutDashboard, Search, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/explore", label: "Explore" },
  { href: "/dashboard/client", label: "Client" },
  { href: "/dashboard/creator", label: "Creator" },
  { href: "/dashboard/admin", label: "Admin" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b bg-background/85 shadow-[0_10px_30px_rgba(15,23,42,0.05)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-[0_10px_25px_rgba(16,94,150,0.28)]">
            <CalendarCheck className="size-5" />
          </span>
          <span>CreatorBook</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Button key={item.href} asChild variant="ghost" size="sm">
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
            <Link href="/auth/sign-in">
              <ShieldCheck className="size-4" />
              Sign in
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/explore">
              <Search className="size-4" />
              Browse
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon-sm" className="md:hidden">
            <Link href="/dashboard/client" aria-label="Open dashboard">
              <LayoutDashboard className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
