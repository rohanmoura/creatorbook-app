import Link from "next/link";
import { CalendarDays, Clock3, Eye, FileText } from "lucide-react";

import { StatusBadge } from "@/components/shared/status-badge";
import { ToastActionButton } from "@/components/shared/toast-action-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatDuration } from "@/lib/formatters";
import type { Booking } from "@/types/marketplace";

type BookingCardProps = {
  booking: Booking;
  creatorSlug?: string;
};

export function BookingCard({ booking, creatorSlug }: BookingCardProps) {
  return (
    <Card className="premium-card-hover rounded-lg">
      <CardContent className="grid gap-4 p-4">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <StatusBadge status={booking.status} />
            <span className="text-xs text-muted-foreground">{booking.id}</span>
          </div>
          <h3 className="font-semibold">{booking.serviceName}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            with {booking.creatorName} in {booking.category}
          </p>
          <div className="mt-4 grid gap-2 text-sm text-muted-foreground md:grid-cols-3">
            <span className="flex items-center gap-2">
              <CalendarDays className="size-4" />
              {booking.date}
            </span>
            <span className="flex items-center gap-2">
              <Clock3 className="size-4" />
              {booking.time}, {formatDuration(booking.duration)}
            </span>
            <span className="font-medium text-foreground">
              {formatCurrency(booking.price)}
            </span>
          </div>
          <p className="mt-4 flex gap-2 rounded-md bg-muted/35 p-3 text-sm leading-6 text-muted-foreground">
            <FileText className="mt-1 size-4 shrink-0" />
            {booking.notes}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t pt-3">
          <Button asChild size="sm" variant="outline">
            <Link href={creatorSlug ? `/creators/${creatorSlug}` : "/explore"}>
              <Eye className="size-3.5" />
              View
            </Link>
          </Button>
          <ToastActionButton
            label="Reschedule"
            message="Reschedule request mocked"
            description={`${booking.id} would open a calendar reschedule flow.`}
            variant="outline"
          />
          <ToastActionButton
            label="Cancel"
            message="Cancellation mocked"
            description={`${booking.id} would move to Cancelled after confirmation.`}
            variant="ghost"
          />
        </div>
      </CardContent>
    </Card>
  );
}
