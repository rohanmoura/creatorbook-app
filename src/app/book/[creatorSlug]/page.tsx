import Link from "next/link";
import { notFound } from "next/navigation";

import { SectionHeader } from "@/components/shared/section-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { getCreatorBySlug, getServicesByCreatorId } from "@/data/mock-creators";
import { formatCurrency, formatDuration } from "@/lib/formatters";

type BookingPageProps = {
  params: Promise<{ creatorSlug: string }>;
};

export default async function BookingPage({ params }: BookingPageProps) {
  const { creatorSlug } = await params;
  const creator = getCreatorBySlug(creatorSlug);

  if (!creator) {
    notFound();
  }

  const creatorServices = getServicesByCreatorId(creator.id);

  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
      <section className="min-w-0">
        <SectionHeader
          eyebrow="Booking flow"
          title={`Book a session with ${creator.name}`}
          description="This mock booking flow captures service choice, preferred time, client notes, and confirmation."
        />

        <form action="/booking/success" className="mt-8 grid gap-6">
          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle>Select service</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              {creatorServices.map((service, index) => (
                <label
                  key={service.id}
                  className="flex cursor-pointer gap-3 rounded-lg border p-4 hover:border-primary/40"
                >
                  <input
                    type="radio"
                    name="service"
                    value={service.id}
                    defaultChecked={index === 0}
                    className="mt-1"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium">{service.title}</span>
                    <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                      {service.description}
                    </span>
                    <span className="mt-3 flex flex-wrap gap-2">
                      <Badge variant="outline" className="rounded-md">
                        {formatDuration(service.duration)}
                      </Badge>
                      <Badge variant="outline" className="rounded-md">
                        {formatCurrency(service.price)}
                      </Badge>
                    </span>
                  </span>
                </label>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle>Choose date and time</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm">
                Date
                <input
                  required
                  type="date"
                  name="date"
                  defaultValue="2026-06-03"
                  className="h-10 rounded-md border bg-background px-3 outline-none focus:ring-2 focus:ring-ring/30"
                />
              </label>
              <label className="grid gap-2 text-sm">
                Time
                <select
                  name="time"
                  className="h-10 rounded-md border bg-background px-3 outline-none focus:ring-2 focus:ring-ring/30"
                >
                  <option>10:30 AM</option>
                  <option>2:00 PM</option>
                  <option>5:30 PM</option>
                </select>
              </label>
            </CardContent>
          </Card>

          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle>Client notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                name="notes"
                placeholder="Share what you need help with, links, context, and desired outcome."
                className="min-h-32"
              />
            </CardContent>
          </Card>

          <Button type="submit" size="lg" className="w-fit">
            Submit booking request
          </Button>
        </form>
      </section>

      <aside className="h-fit rounded-lg border bg-card p-5">
        <p className="text-sm text-muted-foreground">Booking summary</p>
        <h2 className="mt-2 text-xl font-semibold">{creator.name}</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {creator.category} expert. Requests stay pending until accepted by the
          creator.
        </p>
        <div className="mt-5 grid gap-3 text-sm">
          <div className="flex justify-between gap-3">
            <span className="text-muted-foreground">Starting price</span>
            <span className="font-medium">{formatCurrency(creator.priceFrom)}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-muted-foreground">Availability</span>
            <span className="font-medium">{creator.availabilityLabel}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-muted-foreground">Status</span>
            <span className="font-medium">Pending approval</span>
          </div>
        </div>
        <Button asChild variant="outline" className="mt-5 w-full">
          <Link href={`/creators/${creator.slug}`}>Back to profile</Link>
        </Button>
      </aside>
    </main>
  );
}

