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
    <main className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[240px_1fr] lg:px-8">
      <aside className="h-fit rounded-lg border bg-card p-3">
        <div className="mb-3 flex items-center gap-2 px-2 py-1 text-sm font-medium">
          <BarChart3 className="size-4" />
          Demo roles
        </div>
        <nav className="grid gap-1">
          {dashboardLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.href}
                asChild
                variant={active === item.key ? "secondary" : "ghost"}
                className={cn("justify-start", active === item.key && "font-semibold")}
              >
                <Link href={item.href}>
                  <Icon className="size-4" />
                  {item.label} dashboard
                </Link>
              </Button>
            );
          })}
        </nav>
      </aside>
      <section className="min-w-0">
        <div className="mb-6">
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

