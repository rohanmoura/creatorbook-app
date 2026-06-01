import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { upsertPayment } from "@/lib/server/payments-repository";
import { getStripe } from "@/lib/server/stripe";

export async function POST(request: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: "Stripe webhook is not configured" }, { status: 400 });
  }

  const signature = request.headers.get("stripe-signature");
  const body = await request.text();

  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid signature" },
      { status: 400 }
    );
  }

  if (
    event.type === "checkout.session.completed" ||
    event.type === "checkout.session.expired"
  ) {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = session.metadata?.bookingId;

    if (bookingId) {
      upsertPayment({
        bookingId,
        providerSessionId: session.id,
        amount: session.amount_total ?? 0,
        currency: session.currency ?? "usd",
        status:
          event.type === "checkout.session.completed" &&
          session.payment_status === "paid"
            ? "paid"
            : "cancelled",
        checkoutUrl: session.url,
      });
    }
  }

  return NextResponse.json({ received: true });
}
