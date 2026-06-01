import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CalendarCheck,
  Clock,
  Languages,
  MapPin,
  Repeat2,
  Star,
  UsersRound,
} from "lucide-react";

import { toggleSavedCreator } from "@/app/saved-creators/actions";
import { submitReport } from "@/app/reports/actions";
import { auth } from "@/auth";
import { AvailabilityCard } from "@/components/marketplace/availability-card";
import { ProfileStatCard } from "@/components/marketplace/profile-stat-card";
import { ServicePackageCard } from "@/components/marketplace/service-package-card";
import { SectionHeader } from "@/components/shared/section-header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";
import {
  listOpenAvailabilityByCreatorId,
  seedAvailabilityForCreatorIfEmpty,
} from "@/lib/server/availability-repository";
import {
  getCreatorBySlugFromDb,
  getServicesByCreatorIdFromDb,
  listReviews,
} from "@/lib/server/marketplace-repository";
import { cn } from "@/lib/utils";

type CreatorPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CreatorPage({ params }: CreatorPageProps) {
  const { slug } = await params;
  const creator = getCreatorBySlugFromDb(slug);
  const session = await auth();

  if (!creator) {
    notFound();
  }

  if (creator.profileStatus !== "approved") {
    const canPreview =
      session?.user?.role === "admin" || session?.user?.id === creator.userId;

    if (!canPreview) {
      notFound();
    }
  }

  const creatorServices = getServicesByCreatorIdFromDb(creator.id);
  seedAvailabilityForCreatorIfEmpty(creator);
  const openAvailabilitySlots = listOpenAvailabilityByCreatorId(creator.id);
  const creatorReviews = listReviews().filter(
    (review) => review.creatorId === creator.id
  );
  const startingService = creatorServices[0];

  return (
    <main>
      <section className={cn("premium-grid border-b bg-gradient-to-br", creator.coverTone)}>
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="mb-6 bg-background/80"
          >
            <Link href="/explore">
              <ArrowLeft className="size-4" />
              Back to explore
            </Link>
          </Button>

          <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-end">
            <div className="rounded-lg border bg-background/90 p-5 shadow-sm backdrop-blur">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
                <Avatar className="size-24 border-4 border-background">
                  <AvatarFallback className="bg-primary text-xl text-primary-foreground">
                    {creator.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="mb-3 flex flex-wrap gap-2">
                    <Badge className="rounded-md">{creator.category}</Badge>
                    {creator.verified ? (
                      <Badge variant="secondary" className="rounded-md">
                        <BadgeCheck className="size-3.5" />
                        Verified creator
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="rounded-md">
                        Pending approval
                      </Badge>
                    )}
                  </div>
                  <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
                    {creator.name}
                  </h1>
                  <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
                    {creator.headline}
                  </p>
                </div>
                <Button asChild size="lg">
                  <Link href={`/book/${creator.slug}`}>
                    Book session
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>

              <div className="mt-6 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2 lg:grid-cols-4">
                <span className="flex items-center gap-2">
                  <Star className="size-4 fill-amber-400 text-amber-400" />
                  {creator.rating} ({creator.reviewCount})
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="size-4" />
                  {creator.availabilityLabel}
                </span>
                <span className="flex items-center gap-2">
                  <MapPin className="size-4" />
                  {creator.location}
                </span>
                <span className="flex items-center gap-2">
                  <Languages className="size-4" />
                  {creator.language}
                </span>
              </div>
            </div>

            <Card className="rounded-lg bg-background/90 backdrop-blur">
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">
                  Most booked package
                </p>
                <h2 className="mt-2 text-lg font-semibold">
                  {startingService?.title ?? "Consultation session"}
                </h2>
                <div className="mt-4 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Starting at</p>
                    <p className="text-3xl font-semibold">
                      {formatCurrency(creator.priceFrom)}
                    </p>
                  </div>
                  <Badge variant="outline" className="rounded-md">
                    {creator.responseTime}
                  </Badge>
                </div>
                <Button asChild className="mt-5 w-full" size="lg">
                  <Link href={`/book/${creator.slug}`}>
                    Request booking
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-4">
            <ProfileStatCard
              icon={CalendarCheck}
              label="Completed sessions"
              value={`${creator.completedSessions}+`}
              detail="Across marketplace calls and advisory reviews."
            />
            <ProfileStatCard
              icon={Repeat2}
              label="Repeat clients"
              value={`${creator.repeatClientRate}%`}
              detail="Clients who returned for follow-up support."
            />
            <ProfileStatCard
              icon={UsersRound}
              label="Reviews"
              value={`${creator.reviewCount}`}
              detail={`Average rating ${creator.rating} from booked clients.`}
            />
            <ProfileStatCard
              icon={BriefcaseBusiness}
              label="Service packages"
              value={`${creatorServices.length}`}
              detail="Clear scope, price, duration, and deliverables."
            />
          </div>
        </div>
      </section>

      <section className="border-b bg-card">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 text-sm sm:px-6 lg:px-8">
          {["About", "Services", "Availability", "Reviews", "Portfolio"].map(
            (item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="shrink-0 rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                {item}
              </a>
            )
          )}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
        <div className="space-y-10">
          <section id="about" className="scroll-mt-24">
            <SectionHeader
              title="About this creator"
              description={creator.bio}
            />
            <div className="mt-5 flex flex-wrap gap-2">
              {creator.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="rounded-md">
                  {skill}
                </Badge>
              ))}
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {creator.outcomes.map((outcome) => (
                <div key={outcome} className="rounded-lg border bg-muted/25 p-4">
                  <p className="text-sm font-medium">{outcome}</p>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">
                    Outcome clients can expect from a focused working session.
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section id="services" className="scroll-mt-24">
            <SectionHeader
              title="Service packages"
              description="Each package shows scope, price, duration, and deliverables so clients can compare before booking."
            />
            <div className="mt-5 grid gap-4">
              {creatorServices.map((service) => (
                <ServicePackageCard
                  key={service.id}
                  service={service}
                  creatorSlug={creator.slug}
                />
              ))}
            </div>
          </section>

          <section id="reviews" className="scroll-mt-24">
            <SectionHeader
              title="Reviews"
              description="Realistic trust signals that help clients decide whether to book."
            />
            <div className="mt-5 grid gap-4">
              {creatorReviews.length > 0 ? (
                creatorReviews.map((review) => (
                  <Card key={review.id} className="rounded-lg">
                    <CardContent className="p-4">
                      <div className="mb-2 flex items-center gap-1 text-amber-500">
                        {Array.from({ length: review.rating }).map((_, index) => (
                          <Star key={index} className="size-4 fill-current" />
                        ))}
                      </div>
                      <p className="text-sm leading-6 text-muted-foreground">
                        {review.text}
                      </p>
                      <p className="mt-3 text-xs text-muted-foreground">
                        Completed booking: {review.bookingId}
                      </p>
                      <form action={submitReport} className="mt-3">
                        <input type="hidden" name="targetType" value="review" />
                        <input type="hidden" name="targetId" value={review.id} />
                        <input
                          type="hidden"
                          name="reason"
                          value={`Client reported review ${review.id} on ${creator.name}'s profile.`}
                        />
                        <input type="hidden" name="returnTo" value={`/creators/${creator.slug}#reviews`} />
                        <Button
                          type="submit"
                          size="sm"
                          variant="ghost"
                          disabled={session?.user?.role !== "client"}
                        >
                          Report review
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="rounded-lg">
                  <CardContent className="p-4 text-sm text-muted-foreground">
                    Reviews will appear after completed sessions.
                  </CardContent>
                </Card>
              )}
            </div>
          </section>

          <section id="portfolio" className="scroll-mt-24">
            <SectionHeader
              title="Portfolio proof"
              description="A lightweight proof section showing experience, outcomes, and past advisory work."
            />
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {creator.portfolio.map((item) => (
                <div key={item} className="rounded-lg border bg-card p-4">
                  <p className="text-sm font-medium">{item}</p>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">
                    Used as a marketplace proof signal for client confidence.
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
          <div id="availability" className="scroll-mt-24">
            <AvailabilityCard creator={creator} slots={openAvailabilitySlots} />
          </div>

          <Card className="rounded-lg">
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">Booking summary</p>
              <h2 className="mt-2 text-lg font-semibold">
                Work with {creator.name.split(" ")[0]}
              </h2>
              <div className="mt-4 grid gap-3 text-sm">
                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground">Starting price</span>
                  <span className="font-medium">
                    {formatCurrency(creator.priceFrom)}
                  </span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground">Availability</span>
                  <span className="font-medium">{creator.availabilityLabel}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground">Profile status</span>
                  <span className="font-medium capitalize">
                    {creator.profileStatus}
                  </span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground">Response</span>
                  <span className="text-right font-medium">
                    {creator.responseTime}
                  </span>
                </div>
              </div>
              <Button asChild className="mt-5 w-full" size="lg">
                <Link href={`/book/${creator.slug}`}>Book session</Link>
              </Button>
              <form action={toggleSavedCreator} className="mt-2">
                <input type="hidden" name="creatorId" value={creator.id} />
                <input type="hidden" name="intent" value="save" />
                <input type="hidden" name="returnTo" value={`/creators/${creator.slug}`} />
                <Button
                  type="submit"
                  variant="outline"
                  className="w-full"
                  disabled={session?.user?.role !== "client"}
                >
                  Save creator
                </Button>
              </form>
              <form action={submitReport} className="mt-2">
                <input type="hidden" name="targetType" value="profile" />
                <input type="hidden" name="targetId" value={creator.id} />
                <input
                  type="hidden"
                  name="reason"
                  value={`Client reported ${creator.name}'s profile for admin review.`}
                />
                <input type="hidden" name="returnTo" value={`/creators/${creator.slug}`} />
                <Button
                  type="submit"
                  variant="ghost"
                  className="w-full"
                  disabled={session?.user?.role !== "client"}
                >
                  Report profile
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="rounded-lg">
            <CardContent className="p-5">
              <p className="mb-3 text-sm font-medium">Trust checklist</p>
              <div className="grid gap-3 text-sm text-muted-foreground">
                {[
                  creator.verified
                    ? "Verified creator profile"
                    : "Pending admin verification",
                  "Clear service packages",
                  "Client reviews after completed bookings",
                  "Admin-moderated marketplace quality",
                ].map((item) => (
                  <span key={item} className="flex gap-2">
                    <BadgeCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                    {item}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </aside>
      </section>
    </main>
  );
}
