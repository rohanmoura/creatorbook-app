import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Clock, Languages, MapPin, Star } from "lucide-react";

import { SectionHeader } from "@/components/shared/section-header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCreatorBySlug, getServicesByCreatorId } from "@/data/mock-creators";
import { reviews } from "@/data/mock-reviews";
import { formatCurrency, formatDuration } from "@/lib/formatters";
import { cn } from "@/lib/utils";

type CreatorPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CreatorPage({ params }: CreatorPageProps) {
  const { slug } = await params;
  const creator = getCreatorBySlug(slug);

  if (!creator) {
    notFound();
  }

  const creatorServices = getServicesByCreatorId(creator.id);
  const creatorReviews = reviews.filter((review) => review.creatorId === creator.id);

  return (
    <main>
      <section className={cn("border-b bg-linear-to-br", creator.coverTone)}>
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-3xl rounded-lg border bg-background/90 p-5 shadow-sm backdrop-blur">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
              <Avatar className="size-20 border-4 border-background">
                <AvatarFallback className="bg-primary text-lg text-primary-foreground">
                  {creator.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <Badge className="mb-3 rounded-md">{creator.category}</Badge>
                <h1 className="text-3xl font-semibold tracking-tight">
                  {creator.name}
                </h1>
                <p className="mt-2 text-muted-foreground">{creator.headline}</p>
              </div>
              <Button asChild>
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
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_340px] lg:px-8">
        <div className="space-y-10">
          <section>
            <SectionHeader title="About" description={creator.bio} />
            <div className="mt-5 flex flex-wrap gap-2">
              {creator.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="rounded-md">
                  {skill}
                </Badge>
              ))}
            </div>
          </section>

          <section>
            <SectionHeader
              title="Services"
              description="Service packages include duration, price, and clear deliverables."
            />
            <div className="mt-5 grid gap-4">
              {creatorServices.map((service) => (
                <Card key={service.id} className="rounded-lg">
                  <CardHeader>
                    <CardTitle>{service.title}</CardTitle>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {service.description}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4 flex flex-wrap gap-2">
                      <Badge variant="outline" className="rounded-md">
                        {formatDuration(service.duration)}
                      </Badge>
                      <Badge variant="outline" className="rounded-md">
                        {formatCurrency(service.price)}
                      </Badge>
                    </div>
                    <ul className="grid gap-2 text-sm text-muted-foreground">
                      {service.deliverables.map((deliverable) => (
                        <li key={deliverable}>- {deliverable}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <SectionHeader title="Reviews" description="Realistic trust signals for booking decisions." />
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
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  Reviews will appear after completed sessions.
                </p>
              )}
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-lg border bg-card p-5">
          <p className="text-sm text-muted-foreground">Starting at</p>
          <p className="mt-1 text-3xl font-semibold">
            {formatCurrency(creator.priceFrom)}
          </p>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {creator.responseTime}. Availability: {creator.availabilityLabel}.
          </p>
          <Button asChild className="mt-5 w-full" size="lg">
            <Link href={`/book/${creator.slug}`}>Book with {creator.name.split(" ")[0]}</Link>
          </Button>
          <div className="mt-6">
            <p className="mb-3 text-sm font-medium">Portfolio proof</p>
            <div className="grid gap-2 text-sm text-muted-foreground">
              {creator.portfolio.map((item) => (
                <div key={item} className="rounded-md border bg-muted/30 p-3">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}

