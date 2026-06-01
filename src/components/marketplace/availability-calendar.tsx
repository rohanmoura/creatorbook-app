import { CalendarDays } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AvailabilitySlot } from "@/lib/server/availability-repository";
import { cn } from "@/lib/utils";

type AvailabilityCalendarProps = {
  slots: AvailabilitySlot[];
  title?: string;
};

const statusClass = {
  open: "border-emerald-200 bg-emerald-50 text-emerald-800",
  held: "border-amber-200 bg-amber-50 text-amber-800",
  booked: "border-sky-200 bg-sky-50 text-sky-800",
  blocked: "border-muted bg-muted/40 text-muted-foreground",
};

export function AvailabilityCalendar({
  slots,
  title = "Availability calendar",
}: AvailabilityCalendarProps) {
  const slotsByDate = slots.reduce<Record<string, AvailabilitySlot[]>>(
    (grouped, slot) => {
      grouped[slot.date] = [...(grouped[slot.date] ?? []), slot];
      return grouped;
    },
    {}
  );

  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="size-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {Object.entries(slotsByDate).length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {Object.entries(slotsByDate).map(([date, daySlots]) => (
              <div key={date} className="rounded-lg border p-3">
                <p className="font-medium">{date}</p>
                <div className="mt-3 grid gap-2">
                  {daySlots.map((slot) => (
                    <div
                      key={slot.id}
                      className={cn(
                        "rounded-md border px-3 py-2 text-sm",
                        statusClass[slot.status]
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span>
                          {slot.startTime}-{slot.endTime}
                        </span>
                        <Badge variant="outline" className="rounded-md capitalize">
                          {slot.status}
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs opacity-80">{slot.timezone}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed p-5 text-sm text-muted-foreground">
            No availability slots are currently configured.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
