import { CalendarDays, Clock3, FileText } from "lucide-react";

import { StatusBadge } from "@/components/shared/status-badge";
import { SubmitButton } from "@/components/shared/submit-button";
import { Card, CardContent } from "@/components/ui/card";
import { updateCreatorBookingStatus } from "@/app/dashboard/creator/actions";
import { formatCurrency, formatDuration } from "@/lib/formatters";
import type { Booking } from "@/types/marketplace";

type CreatorRequestCardProps = {
  booking: Booking;
};

export function CreatorRequestCard({ booking }: CreatorRequestCardProps) {
  const canAct = booking.status === "Pending" || booking.status === "Rescheduled";
  const canReschedule = booking.status === "Pending";

  return (
    <Card className="premium-card-hover overflow-hidden rounded-lg">
      <CardContent className="p-0">
        <div className="p-4">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={booking.status} />
              <span className="text-xs text-muted-foreground">{booking.id}</span>
            </div>
            <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
              {formatCurrency(booking.price)}
            </span>
          </div>
          <h3 className="font-semibold">{booking.clientName}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Requested {booking.serviceName}
          </p>
          <div className="mt-4 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
            <span className="flex items-center gap-2">
              <CalendarDays className="size-4" />
              {booking.date}
            </span>
            <span className="flex items-center gap-2">
              <Clock3 className="size-4" />
              {booking.time}, {formatDuration(booking.duration)}
            </span>
          </div>
          <p className="mt-4 flex gap-2 rounded-md bg-muted/35 p-3 text-sm leading-6 text-muted-foreground">
            <FileText className="mt-1 size-4 shrink-0" />
            {booking.notes}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t bg-muted/20 p-3">
          <form action={updateCreatorBookingStatus}>
            <input type="hidden" name="bookingId" value={booking.id} />
            <input type="hidden" name="status" value="Confirmed" />
            <SubmitButton
              size="sm"
              disabled={!canAct}
              className="h-8 px-3"
              pendingLabel="Accepting"
            >
              Accept
            </SubmitButton>
          </form>
          <form action={updateCreatorBookingStatus}>
            <input type="hidden" name="bookingId" value={booking.id} />
            <input type="hidden" name="status" value="Rescheduled" />
            <SubmitButton
              size="sm"
              variant="outline"
              disabled={!canReschedule}
              className="h-8 px-3"
              pendingLabel="Sending"
            >
              Reschedule
            </SubmitButton>
          </form>
          <form action={updateCreatorBookingStatus}>
            <input type="hidden" name="bookingId" value={booking.id} />
            <input type="hidden" name="status" value="Rejected" />
            <SubmitButton
              size="sm"
              variant="destructive"
              disabled={!canAct}
              className="h-8 px-3"
              pendingLabel="Rejecting"
            >
              Reject
            </SubmitButton>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
