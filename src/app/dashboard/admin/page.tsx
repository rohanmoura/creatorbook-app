import {
  AlertTriangle,
  CalendarCheck,
  DollarSign,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

import { AdminApprovalCard } from "@/components/dashboards/admin-approval-card";
import { AdminReportCard } from "@/components/dashboards/admin-report-card";
import { ActivityFeed } from "@/components/dashboards/activity-feed";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { MetricCard } from "@/components/dashboards/metric-card";
import { PlatformHealthCard } from "@/components/dashboards/platform-health-card";
import { ActionStatusAlert } from "@/components/shared/action-status-alert";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { SubmitButton } from "@/components/shared/submit-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/formatters";
import { requireRole } from "@/lib/server/auth-guards";
import { listBookings } from "@/lib/server/bookings-repository";
import { listNotificationsForUser } from "@/lib/server/notifications-repository";
import { listPayments } from "@/lib/server/payments-repository";
import {
  listAdminAuditEvents,
  listCategories,
  listCreators,
  listReports,
} from "@/lib/server/marketplace-repository";
import { listUsers } from "@/lib/server/users-repository";

import {
  archiveAdminCategory,
  createAdminCategory,
  updateAdminCategory,
  updateUserModerationStatus,
} from "./actions";

export const dynamic = "force-dynamic";

type AdminDashboardPageProps = {
  searchParams: Promise<{
    creator?: string;
    report?: string;
    category?: string;
    user?: string;
  }>;
};

export default async function AdminDashboardPage({
  searchParams,
}: AdminDashboardPageProps) {
  const params = await searchParams;
  const admin = await requireRole("admin");

  const bookings = listBookings();
  const categories = listCategories();
  const creators = listCreators();
  const reports = listReports();
  const payments = listPayments();
  const notifications = listNotificationsForUser(admin.id);
  const users = listUsers();
  const auditEvents = listAdminAuditEvents();
  const pendingCreators = creators.filter(
    (creator) => creator.profileStatus === "pending"
  );
  const approvedCreators = creators.filter(
    (creator) => creator.profileStatus === "approved"
  );
  const openReports = reports.filter((report) => report.status !== "resolved");
  const revenue = bookings.reduce((total, booking) => total + booking.price, 0);
  const paidRevenue = payments
    .filter((payment) => payment.status === "paid")
    .reduce((total, payment) => total + payment.amount / 100, 0);
  const paymentStatusByBookingId = Object.fromEntries(
    payments.map((payment) => [payment.bookingId, payment.status])
  );
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
          label="Paid revenue"
          value={formatCurrency(paidRevenue)}
          detail={`${formatCurrency(revenue)} total booking value tracked.`}
        />
      </div>

      <div className="mt-6">
        <ActionStatusAlert
          status={params.creator ?? params.report ?? params.category ?? params.user}
          successStatuses={[
            "approved",
            "pending",
            "rejected",
            "open",
            "reviewing",
            "resolved",
            "created",
            "updated",
            "archived",
            "active",
            "suspended",
          ]}
          messages={{
            approved: "Creator profile was approved and the creator was notified.",
            pending: "Creator profile was moved back to review.",
            rejected: "Creator profile was rejected and the creator was notified.",
            open: "Report was reopened.",
            reviewing: "Report was moved to review.",
            resolved: "Report was resolved.",
            created: "Category was created or restored.",
            updated: "Category changes were saved.",
            archived: "Category was archived.",
            active: "User account was restored.",
            suspended: "User account was suspended.",
            invalid: "This moderation action could not be completed.",
          }}
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_340px]">
        <section className="space-y-6">
          <Card className="rounded-lg border-amber-200 bg-[linear-gradient(135deg,rgba(255,251,235,0.9),rgba(255,255,255,0.82))] shadow-[0_18px_45px_rgba(180,83,9,0.09)]">
            <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-medium">Operator attention needed</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Review pending creator approval and open reports to keep
                  marketplace quality high.
                </p>
              </div>
              <a
                className="inline-flex h-8 w-fit items-center justify-center whitespace-nowrap rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground shadow-[0_10px_24px_rgba(0,95,153,0.22)] transition hover:bg-primary/90"
                href="#moderation"
              >
                Open queue
              </a>
            </CardContent>
          </Card>

          <Card id="moderation" className="scroll-mt-24 overflow-hidden rounded-lg">
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
              {pendingCreators.length > 0 ? (
                pendingCreators.map((creator) => (
                  <AdminApprovalCard key={creator.id} creator={creator} />
                ))
              ) : (
                <EmptyState
                  title="No pending approvals"
                  description="All creator applications have been reviewed. Approved creators are visible in marketplace discovery."
                  actionLabel="Open marketplace"
                  actionHref="/explore"
                />
              )}
            </CardContent>
          </Card>
        </section>

        <div className="space-y-6">
          <ActivityFeed notifications={notifications} />

          <PlatformHealthCard />

          <Card id="reports" className="scroll-mt-24 rounded-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="size-5 text-primary" />
                Reports
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              {openReports.length > 0 ? (
                openReports.map((report) => (
                  <AdminReportCard key={report.id} report={report} />
                ))
              ) : (
                <EmptyState
                  title="No open reports"
                  description="All marketplace reports have been resolved."
                  actionLabel="View bookings"
                  actionHref="#booking-oversight"
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Card id="booking-oversight" className="mt-6 scroll-mt-24 rounded-lg">
        <CardHeader>
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <CardTitle>Booking oversight</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Monitor marketplace transaction status across clients and
                creators.
              </p>
            </div>
            <Badge variant="outline" className="w-fit rounded-md">
              {bookings.length} records
            </Badge>
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
                  <TableHead>Payment</TableHead>
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
                    <TableCell className="capitalize">
                      {paymentStatusByBookingId[booking.id]?.replace("_", " ") ??
                        "not started"}
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

      <Card id="categories" className="mt-6 scroll-mt-24 rounded-lg">
        <CardHeader>
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <CardTitle>Category management</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Keep marketplace taxonomy clear enough for clients to browse and
                compare experts.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form action={createAdminCategory} className="grid gap-3 rounded-lg border bg-muted/20 p-4 md:grid-cols-[1fr_1.5fr_auto] md:items-end">
            <label className="grid gap-2 text-sm font-medium">
              Name
              <Input required name="name" placeholder="Product Strategy" />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Description
              <Input required name="description" placeholder="Positioning, planning, and growth strategy." />
            </label>
            <SubmitButton pendingLabel="Adding">Add category</SubmitButton>
          </form>
          <div className="grid gap-3 md:grid-cols-2">
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
              <form action={updateAdminCategory} className="mt-4 grid gap-3">
                <input type="hidden" name="categoryId" value={category.id} />
                <Input required name="name" defaultValue={category.name} />
                <Textarea required name="description" defaultValue={category.description} />
                <SubmitButton
                  variant="outline"
                  className="w-fit"
                  pendingLabel="Saving"
                >
                  Save category
                </SubmitButton>
              </form>
              <form action={archiveAdminCategory} className="mt-2">
                <input type="hidden" name="categoryId" value={category.id} />
                <input type="hidden" name="name" value={category.name} />
                <SubmitButton
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                  pendingLabel="Archiving"
                >
                  Archive category
                </SubmitButton>
              </form>
            </div>
          ))}
          </div>
        </CardContent>
      </Card>

      <Card id="users" className="mt-6 scroll-mt-24 rounded-lg">
        <CardHeader>
          <CardTitle>User moderation</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Review users by role and suspend accounts when marketplace quality requires it.
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="capitalize">{user.role}</TableCell>
                    <TableCell>
                      <Badge variant={user.suspended ? "destructive" : "secondary"} className="rounded-md">
                        {user.suspended ? "Suspended" : "Active"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <form action={updateUserModerationStatus}>
                        <input type="hidden" name="userId" value={user.id} />
                        <input
                          type="hidden"
                          name="status"
                          value={user.suspended ? "active" : "suspended"}
                        />
                        <SubmitButton
                          size="sm"
                          variant="outline"
                          disabled={user.id === admin.id}
                          pendingLabel={user.suspended ? "Restoring" : "Suspending"}
                        >
                          {user.suspended ? "Restore" : "Suspend"}
                        </SubmitButton>
                      </form>
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
          <CardTitle>Admin audit activity</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {auditEvents.length > 0 ? (
            auditEvents.map((event) => (
              <div key={event.id} className="rounded-lg border p-4 text-sm">
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                  <p className="font-medium">{event.action}</p>
                  <Badge variant="outline" className="w-fit rounded-md">
                    {event.targetType}: {event.targetId}
                  </Badge>
                </div>
                <p className="mt-2 text-muted-foreground">{event.note}</p>
              </div>
            ))
          ) : (
            <EmptyState
              title="No audit events yet"
              description="Creator, report, category, and user moderation actions will appear here."
            />
          )}
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
