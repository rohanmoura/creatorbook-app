import "server-only";

import type { CreatorProfile } from "@/types/marketplace";

import { getDb } from "./db";
import { getCreatorByIdFromDb } from "./marketplace-repository";

type SavedCreatorRow = {
  user_id: string;
  creator_id: string;
  created_at: string;
};

export function listSavedCreatorIds(userId: string) {
  const rows = getDb()
    .prepare("SELECT * FROM saved_creators WHERE user_id = ? ORDER BY created_at DESC")
    .all(userId) as SavedCreatorRow[];

  return rows.map((row) => row.creator_id);
}

export function listSavedCreators(userId: string) {
  return listSavedCreatorIds(userId)
    .map((creatorId) => getCreatorByIdFromDb(creatorId))
    .filter((creator): creator is CreatorProfile => Boolean(creator))
    .filter((creator) => creator.profileStatus === "approved");
}

export function saveCreator(userId: string, creatorId: string) {
  getDb()
    .prepare(`
      INSERT INTO saved_creators (user_id, creator_id, created_at)
      VALUES (?, ?, ?)
      ON CONFLICT(user_id, creator_id) DO NOTHING
    `)
    .run(userId, creatorId, new Date().toISOString());
}

export function unsaveCreator(userId: string, creatorId: string) {
  getDb()
    .prepare("DELETE FROM saved_creators WHERE user_id = ? AND creator_id = ?")
    .run(userId, creatorId);
}
