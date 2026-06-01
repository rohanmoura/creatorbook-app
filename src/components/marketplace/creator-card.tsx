import Link from "next/link";
import { ArrowRight, Bookmark, CalendarPlus, Clock, MapPin, Star } from "lucide-react";

import { toggleSavedCreator } from "@/app/saved-creators/actions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type { CreatorProfile } from "@/types/marketplace";

type CreatorCardProps = {
  creator: CreatorProfile;
  primaryService?: string;
  serviceCount?: number;
  isSaved?: boolean;
  returnTo?: string;
};

export function CreatorCard({
  creator,
  primaryService,
  serviceCount,
  isSaved = false,
  returnTo = "/explore",
}: CreatorCardProps) {
  return (
    <Card className="premium-card-hover h-full rounded-lg pt-0">
      <div className={cn("h-20 bg-gradient-to-br", creator.coverTone)} />
      <CardHeader className="-mt-10">
        <div className="flex items-end justify-between gap-3">
          <Avatar className="size-16 border-4 border-background">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {creator.avatar}
            </AvatarFallback>
          </Avatar>
          {creator.featured ? (
            <Badge className="rounded-md">Featured</Badge>
          ) : (
            <Badge
              variant="outline"
              className="rounded-md capitalize text-muted-foreground"
            >
              {creator.profileStatus}
            </Badge>
          )}
        </div>
        <div className="mt-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="text-lg">{creator.name}</CardTitle>
            <p className="mt-1 text-sm font-medium text-primary">
              {creator.category}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-xs text-muted-foreground">Starts at</p>
            <p className="font-semibold">{formatCurrency(creator.priceFrom)}</p>
          </div>
        </div>
        <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
          {creator.headline}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {primaryService ? (
          <div className="rounded-lg border bg-muted/25 p-3">
            <p className="text-xs font-medium uppercase text-muted-foreground">
              Popular service
            </p>
            <p className="mt-1 text-sm font-medium leading-5">{primaryService}</p>
            {serviceCount ? (
              <p className="mt-1 text-xs text-muted-foreground">
                {serviceCount} package{serviceCount > 1 ? "s" : ""} available
              </p>
            ) : null}
          </div>
        ) : null}
        <div className="flex flex-wrap gap-2">
          {creator.skills.slice(0, 3).map((skill) => (
            <Badge key={skill} variant="secondary" className="rounded-md">
              {skill}
            </Badge>
          ))}
        </div>
        <div className="grid gap-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <Star className="size-4 fill-amber-400 text-amber-400" />
            {creator.rating} ({creator.reviewCount} reviews)
          </span>
          <span className="flex items-center gap-2">
            <Clock className="size-4" />
            {creator.availabilityLabel}
          </span>
          <span className="flex items-center gap-2">
            <MapPin className="size-4" />
            {creator.location}
          </span>
        </div>
      </CardContent>
      <CardFooter className="mt-auto grid gap-2 sm:grid-cols-[1fr_auto]">
        <span className="text-sm text-muted-foreground">
          {creator.responseTime}
        </span>
        <div className="flex gap-2">
          <form action={toggleSavedCreator}>
            <input type="hidden" name="creatorId" value={creator.id} />
            <input type="hidden" name="intent" value={isSaved ? "unsave" : "save"} />
            <input type="hidden" name="returnTo" value={returnTo} />
            <Button type="submit" size="sm" variant="outline" aria-label={isSaved ? "Unsave creator" : "Save creator"}>
              <Bookmark className={cn("size-4", isSaved && "fill-current")} />
            </Button>
          </form>
          <Button asChild size="sm" variant="outline">
            <Link href={`/creators/${creator.slug}`}>
              View
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link href={`/book/${creator.slug}`}>
              <CalendarPlus className="size-4" />
              Book
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export function CreatorListCard({
  creator,
  primaryService,
  serviceCount,
  isSaved = false,
  returnTo = "/explore",
}: CreatorCardProps) {
  return (
    <Card className="premium-card-hover rounded-lg">
      <CardContent className="grid gap-4 p-4 md:grid-cols-[1fr_auto]">
        <div className="flex min-w-0 gap-4">
          <Avatar className="size-14 border">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {creator.avatar}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <h3 className="font-semibold">{creator.name}</h3>
              <Badge variant="secondary" className="rounded-md">
                {creator.category}
              </Badge>
              {creator.featured ? (
                <Badge className="rounded-md">Featured</Badge>
              ) : null}
            </div>
            <p className="text-sm leading-6 text-muted-foreground">
              {creator.headline}
            </p>
            {primaryService ? (
              <p className="mt-2 text-sm">
                <span className="font-medium">Popular:</span> {primaryService}
                {serviceCount ? (
                  <span className="text-muted-foreground">
                    {" "}
                    ({serviceCount} packages)
                  </span>
                ) : null}
              </p>
            ) : null}
            <div className="mt-3 flex flex-wrap gap-2">
              {creator.skills.slice(0, 4).map((skill) => (
                <Badge key={skill} variant="outline" className="rounded-md">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-3 md:w-52">
          <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-1">
            <span className="flex items-center gap-2 text-muted-foreground">
              <Star className="size-4 fill-amber-400 text-amber-400" />
              {creator.rating} ({creator.reviewCount})
            </span>
            <span className="flex items-center gap-2 text-muted-foreground">
              <Clock className="size-4" />
              {creator.availabilityLabel}
            </span>
            <span className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="size-4" />
              {creator.location}
            </span>
            <span className="font-semibold">
              From {formatCurrency(creator.priceFrom)}
            </span>
          </div>
          <div className="flex gap-2">
            <form action={toggleSavedCreator}>
              <input type="hidden" name="creatorId" value={creator.id} />
              <input type="hidden" name="intent" value={isSaved ? "unsave" : "save"} />
              <input type="hidden" name="returnTo" value={returnTo} />
              <Button type="submit" size="sm" variant="outline" aria-label={isSaved ? "Unsave creator" : "Save creator"}>
                <Bookmark className={cn("size-4", isSaved && "fill-current")} />
              </Button>
            </form>
            <Button asChild size="sm" variant="outline" className="flex-1">
              <Link href={`/creators/${creator.slug}`}>
                View
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="sm" className="flex-1">
              <Link href={`/book/${creator.slug}`}>
                <CalendarPlus className="size-4" />
                Book
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
