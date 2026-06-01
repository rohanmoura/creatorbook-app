import "server-only";

import { getDb } from "./db";

export type AuthUserRole = "client" | "creator" | "admin";

type UserRow = {
  id: string;
  name: string;
  email: string;
  role: AuthUserRole;
  avatar: string;
  image: string | null;
  provider: string | null;
  onboarding_completed: number;
  suspended: number;
  created_at: string;
  updated_at: string;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: AuthUserRole;
  avatar: string;
  image?: string | null;
  provider?: string | null;
  onboardingCompleted: boolean;
  suspended: boolean;
  createdAt: string;
  updatedAt: string;
};

function rowToUser(row: UserRow): AuthUser {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    avatar: row.avatar,
    image: row.image,
    provider: row.provider,
    onboardingCompleted: Boolean(row.onboarding_completed),
    suspended: Boolean(row.suspended),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function initialsFromName(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function idFromEmail(email: string) {
  return `user-${email.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;
}

function adminEmails() {
  return (process.env.CREATORBOOK_ADMIN_EMAILS ?? "admin@creatorbook.demo")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

function initialRoleForEmail(email: string): AuthUserRole {
  if (adminEmails().includes(email.toLowerCase())) {
    return "admin";
  }

  return "client";
}

export function upsertAuthUser(input: {
  email: string;
  name?: string | null;
  image?: string | null;
  provider?: string | null;
}) {
  const email = input.email.toLowerCase();
  const existing = getUserByEmail(email);
  const now = new Date().toISOString();
  const name = input.name?.trim() || email.split("@")[0] || "CreatorBook User";
  const avatar = initialsFromName(name);

  if (existing) {
    getDb()
      .prepare(
        "UPDATE users SET name = ?, avatar = ?, image = ?, provider = ?, updated_at = ? WHERE email = ?"
      )
      .run(name, avatar, input.image ?? null, input.provider ?? null, now, email);

    return getUserByEmail(email);
  }

  getDb()
    .prepare(
      "INSERT INTO users (id, name, email, role, avatar, image, provider, onboarding_completed, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    )
    .run(
      idFromEmail(email),
      name,
      email,
      initialRoleForEmail(email),
      avatar,
      input.image ?? null,
      input.provider ?? null,
      initialRoleForEmail(email) === "admin" ? 1 : 0,
      now,
      now
    );

  return getUserByEmail(email);
}

export function updateUserRole(email: string, role: Exclude<AuthUserRole, "admin">) {
  const now = new Date().toISOString();

  getDb()
    .prepare(
      "UPDATE users SET role = ?, onboarding_completed = 1, updated_at = ? WHERE email = ?"
    )
    .run(role, now, email.toLowerCase());

  return getUserByEmail(email);
}

export function getUserByEmail(email: string) {
  const row = getDb()
    .prepare("SELECT * FROM users WHERE email = ?")
    .get(email.toLowerCase()) as UserRow | undefined;

  return row ? rowToUser(row) : undefined;
}

export function listUsers() {
  const rows = getDb()
    .prepare("SELECT * FROM users ORDER BY created_at DESC")
    .all() as UserRow[];

  return rows.map(rowToUser);
}

export function updateUserSuspension(id: string, suspended: boolean) {
  const now = new Date().toISOString();

  getDb()
    .prepare("UPDATE users SET suspended = ?, updated_at = ? WHERE id = ?")
    .run(suspended ? 1 : 0, now, id);

  const row = getDb()
    .prepare("SELECT * FROM users WHERE id = ?")
    .get(id) as UserRow | undefined;

  return row ? rowToUser(row) : undefined;
}
