import Link from "next/link";
import { BadgeCheck, CreditCard, ShieldCheck } from "lucide-react";

import { BookingTimeline } from "@/components/booking/booking-timeline";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";
import type { CreatorProfile, Service } from "@/types/marketplace";

type BookingSummaryCardProps = {
  creator: CreatorProfile;
  service?: Service;
};

export function BookingSummaryCard({
  creator,
  service,
}: BookingSummaryCardProps) {
  return (
    <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
      <Card className="rounded-lg">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Booking summary</p>
              <h2 className="mt-2 text-xl font-semibold">{creator.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {creator.category} expert
              </p>
            </div>
            {creator.verified ? (
              <Badge variant="secondary" className="rounded-md">
                <BadgeCheck className="size-3.5" />
                Verified
              </Badge>
            ) : null}
          </div>

          <div className="mt-5 rounded-lg border bg-muted/25 p-4">
            <p className="text-sm font-medium">
              {service?.title ?? "Selected service"}
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Requests stay pending until accepted by the creator.
            </p>
          </div>

          <div className="mt-5 grid gap-3 text-sm">
            <div className="flex justify-between gap-3">
              <span className="text-muted-foreground">Session price</span>
              <span className="font-medium">
                {formatCurrency(service?.price ?? creator.priceFrom)}
              </span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-muted-foreground">Platform fee</span>
              <span className="font-medium">$0 mock</span>
            </div>
            <div className="flex justify-between gap-3 border-t pt-3">
              <span className="font-medium">Due today</span>
              <span className="font-semibold">
                {formatCurrency(service?.price ?? creator.priceFrom)}
              </span>
            </div>
          </div>

          <div className="mt-5 grid gap-2 rounded-lg border bg-background p-3 text-sm text-muted-foreground">
            <span className="flex gap-2">
              <CreditCard className="mt-0.5 size-4 shrink-0" />
              Payment is mocked for this portfolio MVP.
            </span>
            <span className="flex gap-2">
              <ShieldCheck className="mt-0.5 size-4 shrink-0" />
              Request enters Pending status after submission.
            </span>
          </div>

          <Button asChild variant="outline" className="mt-5 w-full">
            <Link href={`/creators/${creator.slug}`}>Back to profile</Link>
          </Button>
        </CardContent>
      </Card>

      <Card className="rounded-lg">
        <CardContent className="p-5">
          <p className="mb-4 text-sm font-medium">What happens next</p>
          <BookingTimeline compact />
        </CardContent>
      </Card>
    </aside>
  );
}

