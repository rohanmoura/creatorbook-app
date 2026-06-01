import "server-only";

import { getDb } from "./db";

type ClientPreferencesRow = {
  user_id: string;
  categories: string;
  budget_range: string;
  booking_intent: string;
  timezone: string;
  updated_at: string;
};

export type ClientPreferences = {
  userId: string;
  categories: string[];
  budgetRange: string;
  bookingIntent: string;
  timezone: string;
  updatedAt: string;
};

function rowToPreferences(row: ClientPreferencesRow): ClientPreferences {
  return {
    userId: row.user_id,
    categories: JSON.parse(row.categories) as string[],
    budgetRange: row.budget_range,
    bookingIntent: row.booking_intent,
    timezone: row.timezone,
    updatedAt: row.updated_at,
  };
}

export function upsertClientPreferences(input: {
  userId: string;
  categories: string[];
  budgetRange: string;
  bookingIntent: string;
  timezone: string;
}) {
  const updatedAt = new Date().toISOString();

  getDb()
    .prepare(`
      INSERT INTO client_preferences (
        user_id, categories, budget_range, booking_intent, timezone, updated_at
      ) VALUES (
        @userId, @categories, @budgetRange, @bookingIntent, @timezone, @updatedAt
      )
      ON CONFLICT(user_id) DO UPDATE SET
        categories = excluded.categories,
        budget_range = excluded.budget_range,
        booking_intent = excluded.booking_intent,
        timezone = excluded.timezone,
        updated_at = excluded.updated_at
    `)
    .run({
      ...input,
      categories: JSON.stringify(input.categories),
      updatedAt,
    });

  return getClientPreferences(input.userId);
}

export function getClientPreferences(userId: string) {
  const row = getDb()
    .prepare("SELECT * FROM client_preferences WHERE user_id = ?")
    .get(userId) as ClientPreferencesRow | undefined;

  return row ? rowToPreferences(row) : undefined;
}
