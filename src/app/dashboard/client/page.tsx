import Link from "next/link";
import { Bookmark, CalendarDays, Clock3 } from "lucide-react";

import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { CreatorCard } from "@/components/marketplace/creator-card";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { bookings } from "@/data/mock-bookings";
import { creators } from "@/data/mock-creators";
import { formatCurrency } from "@/lib/formatters";

export default function ClientDashboardPage() {
  const upcomingBookings = bookings.filter((booking) =>
    ["Pending", "Confirmed", "Rescheduled"].includes(booking.status)
  );
  const pastBookings = bookings.filter((booking) => booking.status === "Completed");
  const savedCreators = creators.slice(0, 2);

  return (
    <DashboardShell
      active="client"
      title="Client dashboard"
      description="Track upcoming sessions, past bookings, saved creators, and booking status actions."
    >
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-lg">
          <CardContent className="p-4">
            <CalendarDays className="mb-3 size-5 text-primary" />
            <p className="text-2xl font-semibold">{upcomingBookings.length}</p>
            <p className="text-sm text-muted-foreground">Upcoming bookings</p>
          </CardContent>
        </Card>
        <Card className="rounded-lg">
          <CardContent className="p-4">
            <Clock3 className="mb-3 size-5 text-primary" />
            <p className="text-2xl font-semibold">{pastBookings.length}</p>
            <p className="text-sm text-muted-foreground">Completed sessions</p>
          </CardContent>
        </Card>
        <Card className="rounded-lg">
          <CardContent className="p-4">
            <Bookmark className="mb-3 size-5 text-primary" />
            <p className="text-2xl font-semibold">{savedCreators.length}</p>
            <p className="text-sm text-muted-foreground">Saved creators</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 rounded-lg">
        <CardHeader>
          <CardTitle>Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          {bookings.length > 0 ? (
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
          ) : (
            <EmptyState
              title="No upcoming bookings"
              description="Saved sessions and booking requests will appear here."
              actionLabel="Explore creators"
              actionHref="/explore"
            />
          )}
        </CardContent>
      </Card>

      <div className="mt-6 flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold">Saved creators</h2>
        <Button asChild variant="outline" size="sm">
          <Link href="/explore">Find more</Link>
        </Button>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {savedCreators.map((creator) => (
          <CreatorCard key={creator.id} creator={creator} />
        ))}
      </div>
    </DashboardShell>
  );
}

