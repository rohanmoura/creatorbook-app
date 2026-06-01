import "server-only";

import { getDb } from "./db";

type NotificationRow = {
  id: string;
  recipient_id: string;
  type: string;
  title: string;
  body: string;
  target_href: string | null;
  read_at: string | null;
  created_at: string;
};

export type Notification = {
  id: string;
  recipientId: string;
  type: string;
  title: string;
  body: string;
  targetHref?: string | null;
  readAt?: string | null;
  createdAt: string;
};

function rowToNotification(row: NotificationRow): Notification {
  return {
    id: row.id,
    recipientId: row.recipient_id,
    type: row.type,
    title: row.title,
    body: row.body,
    targetHref: row.target_href,
    readAt: row.read_at,
    createdAt: row.created_at,
  };
}

export function createNotification(input: {
  recipientId: string;
  type: string;
  title: string;
  body: string;
  targetHref?: string | null;
}) {
  const count = getDb()
    .prepare("SELECT COUNT(*) as count FROM notifications")
    .get() as { count: number };
  const id = `notification-${String(count.count + 1).padStart(4, "0")}`;

  getDb()
    .prepare(`
      INSERT INTO notifications (
        id, recipient_id, type, title, body, target_href, read_at, created_at
      ) VALUES (
        @id, @recipientId, @type, @title, @body, @targetHref, NULL, @createdAt
      )
    `)
    .run({
      id,
      ...input,
      targetHref: input.targetHref ?? null,
      createdAt: new Date().toISOString(),
    });

  return getNotificationById(id);
}

export function getNotificationById(id: string) {
  const row = getDb()
    .prepare("SELECT * FROM notifications WHERE id = ?")
    .get(id) as NotificationRow | undefined;

  return row ? rowToNotification(row) : undefined;
}

export function listNotificationsForUser(recipientId: string, limit = 8) {
  const rows = getDb()
    .prepare(`
      SELECT * FROM notifications
      WHERE recipient_id = ?
      ORDER BY created_at DESC
      LIMIT ?
    `)
    .all(recipientId, limit) as NotificationRow[];

  return rows.map(rowToNotification);
}

export function notifyMany(
  recipientIds: string[],
  input: Omit<Parameters<typeof createNotification>[0], "recipientId">
) {
  for (const recipientId of recipientIds) {
    createNotification({ recipientId, ...input });
  }
}
