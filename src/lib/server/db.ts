import "server-only";

import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import path from "node:path";

const dataDir = path.join(process.cwd(), "data");
const dbPath = path.join(dataDir, "creatorbook.sqlite");

type GlobalWithDb = typeof globalThis & {
  creatorBookDb?: Database.Database;
};

function createConnection() {
  mkdirSync(dataDir, { recursive: true });

  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      role TEXT NOT NULL,
      avatar TEXT NOT NULL,
      image TEXT,
      provider TEXT,
      onboarding_completed INTEGER NOT NULL DEFAULT 0,
      suspended INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS client_preferences (
      user_id TEXT PRIMARY KEY,
      categories TEXT NOT NULL,
      budget_range TEXT NOT NULL,
      booking_intent TEXT NOT NULL,
      timezone TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS saved_creators (
      user_id TEXT NOT NULL,
      creator_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      PRIMARY KEY (user_id, creator_id)
    );

    CREATE TABLE IF NOT EXISTS creators (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      headline TEXT NOT NULL,
      bio TEXT NOT NULL,
      category TEXT NOT NULL,
      skills TEXT NOT NULL,
      rating REAL NOT NULL,
      review_count INTEGER NOT NULL,
      location TEXT NOT NULL,
      language TEXT NOT NULL,
      response_time TEXT NOT NULL,
      profile_status TEXT NOT NULL,
      featured INTEGER NOT NULL,
      availability_label TEXT NOT NULL,
      price_from INTEGER NOT NULL,
      avatar TEXT NOT NULL,
      cover_tone TEXT NOT NULL,
      portfolio TEXT NOT NULL,
      completed_sessions INTEGER NOT NULL,
      repeat_client_rate INTEGER NOT NULL,
      verified INTEGER NOT NULL,
      next_available_slots TEXT NOT NULL,
      outcomes TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS services (
      id TEXT PRIMARY KEY,
      creator_id TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      duration INTEGER NOT NULL,
      price INTEGER NOT NULL,
      deliverables TEXT NOT NULL,
      category TEXT NOT NULL,
      archived INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      description TEXT NOT NULL,
      creator_count INTEGER NOT NULL,
      archived INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      client_id TEXT NOT NULL,
      creator_id TEXT NOT NULL,
      service_id TEXT NOT NULL,
      availability_id TEXT,
      client_name TEXT NOT NULL,
      creator_name TEXT NOT NULL,
      service_name TEXT NOT NULL,
      category TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      duration INTEGER NOT NULL,
      price INTEGER NOT NULL,
      status TEXT NOT NULL,
      notes TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS creator_availability (
      id TEXT PRIMARY KEY,
      creator_id TEXT NOT NULL,
      date TEXT NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      timezone TEXT NOT NULL,
      status TEXT NOT NULL,
      booking_id TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS booking_events (
      id TEXT PRIMARY KEY,
      booking_id TEXT NOT NULL,
      actor_id TEXT NOT NULL,
      actor_role TEXT NOT NULL,
      from_status TEXT,
      to_status TEXT NOT NULL,
      note TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY,
      booking_id TEXT NOT NULL,
      provider TEXT NOT NULL,
      provider_session_id TEXT,
      amount INTEGER NOT NULL,
      currency TEXT NOT NULL,
      status TEXT NOT NULL,
      checkout_url TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      booking_id TEXT NOT NULL,
      client_id TEXT NOT NULL,
      creator_id TEXT NOT NULL,
      rating INTEGER NOT NULL,
      text TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS reports (
      id TEXT PRIMARY KEY,
      reported_by TEXT NOT NULL,
      target_type TEXT NOT NULL,
      target_id TEXT NOT NULL,
      reason TEXT NOT NULL,
      status TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS admin_audit_events (
      id TEXT PRIMARY KEY,
      admin_id TEXT NOT NULL,
      action TEXT NOT NULL,
      target_type TEXT NOT NULL,
      target_id TEXT NOT NULL,
      note TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      recipient_id TEXT NOT NULL,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      target_href TEXT,
      read_at TEXT,
      created_at TEXT NOT NULL
    );
  `);

  const userColumns = db
    .prepare("PRAGMA table_info(users)")
    .all() as { name: string }[];

  if (!userColumns.some((column) => column.name === "onboarding_completed")) {
    db.exec("ALTER TABLE users ADD COLUMN onboarding_completed INTEGER NOT NULL DEFAULT 0");
  }

  if (!userColumns.some((column) => column.name === "suspended")) {
    db.exec("ALTER TABLE users ADD COLUMN suspended INTEGER NOT NULL DEFAULT 0");
  }

  const categoryColumns = db
    .prepare("PRAGMA table_info(categories)")
    .all() as { name: string }[];

  if (!categoryColumns.some((column) => column.name === "archived")) {
    db.exec("ALTER TABLE categories ADD COLUMN archived INTEGER NOT NULL DEFAULT 0");
  }

  const serviceColumns = db
    .prepare("PRAGMA table_info(services)")
    .all() as { name: string }[];

  if (!serviceColumns.some((column) => column.name === "archived")) {
    db.exec("ALTER TABLE services ADD COLUMN archived INTEGER NOT NULL DEFAULT 0");
  }

  const bookingColumns = db
    .prepare("PRAGMA table_info(bookings)")
    .all() as { name: string }[];

  if (!bookingColumns.some((column) => column.name === "availability_id")) {
    db.exec("ALTER TABLE bookings ADD COLUMN availability_id TEXT");
  }

  return db;
}

export function getDb() {
  const globalForDb = globalThis as GlobalWithDb;

  if (!globalForDb.creatorBookDb) {
    globalForDb.creatorBookDb = createConnection();
  }

  return globalForDb.creatorBookDb;
}
