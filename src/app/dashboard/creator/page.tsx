import Link from "next/link";
import { redirect } from "next/navigation";
import {
  CalendarClock,
  DollarSign,
  Eye,
  ListChecks,
  TrendingUp,
} from "lucide-react";

import { ActivityFeed } from "@/components/dashboards/activity-feed";
import { CreatorRequestCard } from "@/components/dashboards/creator-request-card";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { MetricCard } from "@/components/dashboards/metric-card";
import { ProfileChecklistCard } from "@/components/dashboards/profile-checklist-card";
import { AvailabilityCalendar } from "@/components/marketplace/availability-calendar";
import { ActionStatusAlert } from "@/components/shared/action-status-alert";
import { EmptyState } from "@/components/shared/empty-state";
import { SubmitButton } from "@/components/shared/submit-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency, formatDuration } from "@/lib/formatters";
import { marketplaceCategories } from "@/lib/constants";
import { requireRole } from "@/lib/server/auth-guards";
import {
  formatAvailabilityLabel,
  listAvailabilityByCreatorId,
  seedAvailabilityForCreatorIfEmpty,
} from "@/lib/server/availability-repository";
import { listBookingsByCreatorId } from "@/lib/server/bookings-repository";
import {
  getCreatorByUserId,
  listServices,
} from "@/lib/server/marketplace-repository";
import { listNotificationsForUser } from "@/lib/server/notifications-repository";

import {
  archiveServicePackage,
  createServicePackage,
  updateAvailability,
  updateCreatorProfileDetails,
  updateServicePackage,
} from "./actions";

export const dynamic = "force-dynamic";

type CreatorDashboardPageProps = {
  searchParams: Promise<{
    profile?: string;
    package?: string;
    availability?: string;
    booking?: string;
  }>;
};

export default async function CreatorDashboardPage({
  searchParams,
}: CreatorDashboardPageProps) {
  const params = await searchParams;
  const user = await requireRole("creator");

  const services = listServices();
  const currentCreator = getCreatorByUserId(user.id);

  if (!currentCreator) {
    redirect("/onboarding/creator");
  }

  seedAvailabilityForCreatorIfEmpty(currentCreator);
  const availabilitySlots = listAvailabilityByCreatorId(currentCreator.id);
  const notifications = listNotificationsForUser(user.id);
  const creatorBookings = listBookingsByCreatorId(currentCreator.id);
  const creatorServices = services.filter(
    (service) => service.creatorId === currentCreator.id
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

      {currentCreator.profileStatus !== "approved" ? (
        <Card className="mt-6 rounded-lg border-amber-200 bg-amber-50/70">
          <CardContent className="p-5">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="font-medium">
                  {currentCreator.profileStatus === "pending"
                    ? "Profile under admin review"
                    : "Profile needs edits before approval"}
                </p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Your services and availability are saved, but this profile is
                  not public until an admin approves it.
                </p>
              </div>
              <Badge variant="outline" className="w-fit rounded-md capitalize">
                {currentCreator.profileStatus}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <div className="mt-6">
        <ActionStatusAlert
          status={
            params.profile ??
            params.package ??
            params.availability ??
            params.booking
          }
          successStatuses={[
            "submitted",
            "created",
            "updated",
            "archived",
            "confirmed",
            "rescheduled",
            "rejected",
          ]}
          messages={{
            submitted: "Profile changes were saved and sent back to admin review.",
            created: "Service package was created.",
            updated: "Changes were saved.",
            archived: "Service package was archived.",
            confirmed: "Booking was accepted and the client was notified.",
            rescheduled: "Reschedule suggestion was sent to the client.",
            rejected: "Booking was rejected and the client was notified.",
            invalid: "Some required details are missing or invalid.",
            unauthorized: "This action is not allowed for your account.",
            "invalid-transition":
              "That booking status change is not valid from the current state.",
          }}
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_340px]">
        <section className="space-y-6">
          <Card id="profile" className="scroll-mt-24 rounded-lg">
            <CardHeader>
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <CardTitle>Profile details</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Changes are saved to SQLite and sent back to admin review
                    before public marketplace visibility.
                  </p>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/creators/${currentCreator.slug}`}>
                    <Eye className="size-4" />
                    Preview profile
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form action={updateCreatorProfileDetails} className="grid gap-4">
                <input type="hidden" name="creatorId" value={currentCreator.id} />
                <input type="hidden" name="creatorSlug" value={currentCreator.slug} />
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="grid gap-2 text-sm font-medium">
                    Display name
                    <Input required name="name" defaultValue={currentCreator.name} />
                  </label>
                  <label className="grid gap-2 text-sm font-medium">
                    Category
                    <select
                      required
                      name="category"
                      defaultValue={currentCreator.category}
                      className="h-10 rounded-md border bg-background px-3 font-normal outline-none focus:ring-2 focus:ring-ring/30"
                    >
                      {marketplaceCategories.map((category) => (
                        <option key={category}>{category}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <label className="grid gap-2 text-sm font-medium">
                  Headline
                  <Input
                    required
                    name="headline"
                    defaultValue={currentCreator.headline}
                  />
                </label>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="grid gap-2 text-sm font-medium">
                    Location
                    <Input
                      required
                      name="location"
                      defaultValue={currentCreator.location}
                    />
                  </label>
                  <label className="grid gap-2 text-sm font-medium">
                    Language
                    <Input
                      required
                      name="language"
                      defaultValue={currentCreator.language}
                    />
                  </label>
                </div>
                <label className="grid gap-2 text-sm font-medium">
                  Bio
                  <Textarea
                    required
                    name="bio"
                    defaultValue={currentCreator.bio}
                    className="min-h-28"
                  />
                </label>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="grid gap-2 text-sm font-medium">
                    Skills
                    <Textarea
                      required
                      name="skills"
                      defaultValue={currentCreator.skills.join("\n")}
                      className="min-h-28"
                    />
                  </label>
                  <label className="grid gap-2 text-sm font-medium">
                    Portfolio proof
                    <Textarea
                      name="portfolio"
                      defaultValue={currentCreator.portfolio.join("\n")}
                      className="min-h-28"
                      placeholder="Client result, project proof, or portfolio item"
                    />
                  </label>
                </div>
                <label className="grid gap-2 text-sm font-medium">
                  Client outcomes
                  <Textarea
                    required
                    name="outcomes"
                    defaultValue={currentCreator.outcomes.join("\n")}
                  />
                </label>
                <SubmitButton className="w-fit" pendingLabel="Saving">
                  Save profile and resubmit
                </SubmitButton>
              </form>
            </CardContent>
          </Card>

          <Card className="rounded-lg border-amber-200 bg-[linear-gradient(135deg,rgba(255,251,235,0.9),rgba(255,255,255,0.82))] shadow-[0_18px_45px_rgba(180,83,9,0.09)]">
            <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-medium">Respond to new booking requests</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Pending and rescheduled requests should be handled quickly to
                  keep marketplace response quality high.
                </p>
              </div>
              <Button asChild size="sm">
                <Link href="#requests">Review requests</Link>
              </Button>
            </CardContent>
          </Card>

          <Card id="requests" className="scroll-mt-24 overflow-hidden rounded-lg">
            <CardHeader>
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <CardTitle>Incoming requests</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Creator-side status actions for marketplace booking flow.
                  </p>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/creators/${currentCreator.slug}`}>
                    <Eye className="size-4" />
                    View public profile
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="grid gap-3">
              {creatorBookings.length > 0 ? (
                creatorBookings.map((booking) => (
                  <CreatorRequestCard key={booking.id} booking={booking} />
                ))
              ) : (
                <EmptyState
                  title="No booking requests yet"
                  description="Client booking requests will appear here as soon as they submit a session request."
                  actionLabel="Preview profile"
                  actionHref={`/creators/${currentCreator.slug}`}
                />
              )}
            </CardContent>
          </Card>
        </section>

        <div className="space-y-6">
          <ProfileChecklistCard creator={currentCreator} services={creatorServices} />

          <ActivityFeed notifications={notifications} />

          <Card id="availability" className="scroll-mt-24 rounded-lg">
            <CardHeader>
              <CardTitle>Availability</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              {availabilitySlots.map((slot) => (
                <div
                  key={slot.id}
                  className="flex items-center justify-between gap-3 rounded-md border bg-muted/25 p-3 text-sm"
                >
                  <span>{formatAvailabilityLabel(slot)}</span>
                  <Badge variant="outline" className="rounded-md">
                    {slot.status}
                  </Badge>
                </div>
              ))}
              <form action={updateAvailability} className="grid gap-3">
                <input type="hidden" name="creatorId" value={currentCreator.id} />
                <input
                  type="hidden"
                  name="creatorSlug"
                  value={currentCreator.slug}
                />
                <label className="grid gap-2 text-sm font-medium">
                  Default timezone
                  <Input name="timezone" defaultValue="Asia/Kolkata" />
                </label>
                <label className="grid gap-2 text-sm font-medium">
                  Edit open slots
                  <Textarea
                    required
                    name="slots"
                    defaultValue={availabilitySlots
                      .filter((slot) => slot.status === "open")
                      .map(
                        (slot) =>
                          `${slot.date}, ${slot.startTime}, ${slot.endTime}, ${slot.timezone}`
                      )
                      .join("\n")}
                    className="min-h-28"
                    placeholder={"2026-06-03, 10:30, 11:30, Asia/Kolkata\n2026-06-05, 14:00, 15:00, Asia/Kolkata"}
                  />
                </label>
                <SubmitButton
                  variant="outline"
                  className="w-fit"
                  pendingLabel="Saving"
                >
                  Save availability
                </SubmitButton>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-6">
        <AvailabilityCalendar
          slots={availabilitySlots}
          title="Weekly availability view"
        />
      </div>

      <Card id="services" className="mt-6 scroll-mt-24 rounded-lg">
        <CardHeader>
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <CardTitle>Service packages</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Manage the offers clients can select before booking.
              </p>
            </div>
            <Badge variant="secondary" className="w-fit rounded-md">
              {creatorServices.length} active
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form
            action={createServicePackage}
            className="grid gap-4 rounded-lg border bg-muted/20 p-4"
          >
            <input type="hidden" name="creatorId" value={currentCreator.id} />
            <input type="hidden" name="creatorSlug" value={currentCreator.slug} />
            <input type="hidden" name="category" value={currentCreator.category} />
              <div>
                <h3 className="font-medium">Add a new package</h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  This writes to SQLite and appears on the public profile and
                  booking page after submit.
                </p>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium">
                  Package title
                  <Input
                    required
                    name="title"
                    placeholder="Founder offer teardown"
                  />
                </label>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm font-medium">
                    Duration
                    <Input
                      required
                      min={15}
                      step={15}
                      type="number"
                      name="duration"
                      placeholder="60"
                    />
                  </label>
                  <label className="grid gap-2 text-sm font-medium">
                    Price
                    <Input
                      required
                      min={1}
                      type="number"
                      name="price"
                      placeholder="149"
                    />
                  </label>
                </div>
              </div>
              <label className="grid gap-2 text-sm font-medium">
                Description
                <Textarea
                  required
                  name="description"
                  placeholder="Describe what the client gets from this session."
                />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Deliverables
                <Textarea
                  required
                  name="deliverables"
                  placeholder={"Action plan\nPriority fixes\nFollow-up checklist"}
                />
              </label>
            <SubmitButton className="w-fit" pendingLabel="Adding">
              Add package
            </SubmitButton>
          </form>

          {creatorServices.length === 0 ? (
            <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
              No active services yet. Add a package above so clients can book
              your profile after admin approval.
            </div>
          ) : null}

          <div className="grid gap-3">
          {creatorServices.map((service) => (
            <div key={service.id} className="rounded-lg border p-4">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
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
              <form action={updateServicePackage} className="mt-5 grid gap-4 rounded-lg bg-muted/20 p-4">
                <input type="hidden" name="serviceId" value={service.id} />
                <input type="hidden" name="creatorId" value={currentCreator.id} />
                <input type="hidden" name="creatorSlug" value={currentCreator.slug} />
                <input type="hidden" name="category" value={currentCreator.category} />
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="grid gap-2 text-sm font-medium">
                    Package title
                    <Input required name="title" defaultValue={service.title} />
                  </label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="grid gap-2 text-sm font-medium">
                      Duration
                      <Input
                        required
                        min={15}
                        step={15}
                        type="number"
                        name="duration"
                        defaultValue={service.duration}
                      />
                    </label>
                    <label className="grid gap-2 text-sm font-medium">
                      Price
                      <Input
                        required
                        min={1}
                        type="number"
                        name="price"
                        defaultValue={service.price}
                      />
                    </label>
                  </div>
                </div>
                <label className="grid gap-2 text-sm font-medium">
                  Description
                  <Textarea
                    required
                    name="description"
                    defaultValue={service.description}
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium">
                  Deliverables
                  <Textarea
                    required
                    name="deliverables"
                    defaultValue={service.deliverables.join("\n")}
                  />
                </label>
                <div className="flex flex-wrap gap-2">
                  <SubmitButton
                    variant="outline"
                    className="w-fit"
                    pendingLabel="Saving"
                  >
                    Save package
                  </SubmitButton>
                </div>
              </form>
              <form action={archiveServicePackage} className="mt-3">
                <input type="hidden" name="serviceId" value={service.id} />
                <input type="hidden" name="creatorId" value={currentCreator.id} />
                <input type="hidden" name="creatorSlug" value={currentCreator.slug} />
                <SubmitButton
                  variant="ghost"
                  className="w-fit text-destructive hover:text-destructive"
                  pendingLabel="Archiving"
                >
                  Archive package
                </SubmitButton>
              </form>
            </div>
          ))}
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
