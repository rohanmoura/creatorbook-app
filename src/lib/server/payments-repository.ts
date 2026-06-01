import "server-only";

import { getDb } from "./db";

export type PaymentStatus =
  | "pending"
  | "checkout_created"
  | "paid"
  | "cancelled"
  | "config_required";

type PaymentRow = {
  id: string;
  booking_id: string;
  provider: string;
  provider_session_id: string | null;
  amount: number;
  currency: string;
  status: PaymentStatus;
  checkout_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Payment = {
  id: string;
  bookingId: string;
  provider: string;
  providerSessionId?: string | null;
  amount: number;
  currency: string;
  status: PaymentStatus;
  checkoutUrl?: string | null;
  createdAt: string;
  updatedAt: string;
};

function rowToPayment(row: PaymentRow): Payment {
  return {
    id: row.id,
    bookingId: row.booking_id,
    provider: row.provider,
    providerSessionId: row.provider_session_id,
    amount: row.amount,
    currency: row.currency,
    status: row.status,
    checkoutUrl: row.checkout_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function getPaymentByBookingId(bookingId: string) {
  const row = getDb()
    .prepare("SELECT * FROM payments WHERE booking_id = ? ORDER BY created_at DESC LIMIT 1")
    .get(bookingId) as PaymentRow | undefined;

  return row ? rowToPayment(row) : undefined;
}

export function getPaymentBySessionId(sessionId: string) {
  const row = getDb()
    .prepare("SELECT * FROM payments WHERE provider_session_id = ?")
    .get(sessionId) as PaymentRow | undefined;

  return row ? rowToPayment(row) : undefined;
}

export function listPayments() {
  const rows = getDb()
    .prepare("SELECT * FROM payments ORDER BY created_at DESC")
    .all() as PaymentRow[];

  return rows.map(rowToPayment);
}

export function upsertPayment(input: {
  bookingId: string;
  provider?: string;
  providerSessionId?: string | null;
  amount: number;
  currency: string;
  status: PaymentStatus;
  checkoutUrl?: string | null;
}) {
  const now = new Date().toISOString();
  const existing = getPaymentByBookingId(input.bookingId);
  const id = existing?.id ?? `payment-${input.bookingId.toLowerCase()}`;

  getDb()
    .prepare(`
      INSERT INTO payments (
        id, booking_id, provider, provider_session_id, amount, currency,
        status, checkout_url, created_at, updated_at
      ) VALUES (
        @id, @bookingId, @provider, @providerSessionId, @amount, @currency,
        @status, @checkoutUrl, @createdAt, @updatedAt
      )
      ON CONFLICT(id) DO UPDATE SET
        provider_session_id = excluded.provider_session_id,
        amount = excluded.amount,
        currency = excluded.currency,
        status = excluded.status,
        checkout_url = excluded.checkout_url,
        updated_at = excluded.updated_at
    `)
    .run({
      id,
      bookingId: input.bookingId,
      provider: input.provider ?? "stripe",
      providerSessionId: input.providerSessionId ?? null,
      amount: input.amount,
      currency: input.currency,
      status: input.status,
      checkoutUrl: input.checkoutUrl ?? null,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    });

  return getPaymentByBookingId(input.bookingId);
}
