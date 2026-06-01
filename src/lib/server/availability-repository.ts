import "server-only";

import type { CreatorProfile } from "@/types/marketplace";

import { getDb } from "./db";

export type AvailabilityStatus = "open" | "held" | "booked" | "blocked";

type AvailabilityRow = {
  id: string;
  creator_id: string;
  date: string;
  start_time: string;
  end_time: string;
  timezone: string;
  status: AvailabilityStatus;
  booking_id: string | null;
  created_at: string;
  updated_at: string;
};

export type AvailabilitySlot = {
  id: string;
  creatorId: string;
  date: string;
  startTime: string;
  endTime: string;
  timezone: string;
  status: AvailabilityStatus;
  bookingId?: string | null;
  createdAt: string;
  updatedAt: string;
};

function rowToAvailability(row: AvailabilityRow): AvailabilitySlot {
  return {
    id: row.id,
    creatorId: row.creator_id,
    date: row.date,
    startTime: row.start_time,
    endTime: row.end_time,
    timezone: row.timezone,
    status: row.status,
    bookingId: row.booking_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next.toISOString().slice(0, 10);
}

function fallbackSeedSlots(creatorId: string) {
  const today = new Date("2026-06-01T00:00:00.000Z");

  return [
    { creatorId, date: addDays(today, 2), startTime: "10:30", endTime: "11:30", timezone: "Asia/Kolkata", status: "open" as const },
    { creatorId, date: addDays(today, 4), startTime: "14:00", endTime: "15:00", timezone: "Asia/Kolkata", status: "open" as const },
    { creatorId, date: addDays(today, 6), startTime: "17:30", endTime: "18:30", timezone: "Asia/Kolkata", status: "open" as const },
  ];
}

export function seedAvailabilityForCreatorIfEmpty(creator: CreatorProfile) {
  const count = getDb()
    .prepare("SELECT COUNT(*) as count FROM creator_availability WHERE creator_id = ?")
    .get(creator.id) as { count: number };

  if (count.count > 0) {
    return;
  }

  replaceCreatorAvailability(creator.id, fallbackSeedSlots(creator.id));
}

export function listAvailabilityByCreatorId(creatorId: string) {
  const rows = getDb()
    .prepare(`
      SELECT * FROM creator_availability
      WHERE creator_id = ?
      ORDER BY date ASC, start_time ASC
    `)
    .all(creatorId) as AvailabilityRow[];

  return rows.map(rowToAvailability);
}

export function listOpenAvailabilityByCreatorId(creatorId: string) {
  return listAvailabilityByCreatorId(creatorId).filter(
    (slot) => slot.status === "open"
  );
}

export function getAvailabilitySlotById(id: string) {
  const row = getDb()
    .prepare("SELECT * FROM creator_availability WHERE id = ?")
    .get(id) as AvailabilityRow | undefined;

  return row ? rowToAvailability(row) : undefined;
}

export function replaceCreatorAvailability(
  creatorId: string,
  slots: Array<{
    creatorId?: string;
    date: string;
    startTime: string;
    endTime: string;
    timezone: string;
    status?: AvailabilityStatus;
  }>
) {
  const now = new Date().toISOString();
  const db = getDb();

  const transaction = db.transaction(() => {
    db.prepare(
      "DELETE FROM creator_availability WHERE creator_id = ? AND status IN ('open', 'blocked')"
    ).run(creatorId);

    const insert = db.prepare(`
      INSERT INTO creator_availability (
        id, creator_id, date, start_time, end_time, timezone, status,
        booking_id, created_at, updated_at
      ) VALUES (
        @id, @creatorId, @date, @startTime, @endTime, @timezone, @status,
        NULL, @createdAt, @updatedAt
      )
    `);

    slots.forEach((slot, index) => {
      insert.run({
        id: `avail-${creatorId}-${slot.date}-${slot.startTime.replace(":", "")}-${index + 1}`,
        creatorId,
        date: slot.date,
        startTime: slot.startTime,
        endTime: slot.endTime,
        timezone: slot.timezone,
        status: slot.status ?? "open",
        createdAt: now,
        updatedAt: now,
      });
    });
  });

  transaction();

  return listAvailabilityByCreatorId(creatorId);
}

export function holdAvailabilitySlot(id: string, bookingId: string) {
  const now = new Date().toISOString();

  const result = getDb()
    .prepare(`
      UPDATE creator_availability
      SET status = 'held', booking_id = ?, updated_at = ?
      WHERE id = ? AND status = 'open'
    `)
    .run(bookingId, now, id);

  return result.changes > 0;
}

export function updateAvailabilityForBooking(
  availabilityId: string | null | undefined,
  bookingId: string,
  status: AvailabilityStatus
) {
  if (!availabilityId) {
    return;
  }

  const now = new Date().toISOString();
  const bookingValue = status === "open" || status === "blocked" ? null : bookingId;

  getDb()
    .prepare(`
      UPDATE creator_availability
      SET status = ?, booking_id = ?, updated_at = ?
      WHERE id = ?
    `)
    .run(status, bookingValue, now, availabilityId);
}

export function formatAvailabilityLabel(slot: AvailabilitySlot) {
  return `${slot.date} ${slot.startTime}-${slot.endTime} (${slot.timezone})`;
}

export function getAvailabilityDurationMinutes(slot: AvailabilitySlot) {
  const [startHours, startMinutes] = slot.startTime.split(":").map(Number);
  const [endHours, endMinutes] = slot.endTime.split(":").map(Number);

  if (
    !Number.isFinite(startHours) ||
    !Number.isFinite(startMinutes) ||
    !Number.isFinite(endHours) ||
    !Number.isFinite(endMinutes)
  ) {
    return 0;
  }

  return endHours * 60 + endMinutes - (startHours * 60 + startMinutes);
}
