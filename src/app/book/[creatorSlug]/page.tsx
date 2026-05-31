import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, CheckCircle2, Clock3 } from "lucide-react";

import { BookingStepper } from "@/components/booking/booking-stepper";
import { BookingSummaryCard } from "@/components/booking/booking-summary-card";
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
  const selectedService = creatorServices[0];

  return (
    <main>
      <section className="premium-grid border-b">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <Button asChild variant="outline" size="sm" className="mb-6 bg-background">
            <Link href={`/creators/${creator.slug}`}>
              <ArrowLeft className="size-4" />
              Back to profile
            </Link>
          </Button>
          <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-end">
            <SectionHeader
              eyebrow="Booking flow"
              title={`Request a session with ${creator.name}`}
              description="Select a service package, choose a preferred time, add useful context, and submit a pending booking request."
            />
            <Card className="rounded-lg">
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">Creator response</p>
                <p className="mt-2 text-xl font-semibold">{creator.responseTime}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Requests can be accepted, rejected, or rescheduled from the
                  creator dashboard.
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="mt-6">
            <BookingStepper currentStep={3} />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
        <form action="/booking/success" className="grid gap-6">
          <Card className="rounded-lg">
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <CardTitle>Select service</CardTitle>
                <Badge variant="secondary" className="rounded-md">
                  Step 1
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="grid gap-3">
              {creatorServices.map((service, index) => (
                <label
                  key={service.id}
                  className="grid cursor-pointer gap-4 rounded-lg border p-4 transition hover:border-primary/40 has-checked:border-primary has-checked:bg-secondary/50 md:grid-cols-[auto_1fr_auto]"
                >
                  <input
                    type="radio"
                    name="service"
                    value={service.id}
                    defaultChecked={index === 0}
                    className="mt-1"
                  />
                  <span className="min-w-0">
                    <span className="block font-medium">{service.title}</span>
                    <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                      {service.description}
                    </span>
                    <span className="mt-3 flex flex-wrap gap-2">
                      {service.deliverables.slice(0, 3).map((deliverable) => (
                        <Badge
                          key={deliverable}
                          variant="outline"
                          className="rounded-md"
                        >
                          {deliverable}
                        </Badge>
                      ))}
                    </span>
                  </span>
                  <span className="rounded-lg border bg-background p-3 text-left md:text-right">
                    <span className="block text-sm text-muted-foreground">
                      {formatDuration(service.duration)}
                    </span>
                    <span className="mt-1 block text-lg font-semibold">
                      {formatCurrency(service.price)}
                    </span>
                  </span>
                </label>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-lg">
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <CardTitle>Choose preferred time</CardTitle>
                <Badge variant="secondary" className="rounded-md">
                  Step 2
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="grid gap-5">
              <div className="grid gap-3 md:grid-cols-3">
                {creator.nextAvailableSlots.map((slot, index) => (
                  <label
                    key={slot}
                    className="cursor-pointer rounded-lg border p-4 transition hover:border-primary/40 has-checked:border-primary has-checked:bg-secondary/50"
                  >
                    <input
                      type="radio"
                      name="slot"
                      value={slot}
                      defaultChecked={index === 0}
                      className="sr-only"
                    />
                    <CalendarDays className="mb-3 size-5 text-primary" />
                    <span className="block text-sm font-medium">{slot}</span>
                    <span className="mt-1 block text-xs text-muted-foreground">
                      Available for request
                    </span>
                  </label>
                ))}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium">
                  Custom date
                  <input
                    required
                    type="date"
                    name="date"
                    defaultValue="2026-06-03"
                    className="h-10 rounded-md border bg-background px-3 font-normal outline-none focus:ring-2 focus:ring-ring/30"
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium">
                  Time
                  <select
                    name="time"
                    className="h-10 rounded-md border bg-background px-3 font-normal outline-none focus:ring-2 focus:ring-ring/30"
                  >
                    <option>10:30 AM</option>
                    <option>2:00 PM</option>
                    <option>5:30 PM</option>
                  </select>
                </label>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-lg">
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <CardTitle>Add request context</CardTitle>
                <Badge variant="secondary" className="rounded-md">
                  Step 3
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Textarea
                required
                name="notes"
                placeholder="Share what you need help with, links, context, and desired outcome."
                className="min-h-32"
              />
              <div className="grid gap-3 text-sm text-muted-foreground md:grid-cols-3">
                <span className="flex gap-2 rounded-lg border bg-muted/25 p-3">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                  Add clear goals for the session.
                </span>
                <span className="flex gap-2 rounded-lg border bg-muted/25 p-3">
                  <Clock3 className="mt-0.5 size-4 shrink-0 text-amber-600" />
                  Creator can reschedule if needed.
                </span>
                <span className="flex gap-2 rounded-lg border bg-muted/25 p-3">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                  Booking starts as Pending.
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-lg border-primary/30 bg-primary/5">
            <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-medium">Submit booking request</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  This mock flow will create a pending request and show the
                  confirmation timeline.
                </p>
              </div>
              <Button type="submit" size="lg">
                Submit request
              </Button>
            </CardContent>
          </Card>
        </form>

        <BookingSummaryCard creator={creator} service={selectedService} />
      </section>
    </main>
  );
}
