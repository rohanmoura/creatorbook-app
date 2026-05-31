import {
  AlertTriangle,
  CalendarCheck,
  DollarSign,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

import { AdminApprovalCard } from "@/components/dashboards/admin-approval-card";
import { AdminReportCard } from "@/components/dashboards/admin-report-card";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { MetricCard } from "@/components/dashboards/metric-card";
import { PlatformHealthCard } from "@/components/dashboards/platform-health-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { ToastActionButton } from "@/components/shared/toast-action-button";
import { Badge } from "@/components/ui/badge";
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
import { categories } from "@/data/mock-categories";
import { creators } from "@/data/mock-creators";
import { reports } from "@/data/mock-reports";
import { formatCurrency } from "@/lib/formatters";

export default function AdminDashboardPage() {
  const pendingCreators = creators.filter(
    (creator) => creator.profileStatus === "pending"
  );
  const approvedCreators = creators.filter(
    (creator) => creator.profileStatus === "approved"
  );
  const openReports = reports.filter((report) => report.status !== "resolved");
  const revenue = bookings.reduce((total, booking) => total + booking.price, 0);
  const pendingBookings = bookings.filter((booking) => booking.status === "Pending");

  return (
    <DashboardShell
      active="admin"
      title="Admin dashboard"
      description="Operate marketplace quality: approve creators, monitor bookings, manage categories, and review reports."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={UsersRound}
          label="Approved creators"
          value={`${approvedCreators.length}`}
          detail="Supply currently visible in marketplace discovery."
          tone="success"
        />
        <MetricCard
          icon={ShieldCheck}
          label="Pending approvals"
          value={`${pendingCreators.length}`}
          detail="Creator applications waiting for moderation."
          tone="warning"
        />
        <MetricCard
          icon={CalendarCheck}
          label="Bookings"
          value={`${bookings.length}`}
          detail={`${pendingBookings.length} pending requests need monitoring.`}
        />
        <MetricCard
          icon={DollarSign}
          label="Mock revenue"
          value={formatCurrency(revenue)}
          detail="Total value across demo marketplace bookings."
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_340px]">
        <section className="space-y-6">
          <Card className="rounded-lg border-amber-200 bg-amber-50/60">
            <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-medium">Operator attention needed</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Review pending creator approval and open reports to keep
                  marketplace quality high.
                </p>
              </div>
              <a
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-[0_10px_24px_rgba(0,95,153,0.22)] transition hover:bg-primary/90"
                href="#moderation"
              >
                Open moderation queue
              </a>
            </CardContent>
          </Card>

          <Card id="moderation" className="scroll-mt-24 rounded-lg">
            <CardHeader>
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <CardTitle>Pending creator approvals</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Approve, reject, or request profile edits before marketplace
                    visibility.
                  </p>
                </div>
                <Badge variant="secondary" className="w-fit rounded-md">
                  {pendingCreators.length} waiting
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="grid gap-3">
              {pendingCreators.map((creator) => (
                <AdminApprovalCard key={creator.id} creator={creator} />
              ))}
            </CardContent>
          </Card>
        </section>

        <div className="space-y-6">
          <PlatformHealthCard />

          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="size-5 text-primary" />
                Reports
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              {openReports.map((report) => (
                <AdminReportCard key={report.id} report={report} />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="mt-6 rounded-lg">
        <CardHeader>
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <CardTitle>Booking oversight</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Monitor marketplace transaction status across clients and
                creators.
              </p>
            </div>
            <ToastActionButton
              label="Export CSV"
              message="CSV export prepared"
              description="The admin booking oversight table is ready for export in this demo flow."
              variant="outline"
              size="sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Creator</TableHead>
                  <TableHead>Service</TableHead>
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
                    <TableCell>{booking.serviceName}</TableCell>
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
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <CardTitle>Category management</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Keep marketplace taxonomy clear enough for clients to browse and
                compare experts.
              </p>
            </div>
            <ToastActionButton
              label="Add category"
              message="Category draft started"
              description="A production admin could define taxonomy, tags, and marketplace visibility here."
              size="sm"
            />
          </div>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {categories.map((category) => (
            <div key={category.id} className="rounded-lg border p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-medium">{category.name}</h3>
                <Badge variant="secondary" className="rounded-md">
                  {category.creatorCount} creators
                </Badge>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {category.description}
              </p>
              <div className="mt-4 flex gap-2">
                <ToastActionButton
                  label="Edit"
                  message={`${category.name} opened for editing`}
                  description="Category metadata and discovery placement would be editable here."
                  variant="outline"
                />
                <ToastActionButton
                  label="View supply"
                  message={`${category.creatorCount} creators found`}
                  description={`${category.name} supply would open in an admin filtered view.`}
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
