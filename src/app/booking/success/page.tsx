import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock3 } from "lucide-react";

import { startStripeCheckout } from "@/app/payments/actions";
import { BookingTimeline } from "@/components/booking/booking-timeline";
import { StatusBadge } from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDuration } from "@/lib/formatters";
import { getBookingById } from "@/lib/server/bookings-repository";
import {
  getCreatorByIdFromDb,
  getCreatorBySlugFromDb,
  getServicesByCreatorIdFromDb,
} from "@/lib/server/marketplace-repository";
import {
  getPaymentByBookingId,
  upsertPayment,
} from "@/lib/server/payments-repository";
import { getStripe } from "@/lib/server/stripe";

type BookingSuccessPageProps = {
  searchParams: Promise<{
    request?: string;
    creator?: string;
    service?: string;
    slot?: string;
    date?: string;
    time?: string;
    notes?: string;
    payment?: string;
    session_id?: string;
  }>;
};

export default async function BookingSuccessPage({
  searchParams,
}: BookingSuccessPageProps) {
  const params = await searchParams;
  const booking = params.request ? getBookingById(params.request) : undefined;
  let payment = booking ? getPaymentByBookingId(booking.id) : undefined;

  if (booking && params.session_id && payment?.status !== "paid") {
    const stripe = getStripe();
    const session = stripe
      ? await stripe.checkout.sessions.retrieve(params.session_id)
      : undefined;

    payment = upsertPayment({
      bookingId: booking.id,
      providerSessionId: params.session_id,
      amount: booking.price * 100,
      currency: "usd",
      status: session?.payment_status === "paid" ? "paid" : "checkout_created",
      checkoutUrl: payment?.checkoutUrl,
    });
  }

  if (booking && params.payment === "cancelled") {
    payment = upsertPayment({
      bookingId: booking.id,
      amount: booking.price * 100,
      currency: "usd",
      status: "cancelled",
      checkoutUrl: payment?.checkoutUrl,
      providerSessionId: payment?.providerSessionId,
    });
  }
  const creator =
    (booking ? getCreatorByIdFromDb(booking.creatorId) : undefined) ??
    (params.creator ? getCreatorBySlugFromDb(params.creator) : undefined);
  const services = creator ? getServicesByCreatorIdFromDb(creator.id) : [];
  const service =
    services.find((item) => item.id === (booking?.serviceId ?? params.service)) ??
    services[0];
  const requestId = booking?.id ?? "CB-1032";

  return (
    <main className="mx-auto grid max-w-5xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_320px] lg:px-8">
      <Card className="rounded-lg">
        <CardContent className="p-8">
          <div className="mb-6 flex size-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="size-7" />
          </div>
          <Badge variant="secondary" className="mb-4 rounded-md">
            Request ID {requestId}
          </Badge>
          <h1 className="text-3xl font-semibold tracking-tight">
            Booking request submitted
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
            Your request is now marked as Pending. The creator can accept,
            reject, or suggest a rescheduled time from their dashboard.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border bg-muted/25 p-4">
              <p className="text-sm text-muted-foreground">Current status</p>
              <div className="mt-2">
                <StatusBadge status={booking?.status ?? "Pending"} />
              </div>
            </div>
            <div className="rounded-lg border bg-muted/25 p-4">
              <p className="text-sm text-muted-foreground">Creator response</p>
              <p className="mt-2 font-medium">
                {creator?.responseTime ?? "Usually within 2 hours"}
              </p>
            </div>
            <div className="rounded-lg border bg-muted/25 p-4">
              <p className="text-sm text-muted-foreground">Payment status</p>
              <p className="mt-2 font-medium capitalize">
                {payment?.status.replace("_", " ") ?? "Not started"}
              </p>
            </div>
          </div>

          {creator && service ? (
            <div className="mt-8 rounded-lg border bg-card p-5">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Requested session
                  </p>
                  <h2 className="mt-1 text-xl font-semibold">
                    {service.title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    With {creator.name} on{" "}
                    {booking?.date ?? params.date ?? "selected date"} at{" "}
                    {booking?.time ?? params.time ?? "selected time"}.
                  </p>
                </div>
                <div className="rounded-lg border bg-muted/25 p-3 text-sm">
                  <p className="font-medium">{formatCurrency(service.price)}</p>
                  <p className="mt-1 text-muted-foreground">
                    {formatDuration(service.duration)}
                  </p>
                </div>
              </div>
              {params.slot ? (
                <p className="mt-4 rounded-md bg-muted/35 px-3 py-2 text-sm text-muted-foreground">
                  Preferred slot: {params.slot}
                </p>
              ) : null}
            </div>
          ) : null}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {booking && payment?.status !== "paid" ? (
              <form action={startStripeCheckout}>
                <input type="hidden" name="bookingId" value={booking.id} />
                <Button type="submit">
                  Continue to Stripe checkout
                  <ArrowRight className="size-4" />
                </Button>
              </form>
            ) : null}
            <Button asChild>
              <Link href="/dashboard/client">
                View client dashboard
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/explore">Explore more creators</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <aside className="space-y-4">
        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock3 className="size-5 text-primary" />
              Booking timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BookingTimeline />
          </CardContent>
        </Card>

        <Card className="rounded-lg">
          <CardContent className="p-5">
            <p className="text-sm font-medium">Dashboard impact</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              This request appears in the client dashboard as Pending and in the
              creator dashboard as a request awaiting action.
            </p>
            {creator ? (
              <Button asChild variant="outline" className="mt-4 w-full">
                <Link href={`/creators/${creator.slug}`}>Back to creator</Link>
              </Button>
            ) : null}
          </CardContent>
        </Card>
      </aside>
    </main>
  );
}
