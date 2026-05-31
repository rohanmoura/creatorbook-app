import { CalendarDays, Clock3, FileText } from "lucide-react";

import { StatusBadge } from "@/components/shared/status-badge";
import { ToastActionButton } from "@/components/shared/toast-action-button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatDuration } from "@/lib/formatters";
import type { Booking } from "@/types/marketplace";

type CreatorRequestCardProps = {
  booking: Booking;
};

export function CreatorRequestCard({ booking }: CreatorRequestCardProps) {
  const canAct = booking.status === "Pending" || booking.status === "Rescheduled";

  return (
    <Card className="premium-card-hover rounded-lg">
      <CardContent className="grid gap-4 p-4 lg:grid-cols-[1fr_auto]">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <StatusBadge status={booking.status} />
            <span className="text-xs text-muted-foreground">{booking.id}</span>
          </div>
          <h3 className="font-semibold">{booking.clientName}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Requested {booking.serviceName}
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

        <div className="flex gap-2 lg:w-40 lg:flex-col">
          <ToastActionButton
            label="Accept"
            message="Booking accepted"
            description={`${booking.id} would move to Confirmed.`}
            variant="default"
            disabled={!canAct}
            className="flex-1"
          />
          <ToastActionButton
            label="Reschedule"
            message="Reschedule suggestion mocked"
            description={`${booking.id} would ask the client to choose another slot.`}
            variant="outline"
            disabled={!canAct}
            className="flex-1"
          />
          <ToastActionButton
            label="Reject"
            message="Booking rejected"
            description={`${booking.id} would move to Rejected.`}
            variant="ghost"
            disabled={!canAct}
            className="flex-1"
          />
        </div>
      </CardContent>
    </Card>
  );
}
