import Link from "next/link";
import { ArrowRight, CalendarCheck, Search, ShieldCheck, Sparkles } from "lucide-react";

import { CreatorCard } from "@/components/marketplace/creator-card";
import { SectionHeader } from "@/components/shared/section-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { categories } from "@/data/mock-categories";
import { creators } from "@/data/mock-creators";

export default function Home() {
  const featuredCreators = creators.filter((creator) => creator.featured).slice(0, 3);

  return (
    <main>
      <section className="border-b bg-[linear-gradient(180deg,#ffffff_0%,#f4faf9_100%)]">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-[1.1fr_0.9fr] md:py-20 lg:px-8">
          <div className="flex flex-col justify-center">
            <Badge variant="outline" className="mb-5 w-fit rounded-md bg-background">
              <Sparkles className="size-3.5" />
              Marketplace MVP for expert booking
            </Badge>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
              CreatorBook
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
              Discover trusted creators, consultants, and operators. Compare
              services, check availability, and book paid strategy sessions from
              one professional marketplace.
            </p>
            <form action="/explore" className="mt-8 flex max-w-2xl flex-col gap-3 rounded-lg border bg-background p-2 shadow-sm sm:flex-row">
              <label className="flex min-h-11 flex-1 items-center gap-3 px-3">
                <Search className="size-4 text-muted-foreground" />
                <input
                  name="q"
                  placeholder="Search creators, skills, or categories"
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
                  className="rounded-md border bg-background px-3 py-1.5 hover:text-foreground"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>

          <div className="grid content-end gap-4">
            <Card className="rounded-lg">
              <CardContent className="grid gap-4 p-4">
                {[
                  ["Verified experts", "148"],
                  ["Bookings this month", "1,284"],
                  ["Avg response time", "3.2h"],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between rounded-lg border bg-muted/30 p-4">
                    <span className="text-sm text-muted-foreground">{label}</span>
                    <span className="text-xl font-semibold">{value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
            <div className="grid grid-cols-2 gap-4">
              <Card className="rounded-lg">
                <CardContent className="p-4">
                  <CalendarCheck className="mb-3 size-5 text-primary" />
                  <p className="text-sm font-medium">Book sessions</p>
                  <p className="mt-1 text-sm text-muted-foreground">Select service, time, and notes.</p>
                </CardContent>
              </Card>
              <Card className="rounded-lg">
                <CardContent className="p-4">
                  <ShieldCheck className="mb-3 size-5 text-primary" />
                  <p className="text-sm font-medium">Admin control</p>
                  <p className="mt-1 text-sm text-muted-foreground">Approve creators and monitor quality.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
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
              className="rounded-lg border bg-card p-4 transition hover:border-primary/40 hover:shadow-sm"
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

      <section className="border-y bg-muted/25">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <SectionHeader
              eyebrow="Featured creators"
              title="Trusted experts ready for booking"
              description="Creator cards show the information clients need before they open a profile."
            />
            <Button asChild variant="outline">
              <Link href="/explore">View all creators</Link>
            </Button>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {featuredCreators.map((creator) => (
              <CreatorCard key={creator.id} creator={creator} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
