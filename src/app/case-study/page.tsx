import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  LayoutDashboard,
  Search,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";

import { SectionHeader } from "@/components/shared/section-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";
import { listBookings } from "@/lib/server/bookings-repository";
import {
  listCategories,
  listCreators,
  listReports,
} from "@/lib/server/marketplace-repository";

const roleFlows = [
  {
    icon: Search,
    title: "Client flow",
    points: [
      "Search and filter experts",
      "Compare profiles, services, ratings, and availability",
      "Submit a pending booking request",
      "Track upcoming and past sessions from the dashboard",
    ],
  },
  {
    icon: UsersRound,
    title: "Creator flow",
    points: [
      "Manage public profile quality",
      "List service packages with price and duration",
      "Review booking requests",
      "Accept, reject, or reschedule client demand",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Admin flow",
    points: [
      "Approve creator supply",
      "Monitor marketplace bookings",
      "Review reports and moderation issues",
      "Manage category taxonomy",
    ],
  },
];

const productProof = [
  "Role-based Auth.js client, creator, and admin access",
  "SQLite-backed marketplace data and booking persistence",
  "Structured availability with held/booked slot states",
  "Stripe test checkout and payment status tracking",
  "In-app notifications across booking and moderation actions",
  "Admin approvals, reports, categories, users, and audit activity",
];

const nextVersion = [
  "Hosted production database such as Turso/LibSQL or Supabase",
  "Google Calendar sync for busy-time reads and confirmed events",
  "Transactional email notifications through Resend or SendGrid",
  "Booking message thread between client and creator",
  "Final production analytics and portfolio demo video",
  "Creator verification and dispute workflows",
];

export const dynamic = "force-dynamic";

export default function CaseStudyPage() {
  const bookings = listBookings();
  const categories = listCategories();
  const creators = listCreators();
  const reports = listReports();
  const approvedCreators = creators.filter(
    (creator) => creator.profileStatus === "approved"
  );
  const pendingCreators = creators.filter(
    (creator) => creator.profileStatus === "pending"
  );
  const revenue = bookings.reduce((total, booking) => total + booking.price, 0);
  const openReports = reports.filter((report) => report.status !== "resolved");

  return (
    <main>
      <section className="premium-grid border-b">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_380px] lg:items-end lg:px-8">
          <div>
            <Badge variant="outline" className="mb-5 w-fit rounded-md bg-background/80">
              <Sparkles className="size-3.5" />
              Portfolio case study
            </Badge>
            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">
              CreatorBook: marketplace MVP for expert discovery and session
              booking
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
              CreatorBook proves that KMAX can plan and build a multi-role
              product with real auth, database-backed workflows, structured
              availability, Stripe test payments, notifications, and admin
              moderation.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/explore">
                  Open live demo
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/dashboard/admin">Review admin workflow</Link>
              </Button>
            </div>
          </div>

          <Card className="rounded-lg bg-background/90 backdrop-blur">
            <CardContent className="grid gap-3 p-5">
              {[
                ["Approved creators", approvedCreators.length],
                ["Pending approvals", pendingCreators.length],
                ["Bookings tracked", bookings.length],
                ["Open reports", openReports.length],
                ["Demo revenue", formatCurrency(revenue)],
                ["Categories", categories.length],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-4 rounded-md border bg-muted/25 px-3 py-2"
                >
                  <span className="text-sm text-muted-foreground">{label}</span>
                  <span className="font-semibold">{value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1fr]">
          <SectionHeader
            eyebrow="Problem"
            title="Expert booking is often trapped in scattered DMs"
            description="Clients need trusted experts, clear services, visible pricing, and a simple booking path. Creators need a professional profile and an operating system for requests, availability, and follow-up."
          />
          <div className="grid gap-3">
            {[
              "Clients cannot compare expertise, pricing, availability, and trust signals quickly.",
              "Creators lose leads when inquiries are spread across social DMs, email, and forms.",
              "Marketplace owners need approval, moderation, booking oversight, and category control.",
            ].map((item) => (
              <div key={item} className="flex gap-3 rounded-lg border bg-card p-4">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                <p className="text-sm leading-6 text-muted-foreground">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y bg-card/55">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Solution"
            title="A complete marketplace workflow, not just a listing page"
            description="The MVP connects discovery, service comparison, booking requests, dashboards, and operator moderation into one coherent demo."
          />
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {roleFlows.map((flow) => {
              const Icon = flow.icon;
              return (
                <Card key={flow.title} className="rounded-lg">
                  <CardContent className="p-5">
                    <Icon className="mb-4 size-6 text-primary" />
                    <h2 className="font-semibold">{flow.title}</h2>
                    <div className="mt-4 grid gap-2">
                      {flow.points.map((point) => (
                        <span
                          key={point}
                          className="rounded-md border bg-muted/25 px-3 py-2 text-sm text-muted-foreground"
                        >
                          {point}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <SectionHeader
              eyebrow="Product proof"
              title="What this project demonstrates"
              description="CreatorBook is positioned as a serious portfolio project for marketplace MVP, booking app, and multi-role SaaS development work."
            />
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {productProof.map((item) => (
                <div key={item} className="rounded-lg border bg-card p-4">
                  <CheckCircle2 className="mb-3 size-4 text-emerald-600" />
                  <p className="text-sm font-medium">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <SectionHeader
              eyebrow="Next version"
              title="How the MVP can become production-ready"
              description="The current build is portfolio-ready. The next layer is production infrastructure, integrations, and operational hardening."
            />
            <div className="mt-6 grid gap-3">
              {nextVersion.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-lg border bg-card p-4 text-sm"
                >
                  <LayoutDashboard className="size-4 shrink-0 text-primary" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="premium-panel grid gap-6 rounded-lg p-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <Badge variant="secondary" className="mb-4 rounded-md">
              <CalendarCheck className="size-3.5" />
              Demo path
            </Badge>
            <h2 className="text-2xl font-semibold tracking-tight">
              Recommended walkthrough for portfolio review
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
              Start from the marketplace home, filter creators, open Aarav
              Mehta, submit a booking request, then review the client, creator,
              and admin dashboards to see the workflow end to end.
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/">
              Start walkthrough
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
