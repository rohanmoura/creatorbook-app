"use server";

import { redirect } from "next/navigation";

import { requireRole } from "@/lib/server/auth-guards";
import { getBookingById } from "@/lib/server/bookings-repository";
import { upsertPayment } from "@/lib/server/payments-repository";
import { getAppUrl, getStripe } from "@/lib/server/stripe";

export async function startStripeCheckout(formData: FormData) {
  const user = await requireRole("client");
  const bookingId = String(formData.get("bookingId") ?? "");
  const booking = getBookingById(bookingId);

  if (!booking || booking.clientId !== user.id) {
    redirect("/dashboard/client?payment=unauthorized");
  }

  const stripe = getStripe();

  if (!stripe) {
    upsertPayment({
      bookingId: booking.id,
      amount: booking.price * 100,
      currency: "usd",
      status: "config_required",
    });

    redirect(`/booking/success?request=${booking.id}&payment=config-required`);
  }

  const appUrl = getAppUrl();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: booking.price * 100,
          product_data: {
            name: booking.serviceName,
            description: `${booking.creatorName} session on CreatorBook`,
          },
        },
      },
    ],
    metadata: {
      bookingId: booking.id,
      clientId: booking.clientId,
      creatorId: booking.creatorId,
    },
    success_url: `${appUrl}/booking/success?request=${booking.id}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/booking/success?request=${booking.id}&payment=cancelled`,
  });

  upsertPayment({
    bookingId: booking.id,
    providerSessionId: session.id,
    amount: booking.price * 100,
    currency: "usd",
    status: "checkout_created",
    checkoutUrl: session.url,
  });

  if (!session.url) {
    redirect(`/booking/success?request=${booking.id}&payment=checkout-error`);
  }

  redirect(session.url);
}
