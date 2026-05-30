import { DollarSign, ListChecks, TrendingUp, UserCheck } from "lucide-react";

import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { bookings } from "@/data/mock-bookings";
import { services } from "@/data/mock-creators";
import { formatCurrency, formatDuration } from "@/lib/formatters";

export default function CreatorDashboardPage() {
  const creatorBookings = bookings.filter((booking) => booking.creatorId === "creator-001");
  const creatorServices = services.filter((service) => service.creatorId === "creator-001");
  const earnings = creatorBookings.reduce((total, booking) => total + booking.price, 0);

  return (
    <DashboardShell
      active="creator"
      title="Creator dashboard"
      description="Manage requests, service packages, profile completion, availability, and earnings."
    >
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="rounded-lg">
          <CardContent className="p-4">
            <ListChecks className="mb-3 size-5 text-primary" />
            <p className="text-2xl font-semibold">{creatorBookings.length}</p>
            <p className="text-sm text-muted-foreground">Booking requests</p>
          </CardContent>
        </Card>
        <Card className="rounded-lg">
          <CardContent className="p-4">
            <DollarSign className="mb-3 size-5 text-primary" />
            <p className="text-2xl font-semibold">{formatCurrency(earnings)}</p>
            <p className="text-sm text-muted-foreground">Mock earnings</p>
          </CardContent>
        </Card>
        <Card className="rounded-lg">
          <CardContent className="p-4">
            <TrendingUp className="mb-3 size-5 text-primary" />
            <p className="text-2xl font-semibold">18%</p>
            <p className="text-sm text-muted-foreground">Profile growth</p>
          </CardContent>
        </Card>
        <Card className="rounded-lg">
          <CardContent className="p-4">
            <UserCheck className="mb-3 size-5 text-primary" />
            <p className="text-2xl font-semibold">82%</p>
            <p className="text-sm text-muted-foreground">Profile complete</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_340px]">
        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle>Upcoming requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {creatorBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">{booking.clientName}</TableCell>
                      <TableCell>{booking.serviceName}</TableCell>
                      <TableCell>{booking.date}</TableCell>
                      <TableCell>
                        <StatusBadge status={booking.status} />
                      </TableCell>
                      <TableCell className="space-x-2 text-right">
                        <Button size="sm" variant="outline">Accept</Button>
                        <Button size="sm" variant="ghost">Reject</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle>Profile checklist</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={82} />
            <div className="mt-5 grid gap-3 text-sm">
              {["Profile bio", "Services", "Availability", "Portfolio proof", "Verification"].map((item, index) => (
                <div key={item} className="flex items-center justify-between rounded-md border p-3">
                  <span>{item}</span>
                  <span className="text-muted-foreground">{index < 4 ? "Done" : "Pending"}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 rounded-lg">
        <CardHeader>
          <CardTitle>Service packages</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {creatorServices.map((service) => (
            <div key={service.id} className="rounded-lg border p-4">
              <h3 className="font-medium">{service.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {service.description}
              </p>
              <div className="mt-4 flex gap-2 text-sm text-muted-foreground">
                <span>{formatDuration(service.duration)}</span>
                <span>{formatCurrency(service.price)}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </DashboardShell>
  );
}

