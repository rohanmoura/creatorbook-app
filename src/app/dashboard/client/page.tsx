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
import { ActionStatusAlert } from "@/components/shared/action-status-alert";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { SubmitButton } from "@/components/shared/submit-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { bookingStatuses } from "@/lib/constants";
import { requireRole } from "@/lib/server/auth-guards";
import { listBookingsByClientId } from "@/lib/server/bookings-repository";
import { getClientPreferences } from "@/lib/server/client-preferences-repository";
import {
  getServicesByCreatorIdFromDb,
  listPublicCreators,
  listReviews,
} from "@/lib/server/marketplace-repository";
import { listSavedCreatorIds, listSavedCreators } from "@/lib/server/saved-creators-repository";
import { listPayments } from "@/lib/server/payments-repository";
import { listNotificationsForUser } from "@/lib/server/notifications-repository";

import { submitBookingReview } from "./actions";
import type { BookingStatus } from "@/types/marketplace";

export const dynamic = "force-dynamic";

type ClientDashboardPageProps = {
  searchParams: Promise<{
    status?: BookingStatus;
    booking?: string;
    review?: string;
    payment?: string;
  }>;
};

export default async function ClientDashboardPage({
  searchParams,
}: ClientDashboardPageProps) {
  const params = await searchParams;
  const user = await requireRole("client");

  const bookings = listBookingsByClientId(user.id);
  const preferences = getClientPreferences(user.id);
  const creators = listPublicCreators();
  const savedCreators = listSavedCreators(user.id);
  const savedCreatorIds = listSavedCreatorIds(user.id);
  const payments = listPayments();
  const notifications = listNotificationsForUser(user.id);
  const paymentStatusByBookingId = Object.fromEntries(
    payments.map((payment) => [payment.bookingId, payment.status])
  );
  const reviews = listReviews();
  const creatorSlugById = Object.fromEntries(
    creators.map((creator) => [creator.id, creator.slug])
  );
  const upcomingBookings = bookings.filter((booking) =>
    ["Pending", "Confirmed", "Rescheduled"].includes(booking.status)
  );
  const pastBookings = bookings.filter((booking) => booking.status === "Completed");
  const pendingBookings = bookings.filter((booking) => booking.status === "Pending");
  const historyBookings = params.status
    ? bookings.filter((booking) => booking.status === params.status)
    : bookings;
  const latestSubmittedRequest =
    pendingBookings.find((booking) => booking.id === "CB-1026") ??
    pendingBookings[0];
  const recommendedCreators = preferences
    ? creators
        .filter((creator) => preferences.categories.includes(creator.category))
        .filter((creator) => !savedCreatorIds.includes(creator.id))
        .slice(0, 3)
    : creators.filter((creator) => !savedCreatorIds.includes(creator.id)).slice(0, 3);
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

      <div className="mt-6">
        <ActionStatusAlert
          status={params.booking ?? params.review ?? params.payment}
          successStatuses={[
            "cancelled",
            "rescheduled",
            "submitted",
            "checkout-started",
          ]}
          messages={{
            cancelled: "Booking was cancelled and the creator was notified.",
            rescheduled: "Reschedule request was sent to the creator.",
            submitted: "Review was submitted and attached to the completed booking.",
            invalid: "Some required information is missing or invalid.",
            unauthorized: "This action is not allowed for your account.",
            "invalid-transition":
              "That booking status change is not valid from the current state.",
            "already-submitted": "You already reviewed this completed booking.",
            "checkout-error":
              "Stripe checkout could not be opened. Check your test key and try again.",
            "config-required":
              "Stripe test checkout needs STRIPE_SECRET_KEY in your local environment.",
          }}
        />
      </div>

      {preferences ? (
        <Card className="mt-6 rounded-lg border-primary/20 bg-primary/5">
          <CardContent className="flex flex-col justify-between gap-4 p-5 lg:flex-row lg:items-center">
            <div>
              <p className="font-medium">Your marketplace preferences are saved</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Recommended categories: {preferences.categories.join(", ")}.
                Budget: {preferences.budgetRange}. Timezone: {preferences.timezone}.
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href={`/explore?category=${encodeURIComponent(preferences.categories[0] ?? "")}`}>
                Browse matches
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : null}

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
                      paymentStatus={paymentStatusByBookingId[booking.id]}
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

        <ActivityFeed notifications={notifications} />
      </div>

      <Card id="reviews" className="mt-6 scroll-mt-24 rounded-lg">
        <CardHeader>
          <CardTitle>Completed session reviews</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Submit feedback after completed bookings. Reviews are saved to
            SQLite and appear on creator profiles.
          </p>
        </CardHeader>
        <CardContent className="grid gap-3">
          {pastBookings.length > 0 ? (
            pastBookings.map((booking) => {
              const existingReview = reviews.find(
                (review) => review.bookingId === booking.id
              );
              const creatorSlug = creatorSlugById[booking.creatorId];

              return (
                <div key={booking.id} className="rounded-lg border p-4">
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                    <div>
                      <h3 className="font-medium">{booking.serviceName}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        With {booking.creatorName} on {booking.date}
                      </p>
                    </div>
                    {existingReview ? (
                      <span className="w-fit rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
                        Reviewed
                      </span>
                    ) : (
                      <StatusBadge status={booking.status} />
                    )}
                  </div>

                  {existingReview ? (
                    <p className="mt-4 rounded-md bg-muted/35 p-3 text-sm leading-6 text-muted-foreground">
                      {existingReview.text}
                    </p>
                  ) : (
                    <form action={submitBookingReview} className="mt-4 grid gap-3">
                      <input type="hidden" name="bookingId" value={booking.id} />
                      <input
                        type="hidden"
                        name="creatorId"
                        value={booking.creatorId}
                      />
                      <input
                        type="hidden"
                        name="clientId"
                        value={booking.clientId}
                      />
                      <input
                        type="hidden"
                        name="creatorSlug"
                        value={creatorSlug ?? ""}
                      />
                      <label className="grid gap-2 text-sm font-medium">
                        Rating
                        <select
                          name="rating"
                          defaultValue="5"
                          className="h-10 rounded-md border bg-background px-3 font-normal outline-none focus:ring-2 focus:ring-ring/30"
                        >
                          <option value="5">5 - Excellent</option>
                          <option value="4">4 - Strong</option>
                          <option value="3">3 - Useful</option>
                          <option value="2">2 - Needs work</option>
                          <option value="1">1 - Poor fit</option>
                        </select>
                      </label>
                      <label className="grid gap-2 text-sm font-medium">
                        Review
                        <Textarea
                          required
                          name="text"
                          placeholder="Share what was useful from the session."
                        />
                      </label>
                      <SubmitButton className="w-fit" pendingLabel="Submitting">
                        Submit review
                      </SubmitButton>
                    </form>
                  )}
                </div>
              );
            })
          ) : (
            <EmptyState
              title="No completed sessions yet"
              description="Completed bookings will become reviewable here."
              actionLabel="Explore creators"
              actionHref="/explore"
            />
          )}
        </CardContent>
      </Card>

      <Card className="mt-6 rounded-lg">
        <CardHeader>
          <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
            <div>
              <CardTitle>Booking history</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Filter your own bookings by lifecycle status.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild size="sm" variant={!params.status ? "default" : "outline"}>
                <Link href="/dashboard/client">All</Link>
              </Button>
              {bookingStatuses.map((status) => (
                <Button
                  key={status}
                  asChild
                  size="sm"
                  variant={params.status === status ? "default" : "outline"}
                >
                  <Link href={`/dashboard/client?status=${encodeURIComponent(status)}`}>
                    {status}
                  </Link>
                </Button>
              ))}
            </div>
          </div>
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
                {historyBookings.map((booking) => (
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
            {historyBookings.length === 0 ? (
              <div className="border-t p-6">
                <EmptyState
                  title="No bookings in this status"
                  description="Try another status filter or book a new session."
                  actionLabel="Reset filter"
                  actionHref="/dashboard/client"
                />
              </div>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <div id="saved-creators" className="mt-6 flex scroll-mt-24 items-center justify-between gap-4">
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
      {savedCreators.length > 0 ? (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {savedCreators.map((creator) => {
            const creatorServices = getServicesByCreatorIdFromDb(creator.id);
            return (
              <CreatorCard
                key={creator.id}
                creator={creator}
                primaryService={creatorServices[0]?.title}
                serviceCount={creatorServices.length}
                isSaved
                returnTo="/dashboard/client#saved-creators"
              />
            );
          })}
        </div>
      ) : (
        <EmptyState
          className="mt-4"
          title="No saved creators yet"
          description="Save creators from marketplace cards or profile pages to build a shortlist."
          actionLabel="Explore creators"
          actionHref="/explore"
        />
      )}

      <div className="mt-8 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Recommended from your preferences</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Matches are based on your saved client onboarding categories.
          </p>
        </div>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {recommendedCreators.length > 0 ? (
          recommendedCreators.map((creator) => {
            const creatorServices = getServicesByCreatorIdFromDb(creator.id);
            return (
              <CreatorCard
                key={creator.id}
                creator={creator}
                primaryService={creatorServices[0]?.title}
                serviceCount={creatorServices.length}
                isSaved={savedCreatorIds.includes(creator.id)}
                returnTo="/dashboard/client"
              />
            );
          })
        ) : (
          <div className="md:col-span-3">
            <EmptyState
              title="No recommendations yet"
              description="Save creators or update onboarding preferences to unlock stronger marketplace matches."
              actionLabel="Browse marketplace"
              actionHref="/explore"
            />
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
