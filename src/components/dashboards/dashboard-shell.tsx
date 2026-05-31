import Link from "next/link";
import { BarChart3, CalendarDays, ShieldCheck, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DashboardShellProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  active: "client" | "creator" | "admin";
};

const dashboardLinks = [
  { href: "/dashboard/client", label: "Client", key: "client", icon: UserRound },
  { href: "/dashboard/creator", label: "Creator", key: "creator", icon: CalendarDays },
  { href: "/dashboard/admin", label: "Admin", key: "admin", icon: ShieldCheck },
] as const;

export function DashboardShell({
  title,
  description,
  children,
  active,
}: DashboardShellProps) {
  return (
    <main className="mx-auto grid w-full max-w-7xl gap-5 px-4 py-6 sm:px-6 lg:grid-cols-[240px_1fr] lg:gap-6 lg:px-8 lg:py-8">
      <aside className="premium-panel h-fit rounded-lg p-3 lg:sticky lg:top-24">
        <div className="mb-3 flex items-center gap-2 px-2 py-1 text-sm font-medium">
          <BarChart3 className="size-4" />
          Demo roles
        </div>
        <nav className="grid grid-cols-3 gap-1 lg:grid-cols-1">
          {dashboardLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.href}
                asChild
                variant={active === item.key ? "secondary" : "ghost"}
                className={cn(
                  "justify-center text-xs sm:text-sm lg:justify-start",
                  active === item.key && "font-semibold"
                )}
              >
                <Link href={item.href}>
                  <Icon className="size-4" />
                  <span className="lg:hidden">{item.label}</span>
                  <span className="hidden lg:inline">{item.label} dashboard</span>
                </Link>
              </Button>
            );
          })}
        </nav>
      </aside>
      <section className="min-w-0">
        <div className="premium-panel mb-6 rounded-lg p-5">
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            {title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
        {children}
      </section>
    </main>
  );
}
