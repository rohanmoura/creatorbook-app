import Link from "next/link";
import { ArrowRight, Clock, MapPin, Star } from "lucide-react";

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
};

export function CreatorCard({ creator }: CreatorCardProps) {
  return (
    <Card className="h-full rounded-lg">
      <div className={cn("h-24 bg-gradient-to-br", creator.coverTone)} />
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
            <Badge variant="outline" className="rounded-md">
              {creator.profileStatus}
            </Badge>
          )}
        </div>
        <CardTitle className="mt-3 text-lg">{creator.name}</CardTitle>
        <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
          {creator.headline}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="rounded-md">
            {creator.category}
          </Badge>
          <Badge variant="outline" className="rounded-md">
            From {formatCurrency(creator.priceFrom)}
          </Badge>
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
      <CardFooter className="mt-auto justify-between gap-3">
        <span className="text-sm text-muted-foreground">
          {creator.responseTime}
        </span>
        <Button asChild size="sm">
          <Link href={`/creators/${creator.slug}`}>
            View
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

