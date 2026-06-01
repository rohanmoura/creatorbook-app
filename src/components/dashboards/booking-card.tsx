import Link from "next/link";
import { CalendarDays, Clock3, Eye, FileText } from "lucide-react";

import { submitReport } from "@/app/reports/actions";
import { startStripeCheckout } from "@/app/payments/actions";
import { StatusBadge } from "@/components/shared/status-badge";
import { SubmitButton } from "@/components/shared/submit-button";
import { updateClientBookingStatus } from "@/app/dashboard/client/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatDuration } from "@/lib/formatters";
import type { Booking } from "@/types/marketplace";

type BookingCardProps = {
  booking: Booking;
  creatorSlug?: string;
  paymentStatus?: string;
};

export function BookingCard({ booking, creatorSlug, paymentStatus }: BookingCardProps) {
  const canClientAct = ["Pending", "Confirmed", "Rescheduled"].includes(
    booking.status
  );
  const canReschedule = booking.status === "Pending" || booking.status === "Confirmed";

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
            <span className="font-medium text-foreground capitalize">
              Payment: {paymentStatus?.replace("_", " ") ?? "not started"}
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
          <form action={updateClientBookingStatus}>
            <input type="hidden" name="bookingId" value={booking.id} />
            <input type="hidden" name="status" value="Rescheduled" />
            <SubmitButton
              size="sm"
              variant="outline"
              disabled={!canReschedule}
              pendingLabel="Requesting"
            >
              Reschedule
            </SubmitButton>
          </form>
          <form action={updateClientBookingStatus}>
            <input type="hidden" name="bookingId" value={booking.id} />
            <input type="hidden" name="status" value="Cancelled" />
            <SubmitButton
              size="sm"
              variant="ghost"
              disabled={!canClientAct}
              pendingLabel="Cancelling"
            >
              Cancel
            </SubmitButton>
          </form>
          {paymentStatus !== "paid" ? (
            <form action={startStripeCheckout}>
              <input type="hidden" name="bookingId" value={booking.id} />
              <SubmitButton size="sm" pendingLabel="Opening">
                Pay
              </SubmitButton>
            </form>
          ) : null}
          <form action={submitReport}>
            <input type="hidden" name="targetType" value="booking" />
            <input type="hidden" name="targetId" value={booking.id} />
            <input type="hidden" name="reason" value={`Client reported booking ${booking.id} for admin review.`} />
            <input type="hidden" name="returnTo" value="/dashboard/client" />
            <SubmitButton size="sm" variant="ghost" pendingLabel="Reporting">
              Report
            </SubmitButton>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
