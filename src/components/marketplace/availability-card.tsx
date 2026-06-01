import Link from "next/link";
import { CalendarClock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AvailabilitySlot } from "@/lib/server/availability-repository";
import type { CreatorProfile } from "@/types/marketplace";

type AvailabilityCardProps = {
  creator: CreatorProfile;
  slots?: AvailabilitySlot[];
};

export function AvailabilityCard({ creator, slots }: AvailabilityCardProps) {
  const visibleSlots =
    slots?.length
      ? slots.map(
          (slot) =>
            `${slot.date} ${slot.startTime}-${slot.endTime} (${slot.timezone})`
        )
      : creator.nextAvailableSlots;

  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarClock className="size-5 text-primary" />
          Availability preview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          {visibleSlots.map((slot) => (
            <div
              key={slot}
              className="flex items-center justify-between gap-3 rounded-md border bg-muted/25 p-3 text-sm"
            >
              <span>{slot}</span>
              <span className="text-muted-foreground">Open</span>
            </div>
          ))}
        </div>
        <Button asChild className="mt-4 w-full">
          <Link href={`/book/${creator.slug}`}>Choose a time</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
