import "server-only";

import { bookings as seedBookings } from "@/data/mock-bookings";
import type { Booking, BookingStatus } from "@/types/marketplace";

import {
  holdAvailabilitySlot,
  updateAvailabilityForBooking,
} from "./availability-repository";
import { getDb } from "./db";

type BookingRow = {
  id: string;
  client_id: string;
  creator_id: string;
  service_id: string;
  availability_id: string | null;
  client_name: string;
  creator_name: string;
  service_name: string;
  category: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  status: BookingStatus;
  notes: string;
  created_at: string;
};

type CreateBookingInput = Omit<Booking, "createdAt"> & {
  createdAt?: string;
};

type BookingEventRow = {
  id: string;
  booking_id: string;
  actor_id: string;
  actor_role: "client" | "creator" | "admin" | "system";
  from_status: BookingStatus | null;
  to_status: BookingStatus;
  note: string;
  created_at: string;
};

export type BookingEvent = {
  id: string;
  bookingId: string;
  actorId: string;
  actorRole: "client" | "creator" | "admin" | "system";
  fromStatus?: BookingStatus | null;
  toStatus: BookingStatus;
  note: string;
  createdAt: string;
};

const allowedTransitions: Record<BookingStatus, BookingStatus[]> = {
  Pending: ["Confirmed", "Rejected", "Rescheduled", "Cancelled"],
  Confirmed: ["Completed", "Cancelled"],
  Rescheduled: ["Confirmed", "Rejected", "Cancelled"],
  Completed: [],
  Cancelled: [],
  Rejected: [],
};

function rowToBooking(row: BookingRow): Booking {
  return {
    id: row.id,
    clientId: row.client_id,
    creatorId: row.creator_id,
    serviceId: row.service_id,
    availabilityId: row.availability_id,
    clientName: row.client_name,
    creatorName: row.creator_name,
    serviceName: row.service_name,
    category: row.category,
    date: row.date,
    time: row.time,
    duration: row.duration,
    price: row.price,
    status: row.status,
    notes: row.notes,
    createdAt: row.created_at,
  };
}

function rowToBookingEvent(row: BookingEventRow): BookingEvent {
  return {
    id: row.id,
    bookingId: row.booking_id,
    actorId: row.actor_id,
    actorRole: row.actor_role,
    fromStatus: row.from_status,
    toStatus: row.to_status,
    note: row.note,
    createdAt: row.created_at,
  };
}

function createBookingEvent(input: {
  bookingId: string;
  actorId: string;
  actorRole: BookingEvent["actorRole"];
  fromStatus?: BookingStatus | null;
  toStatus: BookingStatus;
  note: string;
}) {
  const createdAt = new Date().toISOString();
  const count = getDb()
    .prepare("SELECT COUNT(*) as count FROM booking_events WHERE booking_id = ?")
    .get(input.bookingId) as { count: number };

  getDb()
    .prepare(`
      INSERT INTO booking_events (
        id, booking_id, actor_id, actor_role, from_status, to_status, note, created_at
      ) VALUES (
        @id, @bookingId, @actorId, @actorRole, @fromStatus, @toStatus, @note, @createdAt
      )
    `)
    .run({
      id: `${input.bookingId}-event-${count.count + 1}`,
      ...input,
      fromStatus: input.fromStatus ?? null,
      createdAt,
    });
}

export function canTransitionBooking(
  fromStatus: BookingStatus,
  toStatus: BookingStatus
) {
  return allowedTransitions[fromStatus].includes(toStatus);
}

export function seedBookingsIfEmpty() {
  const db = getDb();
  const count = db
    .prepare("SELECT COUNT(*) as count FROM bookings")
    .get() as { count: number };

  if (count.count > 0) {
    return;
  }

  const insert = db.prepare(`
    INSERT INTO bookings (
      id, client_id, creator_id, service_id, availability_id, client_name, creator_name,
      service_name, category, date, time, duration, price, status, notes, created_at
    ) VALUES (
      @id, @clientId, @creatorId, @serviceId, @availabilityId, @clientName, @creatorName,
      @serviceName, @category, @date, @time, @duration, @price, @status, @notes, @createdAt
    )
  `);

  const transaction = db.transaction(() => {
    for (const booking of seedBookings) {
      insert.run({ ...booking, availabilityId: null });
    }
  });

  transaction();
}

export function listBookings() {
  seedBookingsIfEmpty();

  const rows = getDb()
    .prepare("SELECT * FROM bookings ORDER BY created_at DESC, id DESC")
    .all() as BookingRow[];

  return rows.map(rowToBooking);
}

export function listBookingsByClientId(clientId: string) {
  seedBookingsIfEmpty();

  const rows = getDb()
    .prepare(
      "SELECT * FROM bookings WHERE client_id = ? ORDER BY created_at DESC, id DESC"
    )
    .all(clientId) as BookingRow[];

  return rows.map(rowToBooking);
}

export function listBookingsByCreatorId(creatorId: string) {
  seedBookingsIfEmpty();

  const rows = getDb()
    .prepare(
      "SELECT * FROM bookings WHERE creator_id = ? ORDER BY created_at DESC, id DESC"
    )
    .all(creatorId) as BookingRow[];

  return rows.map(rowToBooking);
}

export function getBookingById(id: string) {
  seedBookingsIfEmpty();

  const row = getDb()
    .prepare("SELECT * FROM bookings WHERE id = ?")
    .get(id) as BookingRow | undefined;

  return row ? rowToBooking(row) : undefined;
}

export function createBooking(input: CreateBookingInput) {
  seedBookingsIfEmpty();

  const createdAt = input.createdAt ?? new Date().toISOString();

  getDb()
    .prepare(`
      INSERT INTO bookings (
        id, client_id, creator_id, service_id, availability_id, client_name, creator_name,
        service_name, category, date, time, duration, price, status, notes, created_at
      ) VALUES (
        @id, @clientId, @creatorId, @serviceId, @availabilityId, @clientName, @creatorName,
        @serviceName, @category, @date, @time, @duration, @price, @status, @notes, @createdAt
      )
    `)
    .run({ ...input, availabilityId: input.availabilityId ?? null, createdAt });

  createBookingEvent({
    bookingId: input.id,
    actorId: input.clientId,
    actorRole: "client",
    fromStatus: null,
    toStatus: input.status,
    note: "Booking request submitted.",
  });

  if (input.availabilityId) {
    holdAvailabilitySlot(input.availabilityId, input.id);
  }

  return getBookingById(input.id);
}

export function updateBookingStatus(
  id: string,
  status: BookingStatus,
  actor: {
    actorId: string;
    actorRole: BookingEvent["actorRole"];
    note?: string;
  } = {
    actorId: "system",
    actorRole: "system",
  }
) {
  seedBookingsIfEmpty();

  const booking = getBookingById(id);

  if (!booking || !canTransitionBooking(booking.status, status)) {
    return undefined;
  }

  getDb()
    .prepare("UPDATE bookings SET status = ? WHERE id = ?")
    .run(status, id);

  if (booking.availabilityId) {
    if (status === "Confirmed") {
      updateAvailabilityForBooking(booking.availabilityId, id, "booked");
    }

    if (status === "Cancelled" || status === "Rejected") {
      updateAvailabilityForBooking(booking.availabilityId, id, "open");
    }

    if (status === "Rescheduled") {
      updateAvailabilityForBooking(booking.availabilityId, id, "held");
    }
  }

  createBookingEvent({
    bookingId: id,
    actorId: actor.actorId,
    actorRole: actor.actorRole,
    fromStatus: booking.status,
    toStatus: status,
    note: actor.note ?? `Booking status changed to ${status}.`,
  });

  return getBookingById(id);
}

export function hasCreatorSlotConflict(input: {
  creatorId: string;
  date: string;
  time: string;
  availabilityId?: string;
}) {
  seedBookingsIfEmpty();

  const row = getDb()
    .prepare(`
      SELECT id FROM bookings
      WHERE creator_id = ?
        AND date = ?
        AND time = ?
        AND (? IS NULL OR availability_id = ?)
        AND status IN ('Pending', 'Confirmed', 'Rescheduled')
      LIMIT 1
    `)
    .get(
      input.creatorId,
      input.date,
      input.time,
      input.availabilityId ?? null,
      input.availabilityId ?? null
    ) as { id: string } | undefined;

  return Boolean(row);
}

export function listBookingEvents(bookingId: string) {
  seedBookingsIfEmpty();

  const rows = getDb()
    .prepare("SELECT * FROM booking_events WHERE booking_id = ? ORDER BY created_at ASC")
    .all(bookingId) as BookingEventRow[];

  return rows.map(rowToBookingEvent);
}

export function getNextBookingId() {
  seedBookingsIfEmpty();

  const rows = getDb()
    .prepare("SELECT id FROM bookings WHERE id LIKE 'CB-%'")
    .all() as Array<{ id: string }>;

  const nextNumber =
    rows.reduce((max, row) => {
      const parsed = Number(row.id.replace("CB-", ""));
      return Number.isFinite(parsed) ? Math.max(max, parsed) : max;
    }, 1000) + 1;

  return `CB-${nextNumber}`;
}
