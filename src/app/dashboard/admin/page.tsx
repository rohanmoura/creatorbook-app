import { AlertTriangle, CalendarCheck, ShieldCheck, UsersRound } from "lucide-react";

import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { StatusBadge } from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { bookings } from "@/data/mock-bookings";
import { categories } from "@/data/mock-categories";
import { creators } from "@/data/mock-creators";
import { reports } from "@/data/mock-reports";
import { formatCurrency } from "@/lib/formatters";

export default function AdminDashboardPage() {
  const pendingCreators = creators.filter((creator) => creator.profileStatus === "pending");
  const revenue = bookings.reduce((total, booking) => total + booking.price, 0);

  return (
    <DashboardShell
      active="admin"
      title="Admin dashboard"
      description="Monitor marketplace supply, bookings, approvals, categories, reports, and platform quality."
    >
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="rounded-lg">
          <CardContent className="p-4">
            <UsersRound className="mb-3 size-5 text-primary" />
            <p className="text-2xl font-semibold">{creators.length}</p>
            <p className="text-sm text-muted-foreground">Creators</p>
          </CardContent>
        </Card>
        <Card className="rounded-lg">
          <CardContent className="p-4">
            <CalendarCheck className="mb-3 size-5 text-primary" />
            <p className="text-2xl font-semibold">{bookings.length}</p>
            <p className="text-sm text-muted-foreground">Bookings</p>
          </CardContent>
        </Card>
        <Card className="rounded-lg">
          <CardContent className="p-4">
            <ShieldCheck className="mb-3 size-5 text-primary" />
            <p className="text-2xl font-semibold">{pendingCreators.length}</p>
            <p className="text-sm text-muted-foreground">Pending approvals</p>
          </CardContent>
        </Card>
        <Card className="rounded-lg">
          <CardContent className="p-4">
            <AlertTriangle className="mb-3 size-5 text-primary" />
            <p className="text-2xl font-semibold">{formatCurrency(revenue)}</p>
            <p className="text-sm text-muted-foreground">Mock revenue</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle>Pending creator approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {pendingCreators.map((creator) => (
                <div key={creator.id} className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium">{creator.name}</p>
                    <p className="text-sm text-muted-foreground">{creator.category}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm">Approve</Button>
                    <Button size="sm" variant="outline">Reject</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle>Reports</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {reports.map((report) => (
              <div key={report.id} className="rounded-lg border p-4">
                <div className="flex items-center justify-between gap-3">
                  <Badge variant="outline" className="rounded-md">
                    {report.targetType}
                  </Badge>
                  <Badge variant="secondary" className="rounded-md">
                    {report.status}
                  </Badge>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {report.reason}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 rounded-lg">
        <CardHeader>
          <CardTitle>Recent bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Creator</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">{booking.id}</TableCell>
                    <TableCell>{booking.clientName}</TableCell>
                    <TableCell>{booking.creatorName}</TableCell>
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

      <Card className="mt-6 rounded-lg">
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {categories.map((category) => (
            <div key={category.id} className="rounded-lg border p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-medium">{category.name}</h3>
                <Badge variant="secondary" className="rounded-md">
                  {category.creatorCount}
                </Badge>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {category.description}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </DashboardShell>
  );
}

