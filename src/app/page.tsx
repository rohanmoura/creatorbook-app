import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  CheckCircle2,
  FileCheck2,
  MousePointerClick,
  Search,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";

import { CreatorCard } from "@/components/marketplace/creator-card";
import { SectionHeader } from "@/components/shared/section-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { categories } from "@/data/mock-categories";
import { creators, getServicesByCreatorId } from "@/data/mock-creators";

const platformStats = [
  ["Verified experts", "148"],
  ["Bookings this month", "1,284"],
  ["Avg response time", "3.2h"],
];

const workflow = [
  {
    icon: Search,
    title: "Discover",
    description: "Search creators by skill, category, price, rating, and availability.",
  },
  {
    icon: CalendarCheck,
    title: "Request",
    description: "Select a service, choose a time, add context, and submit a booking.",
  },
  {
    icon: ShieldCheck,
    title: "Operate",
    description: "Clients, creators, and admins each manage their own workflow.",
  },
];

const roleDashboards = [
  {
    title: "Client workspace",
    href: "/dashboard/client",
    icon: UsersRound,
    metrics: ["Upcoming sessions", "Saved creators", "Booking history"],
  },
  {
    title: "Creator workspace",
    href: "/dashboard/creator",
    icon: CalendarCheck,
    metrics: ["Incoming requests", "Service packages", "Availability"],
  },
  {
    title: "Admin console",
    href: "/dashboard/admin",
    icon: ShieldCheck,
    metrics: ["Approvals", "Reports", "Categories"],
  },
];

export default function Home() {
  const featuredCreators = creators
    .filter((creator) => creator.featured)
    .slice(0, 3);

  return (
    <main>
      <section className="premium-grid border-b">
        <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-[1.05fr_0.95fr] md:items-center md:py-14 lg:px-8">
          <div className="animate-rise flex flex-col justify-center">
            <Badge
              variant="outline"
              className="mb-5 w-fit rounded-md bg-background/80 shadow-sm backdrop-blur"
            >
              <Sparkles className="size-3.5" />
              Multi-role marketplace MVP
            </Badge>
            <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-foreground md:text-7xl">
              CreatorBook
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
              A premium expert booking marketplace where clients discover
              trusted creators, compare service packages, and submit session
              requests in minutes.
            </p>

            <form
              action="/explore"
              className="premium-panel mt-8 flex max-w-2xl flex-col gap-3 rounded-lg p-2 sm:flex-row"
            >
              <label className="flex min-h-12 flex-1 items-center gap-3 px-3">
                <Search className="size-4 text-muted-foreground" />
                <input
                  name="q"
                  placeholder="Search AI automation, UX audits, MVP strategy..."
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </label>
              <Button type="submit" size="lg">
                Browse experts
                <ArrowRight className="size-4" />
              </Button>
            </form>

            <div className="mt-6 flex flex-wrap gap-2 text-sm text-muted-foreground">
              {["Startup Strategy", "UI/UX Design", "AI Automation"].map((item) => (
                <Link
                  key={item}
                  href={`/explore?category=${encodeURIComponent(item)}`}
                  className="rounded-md border bg-background/80 px-3 py-1.5 shadow-sm backdrop-blur transition hover:border-primary/40 hover:text-foreground"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>

          <div className="animate-rise-delay">
            <Card className="shine-surface workflow-scan rounded-lg">
              <CardContent className="p-5">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Live booking workflow
                    </p>
                    <h2 className="mt-1 text-xl font-semibold">
                      Request moving through roles
                    </h2>
                  </div>
                  <Badge className="rounded-md">Loop preview</Badge>
                </div>

                <div className="relative min-h-[360px] rounded-lg border bg-background/65 p-4">
                  <div className="loop-track" />
                  <div className="loop-packet" />

                  <div className="loop-card-1 relative z-10 ml-auto w-[78%] rounded-lg border bg-card/95 p-4 shadow-xl">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="workflow-pulse flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                          <Search className="size-5" />
                        </span>
                        <div>
                          <p className="font-medium">Client discovers expert</p>
                          <p className="text-sm text-muted-foreground">
                            AI Automation • 4.7 rating • This week
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="rounded-md">
                        Explore
                      </Badge>
                    </div>
                  </div>

                  <div className="loop-card-2 relative z-10 mt-5 w-[82%] rounded-lg border bg-card/95 p-4 shadow-xl">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="flex size-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                          <MousePointerClick className="size-5" />
                        </span>
                        <div>
                          <p className="font-medium">Booking request created</p>
                          <p className="text-sm text-muted-foreground">
                            Service selected • Slot chosen • Notes added
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="loop-status rounded-md">
                        Pending
                      </Badge>
                    </div>
                  </div>

                  <div className="loop-card-3 relative z-10 ml-auto mt-5 w-[78%] rounded-lg border bg-card/95 p-4 shadow-xl">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="flex size-10 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
                          <FileCheck2 className="size-5" />
                        </span>
                        <div>
                          <p className="font-medium">Creator reviews request</p>
                          <p className="text-sm text-muted-foreground">
                            Accept • Reschedule • Reject
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="rounded-md">
                        Action
                      </Badge>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-3">
                    {platformStats.map(([label, value]) => (
                      <div
                        key={label}
                        className="rounded-lg border bg-muted/25 p-3 text-center"
                      >
                        <p className="text-lg font-semibold">{value}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="border-b bg-card/50">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-6 sm:px-6 md:grid-cols-3 lg:px-8">
          {workflow.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="premium-card-hover rounded-lg border bg-background/70 p-4"
              >
                <Icon className="mb-3 size-5 text-primary" />
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Popular categories"
          title="Find the right expert faster"
          description="Each category maps to a real service workflow founders and operators buy."
        />
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/explore?category=${encodeURIComponent(category.name)}`}
              className="premium-card-hover rounded-lg border bg-card/90 p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-medium">{category.name}</h3>
                <Badge variant="secondary" className="rounded-md">
                  {category.creatorCount}
                </Badge>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {category.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y bg-[linear-gradient(180deg,oklch(0.97_0.018_236)_0%,oklch(0.99_0.004_236)_100%)]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <SectionHeader
              eyebrow="Featured creators"
              title="Trusted experts ready for booking"
              description="Creator cards show category, service, price, rating, availability, and direct booking actions."
            />
            <Button asChild variant="outline">
              <Link href="/explore">View all creators</Link>
            </Button>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {featuredCreators.map((creator) => {
              const creatorServices = getServicesByCreatorId(creator.id);
              return (
                <CreatorCard
                  key={creator.id}
                  creator={creator}
                  primaryService={creatorServices[0]?.title}
                  serviceCount={creatorServices.length}
                />
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <SectionHeader
            eyebrow="Role dashboards"
            title="Three operational views, one marketplace system"
            description="CreatorBook proves the full workflow after booking: clients track requests, creators respond, and admins moderate platform quality."
          />
          <Button asChild variant="outline">
            <Link href="/dashboard/client">Open dashboard demo</Link>
          </Button>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {roleDashboards.map((dashboard) => {
            const Icon = dashboard.icon;
            return (
              <Link
                key={dashboard.title}
                href={dashboard.href}
                className="premium-card-hover rounded-lg border bg-card/90 p-5"
              >
                <div className="mb-5 flex items-center justify-between gap-3">
                  <span className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </span>
                  <Badge variant="outline" className="rounded-md">
                    Demo
                  </Badge>
                </div>
                <h3 className="text-lg font-semibold">{dashboard.title}</h3>
                <div className="mt-4 grid gap-2">
                  {dashboard.metrics.map((metric) => (
                    <div
                      key={metric}
                      className="flex items-center gap-2 rounded-md border bg-muted/25 px-3 py-2 text-sm text-muted-foreground"
                    >
                      <CheckCircle2 className="size-3.5 text-emerald-600" />
                      {metric}
                    </div>
                  ))}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="premium-panel grid gap-8 rounded-lg p-6 md:grid-cols-[1fr_0.8fr] md:items-center md:p-8">
          <div>
            <Badge variant="secondary" className="mb-4 rounded-md">
              <BadgeCheck className="size-3.5" />
              Product proof for KMAX
            </Badge>
            <h2 className="max-w-3xl text-3xl font-semibold tracking-tight">
              <span className="block">Built to prove marketplace logic,</span>
              <span className="block">not just nice screens.</span>
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              CreatorBook demonstrates discovery, filters, profiles, booking
              statuses, dashboards, creator approvals, reports, and admin
              moderation in one coherent product.
            </p>
          </div>
          <div className="grid gap-3">
            {[
              "Search and filter marketplace supply",
              "Book sessions with pending status flow",
              "Operate client, creator, and admin dashboards",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-lg border bg-background/70 p-3 text-sm"
              >
                <CheckCircle2 className="size-4 text-emerald-600" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
