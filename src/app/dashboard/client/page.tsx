import Link from "next/link";
import {
  Bookmark,
  CalendarDays,
  CheckCircle2,
  Clock3,
  DollarSign,
} from "lucide-react";

import { ActivityFeed } from "@/components/dashboards/activity-feed";
import { BookingCard } from "@/components/dashboards/booking-card";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { MetricCard } from "@/components/dashboards/metric-card";
import { CreatorCard } from "@/components/marketplace/creator-card";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { bookings } from "@/data/mock-bookings";
import { creators, getServicesByCreatorId } from "@/data/mock-creators";
import { formatCurrency } from "@/lib/formatters";

const creatorSlugById = Object.fromEntries(
  creators.map((creator) => [creator.id, creator.slug])
);

export default function ClientDashboardPage() {
  const upcomingBookings = bookings.filter((booking) =>
    ["Pending", "Confirmed", "Rescheduled"].includes(booking.status)
  );
  const pastBookings = bookings.filter((booking) => booking.status === "Completed");
  const pendingBookings = bookings.filter((booking) => booking.status === "Pending");
  const latestSubmittedRequest =
    pendingBookings.find((booking) => booking.id === "CB-1026") ??
    pendingBookings[0];
  const savedCreators = creators.slice(0, 2);
  const totalSpend = bookings.reduce((total, booking) => total + booking.price, 0);

  return (
    <DashboardShell
      active="client"
      title="Client dashboard"
      description="Track session requests, upcoming bookings, saved creators, and next actions after submitting a booking."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={CalendarDays}
          label="Upcoming bookings"
          value={`${upcomingBookings.length}`}
          detail="Confirmed, pending, and rescheduled sessions."
        />
        <MetricCard
          icon={Clock3}
          label="Awaiting response"
          value={`${pendingBookings.length}`}
          detail="Requests waiting for creator action."
          tone="warning"
        />
        <MetricCard
          icon={CheckCircle2}
          label="Completed sessions"
          value={`${pastBookings.length}`}
          detail="Eligible for review and repeat booking."
          tone="success"
        />
        <MetricCard
          icon={DollarSign}
          label="Mock spend"
          value={formatCurrency(totalSpend)}
          detail="Total value across demo bookings."
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_340px]">
        <section className="space-y-6">
          <Card className="rounded-lg border-primary/25 bg-primary/5 shadow-[0_18px_45px_rgba(0,95,153,0.12)]">
            <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium">Latest request submitted</p>
                  {latestSubmittedRequest ? (
                    <StatusBadge status={latestSubmittedRequest.status} />
                  ) : null}
                </div>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {latestSubmittedRequest
                    ? `${latestSubmittedRequest.serviceName} is now waiting for ${latestSubmittedRequest.creatorName}. The creator can accept, reject, or reschedule it from their dashboard.`
                    : "Submitted requests will appear here right after a client completes booking."}
                </p>
                {latestSubmittedRequest ? (
                  <p className="mt-2 text-xs font-medium uppercase tracking-[0.18em] text-primary">
                    Request {latestSubmittedRequest.id}
                  </p>
                ) : null}
              </div>
              {latestSubmittedRequest ? (
                <Button asChild>
                  <Link href={`/creators/${creatorSlugById[latestSubmittedRequest.creatorId]}`}>
                    Open creator profile
                  </Link>
                </Button>
              ) : (
                <Button asChild>
                  <Link href="/explore">Browse creators</Link>
                </Button>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-lg">
            <CardHeader>
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <CardTitle>Upcoming bookings</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">
                    The post-booking operational view for a client.
                  </p>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href="/explore">Book another session</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {upcomingBookings.length > 0 ? (
                <div className="grid gap-3">
                  {upcomingBookings.map((booking) => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      creatorSlug={creatorSlugById[booking.creatorId]}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No upcoming bookings"
                  description="Confirmed and pending session requests will appear here."
                  actionLabel="Explore creators"
                  actionHref="/explore"
                />
              )}
            </CardContent>
          </Card>
        </section>

        <ActivityFeed />
      </div>

      <Card className="mt-6 rounded-lg">
        <CardHeader>
          <CardTitle>Booking history</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Creator</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">{booking.id}</TableCell>
                    <TableCell>{booking.creatorName}</TableCell>
                    <TableCell>{booking.serviceName}</TableCell>
                    <TableCell>
                      {booking.date} at {booking.time}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={booking.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(booking.price)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Saved creators</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Quick access to experts a client may book again.
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/explore">
            <Bookmark className="size-4" />
            Find more
          </Link>
        </Button>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {savedCreators.map((creator) => {
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
    </DashboardShell>
  );
}
