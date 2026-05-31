import Link from "next/link";
import {
  CalendarClock,
  DollarSign,
  Eye,
  ListChecks,
  TrendingUp,
} from "lucide-react";

import { CreatorRequestCard } from "@/components/dashboards/creator-request-card";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { MetricCard } from "@/components/dashboards/metric-card";
import { ProfileChecklistCard } from "@/components/dashboards/profile-checklist-card";
import { ToastActionButton } from "@/components/shared/toast-action-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { bookings } from "@/data/mock-bookings";
import { creators, services } from "@/data/mock-creators";
import { formatCurrency, formatDuration } from "@/lib/formatters";

export default function CreatorDashboardPage() {
  const currentCreator = creators.find((creator) => creator.id === "creator-001");
  const creatorBookings = bookings.filter(
    (booking) => booking.creatorId === "creator-001"
  );
  const creatorServices = services.filter(
    (service) => service.creatorId === "creator-001"
  );
  const actionableRequests = creatorBookings.filter((booking) =>
    ["Pending", "Rescheduled"].includes(booking.status)
  );
  const confirmedBookings = creatorBookings.filter(
    (booking) => booking.status === "Confirmed"
  );
  const earnings = creatorBookings.reduce(
    (total, booking) => total + booking.price,
    0
  );

  return (
    <DashboardShell
      active="creator"
      title="Creator dashboard"
      description="Manage incoming requests, services, availability, profile quality, and mock earnings from one provider workspace."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={ListChecks}
          label="Action needed"
          value={`${actionableRequests.length}`}
          detail="Requests waiting for accept, reject, or reschedule."
          tone="warning"
        />
        <MetricCard
          icon={CalendarClock}
          label="Confirmed sessions"
          value={`${confirmedBookings.length}`}
          detail="Sessions already accepted and ready."
          tone="success"
        />
        <MetricCard
          icon={DollarSign}
          label="Mock earnings"
          value={formatCurrency(earnings)}
          detail="Total value across creator bookings."
        />
        <MetricCard
          icon={TrendingUp}
          label="Profile growth"
          value="18%"
          detail="Views and saves compared with last week."
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_340px]">
        <section className="space-y-6">
          <Card className="rounded-lg border-amber-200 bg-amber-50/60">
            <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-medium">Respond to new booking requests</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Pending and rescheduled requests should be handled quickly to
                  keep marketplace response quality high.
                </p>
              </div>
              <Button asChild>
                <Link href="#requests">Review requests</Link>
              </Button>
            </CardContent>
          </Card>

          <Card id="requests" className="scroll-mt-24 rounded-lg">
            <CardHeader>
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <CardTitle>Incoming requests</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Creator-side status actions for marketplace booking flow.
                  </p>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href="/creators/aarav-mehta">
                    <Eye className="size-4" />
                    View public profile
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="grid gap-3">
              {creatorBookings.map((booking) => (
                <CreatorRequestCard key={booking.id} booking={booking} />
              ))}
            </CardContent>
          </Card>
        </section>

        <div className="space-y-6">
          <ProfileChecklistCard />

          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle>Availability</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              {(currentCreator?.nextAvailableSlots ?? []).map((slot) => (
                <div
                  key={slot}
                  className="flex items-center justify-between gap-3 rounded-md border bg-muted/25 p-3 text-sm"
                >
                  <span>{slot}</span>
                  <Badge variant="outline" className="rounded-md">
                    Open
                  </Badge>
                </div>
              ))}
              <ToastActionButton
                label="Edit availability"
                message="Availability editor opened"
                description="This demo would let the creator add or remove bookable slots."
                variant="outline"
                className="mt-2"
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="mt-6 rounded-lg">
        <CardHeader>
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <CardTitle>Service packages</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Manage the offers clients can select before booking.
              </p>
            </div>
            <ToastActionButton
              label="Add package"
              message="Package draft started"
              description="The production flow would open a package builder with price, duration, and deliverables."
              size="sm"
            />
          </div>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {creatorServices.map((service) => (
            <div key={service.id} className="rounded-lg border p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-medium">{service.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {service.description}
                  </p>
                </div>
                <Badge variant="secondary" className="rounded-md">
                  Active
                </Badge>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-sm text-muted-foreground">
                <Badge variant="outline" className="rounded-md">
                  {formatDuration(service.duration)}
                </Badge>
                <Badge variant="outline" className="rounded-md">
                  {formatCurrency(service.price)}
                </Badge>
                <Badge variant="outline" className="rounded-md">
                  {service.deliverables.length} deliverables
                </Badge>
              </div>
              <div className="mt-4 flex gap-2">
                <ToastActionButton
                  label="Edit"
                  message={`${service.title} opened for editing`}
                  description="Changes would update the public creator profile after saving."
                  variant="outline"
                />
                <ToastActionButton
                  label="Duplicate"
                  message={`${service.title} duplicated`}
                  description="A copied service package would appear as a draft."
                  variant="ghost"
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
