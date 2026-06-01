import "server-only";

import { categories as seedCategories } from "@/data/mock-categories";
import {
  creators as seedCreators,
  services as seedServices,
} from "@/data/mock-creators";
import { reports as seedReports } from "@/data/mock-reports";
import { reviews as seedReviews } from "@/data/mock-reviews";
import type {
  Category,
  CreatorProfile,
  ProfileStatus,
  Report,
  ReportStatus,
  Review,
  Service,
} from "@/types/marketplace";

import { getDb } from "./db";

type CreatorRow = {
  id: string;
  user_id: string;
  slug: string;
  name: string;
  headline: string;
  bio: string;
  category: string;
  skills: string;
  rating: number;
  review_count: number;
  location: string;
  language: string;
  response_time: string;
  profile_status: ProfileStatus;
  featured: number;
  availability_label: string;
  price_from: number;
  avatar: string;
  cover_tone: string;
  portfolio: string;
  completed_sessions: number;
  repeat_client_rate: number;
  verified: number;
  next_available_slots: string;
  outcomes: string;
};

type ServiceRow = {
  id: string;
  creator_id: string;
  title: string;
  description: string;
  duration: number;
  price: number;
  deliverables: string;
  category: string;
  archived: number;
};

type CategoryRow = {
  id: string;
  name: string;
  description: string;
  creator_count: number;
  archived: number;
};

type ReviewRow = {
  id: string;
  booking_id: string;
  client_id: string;
  creator_id: string;
  rating: number;
  text: string;
  created_at: string;
};

type ReportRow = {
  id: string;
  reported_by: string;
  target_type: "profile" | "booking" | "review";
  target_id: string;
  reason: string;
  status: ReportStatus;
};

type AdminAuditRow = {
  id: string;
  admin_id: string;
  action: string;
  target_type: string;
  target_id: string;
  note: string;
  created_at: string;
};

export type AdminAuditEvent = {
  id: string;
  adminId: string;
  action: string;
  targetType: string;
  targetId: string;
  note: string;
  createdAt: string;
};

function parseStringArray(value: string) {
  return JSON.parse(value) as string[];
}

function creatorToRow(creator: CreatorProfile) {
  return {
    id: creator.id,
    userId: creator.userId,
    slug: creator.slug,
    name: creator.name,
    headline: creator.headline,
    bio: creator.bio,
    category: creator.category,
    skills: JSON.stringify(creator.skills),
    rating: creator.rating,
    reviewCount: creator.reviewCount,
    location: creator.location,
    language: creator.language,
    responseTime: creator.responseTime,
    profileStatus: creator.profileStatus,
    featured: creator.featured ? 1 : 0,
    availabilityLabel: creator.availabilityLabel,
    priceFrom: creator.priceFrom,
    avatar: creator.avatar,
    coverTone: creator.coverTone,
    portfolio: JSON.stringify(creator.portfolio),
    completedSessions: creator.completedSessions,
    repeatClientRate: creator.repeatClientRate,
    verified: creator.verified ? 1 : 0,
    nextAvailableSlots: JSON.stringify(creator.nextAvailableSlots),
    outcomes: JSON.stringify(creator.outcomes),
  };
}

function rowToCreator(row: CreatorRow): CreatorProfile {
  return {
    id: row.id,
    userId: row.user_id,
    slug: row.slug,
    name: row.name,
    headline: row.headline,
    bio: row.bio,
    category: row.category,
    skills: parseStringArray(row.skills),
    rating: row.rating,
    reviewCount: row.review_count,
    location: row.location,
    language: row.language,
    responseTime: row.response_time,
    profileStatus: row.profile_status,
    featured: Boolean(row.featured),
    availabilityLabel: row.availability_label,
    priceFrom: row.price_from,
    avatar: row.avatar,
    coverTone: row.cover_tone,
    portfolio: parseStringArray(row.portfolio),
    completedSessions: row.completed_sessions,
    repeatClientRate: row.repeat_client_rate,
    verified: Boolean(row.verified),
    nextAvailableSlots: parseStringArray(row.next_available_slots),
    outcomes: parseStringArray(row.outcomes),
  };
}

function slugFromName(name: string) {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 48) || "creator"
  );
}

function idPartFromUserId(userId: string) {
  return userId
    .toLowerCase()
    .replace(/^user-/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 36);
}

function rowToService(row: ServiceRow): Service {
  return {
    id: row.id,
    creatorId: row.creator_id,
    title: row.title,
    description: row.description,
    duration: row.duration,
    price: row.price,
    deliverables: parseStringArray(row.deliverables),
    category: row.category,
  };
}

function rowToCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    creatorCount: row.creator_count,
  };
}

function rowToReview(row: ReviewRow): Review {
  return {
    id: row.id,
    bookingId: row.booking_id,
    clientId: row.client_id,
    creatorId: row.creator_id,
    rating: row.rating,
    text: row.text,
    createdAt: row.created_at,
  };
}

function rowToReport(row: ReportRow): Report {
  return {
    id: row.id,
    reportedBy: row.reported_by,
    targetType: row.target_type,
    targetId: row.target_id,
    reason: row.reason,
    status: row.status,
  };
}

function rowToAdminAudit(row: AdminAuditRow): AdminAuditEvent {
  return {
    id: row.id,
    adminId: row.admin_id,
    action: row.action,
    targetType: row.target_type,
    targetId: row.target_id,
    note: row.note,
    createdAt: row.created_at,
  };
}

export function createAdminAuditEvent(input: {
  adminId: string;
  action: string;
  targetType: string;
  targetId: string;
  note: string;
}) {
  const count = getDb()
    .prepare("SELECT COUNT(*) as count FROM admin_audit_events")
    .get() as { count: number };
  const id = `audit-${String(count.count + 1).padStart(4, "0")}`;

  getDb()
    .prepare(`
      INSERT INTO admin_audit_events (
        id, admin_id, action, target_type, target_id, note, created_at
      ) VALUES (
        @id, @adminId, @action, @targetType, @targetId, @note, @createdAt
      )
    `)
    .run({
      id,
      ...input,
      createdAt: new Date().toISOString(),
    });
}

export function seedMarketplaceIfEmpty() {
  const db = getDb();
  const count = db
    .prepare("SELECT COUNT(*) as count FROM creators")
    .get() as { count: number };

  if (count.count > 0) {
    return;
  }

  const insertCreator = db.prepare(`
    INSERT INTO creators (
      id, user_id, slug, name, headline, bio, category, skills, rating,
      review_count, location, language, response_time, profile_status,
      featured, availability_label, price_from, avatar, cover_tone, portfolio,
      completed_sessions, repeat_client_rate, verified, next_available_slots,
      outcomes
    ) VALUES (
      @id, @userId, @slug, @name, @headline, @bio, @category, @skills, @rating,
      @reviewCount, @location, @language, @responseTime, @profileStatus,
      @featured, @availabilityLabel, @priceFrom, @avatar, @coverTone, @portfolio,
      @completedSessions, @repeatClientRate, @verified, @nextAvailableSlots,
      @outcomes
    )
  `);

  const insertService = db.prepare(`
    INSERT INTO services (
      id, creator_id, title, description, duration, price, deliverables, category
    ) VALUES (
      @id, @creatorId, @title, @description, @duration, @price, @deliverables, @category
    )
  `);

  const insertCategory = db.prepare(`
    INSERT INTO categories (id, name, description, creator_count)
    VALUES (@id, @name, @description, @creatorCount)
  `);

  const insertReview = db.prepare(`
    INSERT INTO reviews (id, booking_id, client_id, creator_id, rating, text, created_at)
    VALUES (@id, @bookingId, @clientId, @creatorId, @rating, @text, @createdAt)
  `);

  const insertReport = db.prepare(`
    INSERT INTO reports (id, reported_by, target_type, target_id, reason, status)
    VALUES (@id, @reportedBy, @targetType, @targetId, @reason, @status)
  `);

  const transaction = db.transaction(() => {
    for (const creator of seedCreators) {
      insertCreator.run(creatorToRow(creator));
    }

    for (const service of seedServices) {
      insertService.run({
        ...service,
        deliverables: JSON.stringify(service.deliverables),
      });
    }

    for (const category of seedCategories) {
      insertCategory.run(category);
    }

    for (const review of seedReviews) {
      insertReview.run(review);
    }

    for (const report of seedReports) {
      insertReport.run(report);
    }
  });

  transaction();
}

export function listCreators() {
  seedMarketplaceIfEmpty();

  const rows = getDb()
    .prepare("SELECT * FROM creators ORDER BY featured DESC, rating DESC, name ASC")
    .all() as CreatorRow[];

  return rows.map(rowToCreator);
}

export function listPublicCreators() {
  return listCreators().filter((creator) => creator.profileStatus === "approved");
}

export function getCreatorBySlugFromDb(slug: string) {
  seedMarketplaceIfEmpty();

  const row = getDb()
    .prepare("SELECT * FROM creators WHERE slug = ?")
    .get(slug) as CreatorRow | undefined;

  return row ? rowToCreator(row) : undefined;
}

export function getCreatorByIdFromDb(id: string) {
  seedMarketplaceIfEmpty();

  const row = getDb()
    .prepare("SELECT * FROM creators WHERE id = ?")
    .get(id) as CreatorRow | undefined;

  return row ? rowToCreator(row) : undefined;
}

export function getCreatorByUserId(userId: string) {
  seedMarketplaceIfEmpty();

  const row = getDb()
    .prepare("SELECT * FROM creators WHERE user_id = ?")
    .get(userId) as CreatorRow | undefined;

  return row ? rowToCreator(row) : undefined;
}

export function createOrUpdateCreatorApplication(input: {
  userId: string;
  name: string;
  headline: string;
  bio: string;
  category: string;
  skills: string[];
  location: string;
  language: string;
  availabilitySlots: string[];
  firstService: {
    title: string;
    description: string;
    duration: number;
    price: number;
    deliverables: string[];
  };
}) {
  seedMarketplaceIfEmpty();

  const existing = getCreatorByUserId(input.userId);
  const safeName = input.name.trim() || "CreatorBook Creator";
  const creatorId = existing?.id ?? `creator-${idPartFromUserId(input.userId)}`;
  const slug = existing?.slug ?? `${slugFromName(safeName)}-${idPartFromUserId(input.userId)}`;
  const slots = input.availabilitySlots.length
    ? input.availabilitySlots
    : ["Next 3 days"];
  const priceFrom = input.firstService.price;

  const creatorPayload = {
    id: creatorId,
    userId: input.userId,
    slug,
    name: safeName,
    headline: input.headline,
    bio: input.bio,
    category: input.category,
    skills: JSON.stringify(input.skills),
    rating: existing?.rating ?? 0,
    reviewCount: existing?.reviewCount ?? 0,
    location: input.location,
    language: input.language,
    responseTime: existing?.responseTime ?? "Within 24 hours",
    profileStatus: "pending",
    featured: 0,
    availabilityLabel: slots.length > 0 ? "This week" : "Unavailable",
    priceFrom,
    avatar: safeName
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase(),
    coverTone: existing?.coverTone ?? "from-sky-100 via-white to-emerald-100",
    portfolio: JSON.stringify(existing?.portfolio ?? []),
    completedSessions: existing?.completedSessions ?? 0,
    repeatClientRate: existing?.repeatClientRate ?? 0,
    verified: 0,
    nextAvailableSlots: JSON.stringify(slots),
    outcomes: JSON.stringify([
      "Clarify the problem",
      "Prioritize next actions",
      "Leave with a practical plan",
    ]),
  };

  getDb()
    .prepare(`
      INSERT INTO creators (
        id, user_id, slug, name, headline, bio, category, skills, rating,
        review_count, location, language, response_time, profile_status,
        featured, availability_label, price_from, avatar, cover_tone, portfolio,
        completed_sessions, repeat_client_rate, verified, next_available_slots,
        outcomes
      ) VALUES (
        @id, @userId, @slug, @name, @headline, @bio, @category, @skills, @rating,
        @reviewCount, @location, @language, @responseTime, @profileStatus,
        @featured, @availabilityLabel, @priceFrom, @avatar, @coverTone, @portfolio,
        @completedSessions, @repeatClientRate, @verified, @nextAvailableSlots,
        @outcomes
      )
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        headline = excluded.headline,
        bio = excluded.bio,
        category = excluded.category,
        skills = excluded.skills,
        location = excluded.location,
        language = excluded.language,
        profile_status = 'pending',
        verified = 0,
        availability_label = excluded.availability_label,
        price_from = excluded.price_from,
        avatar = excluded.avatar,
        next_available_slots = excluded.next_available_slots,
        outcomes = excluded.outcomes
    `)
    .run(creatorPayload);

  const existingFirstService = getServicesByCreatorIdFromDb(creatorId)[0];

  if (!existingFirstService) {
    createService({
      creatorId,
      title: input.firstService.title,
      description: input.firstService.description,
      duration: input.firstService.duration,
      price: input.firstService.price,
      deliverables: input.firstService.deliverables,
      category: input.category,
    });
  }

  return getCreatorByUserId(input.userId);
}

export function updateCreatorProfileStatus(id: string, status: ProfileStatus) {
  seedMarketplaceIfEmpty();

  getDb()
    .prepare("UPDATE creators SET profile_status = ?, verified = ? WHERE id = ?")
    .run(status, status === "approved" ? 1 : 0, id);

  return getCreatorByIdFromDb(id);
}

export function updateCreatorAvailability(id: string, slots: string[]) {
  seedMarketplaceIfEmpty();

  getDb()
    .prepare(
      "UPDATE creators SET next_available_slots = ?, availability_label = ?, profile_status = 'pending', verified = 0 WHERE id = ?"
    )
    .run(
      JSON.stringify(slots),
      slots.length > 0 ? "This week" : "Unavailable",
      id
    );

  return getCreatorByIdFromDb(id);
}

export function updateCreatorProfile(input: {
  id: string;
  name: string;
  headline: string;
  bio: string;
  category: string;
  skills: string[];
  location: string;
  language: string;
  portfolio: string[];
  outcomes: string[];
}) {
  seedMarketplaceIfEmpty();

  const avatar = input.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  getDb()
    .prepare(`
      UPDATE creators SET
        name = @name,
        headline = @headline,
        bio = @bio,
        category = @category,
        skills = @skills,
        location = @location,
        language = @language,
        portfolio = @portfolio,
        outcomes = @outcomes,
        avatar = @avatar,
        profile_status = 'pending',
        verified = 0
      WHERE id = @id
    `)
    .run({
      id: input.id,
      name: input.name,
      headline: input.headline,
      bio: input.bio,
      category: input.category,
      skills: JSON.stringify(input.skills),
      location: input.location,
      language: input.language,
      portfolio: JSON.stringify(input.portfolio),
      outcomes: JSON.stringify(input.outcomes),
      avatar,
    });

  return getCreatorByIdFromDb(input.id);
}

export function listServices() {
  seedMarketplaceIfEmpty();

  const rows = getDb()
    .prepare("SELECT * FROM services WHERE archived = 0 ORDER BY price ASC")
    .all() as ServiceRow[];

  return rows.map(rowToService);
}

export function createService(input: Omit<Service, "id">) {
  seedMarketplaceIfEmpty();

  const baseId = input.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48);
  const existingCount = getServicesByCreatorIdFromDb(input.creatorId).length;
  const id = `service-${input.creatorId.replace("creator-", "")}-${baseId || "package"}-${existingCount + 1}`;

  getDb()
    .prepare(`
      INSERT INTO services (
        id, creator_id, title, description, duration, price, deliverables, category, archived
      ) VALUES (
        @id, @creatorId, @title, @description, @duration, @price, @deliverables, @category, 0
      )
    `)
    .run({
      ...input,
      id,
      deliverables: JSON.stringify(input.deliverables),
    });

  getDb()
    .prepare("UPDATE creators SET profile_status = 'pending', verified = 0 WHERE id = ?")
    .run(input.creatorId);

  return getServicesByCreatorIdFromDb(input.creatorId).find(
    (service) => service.id === id
  );
}

export function getServiceByIdFromDb(id: string) {
  seedMarketplaceIfEmpty();

  const row = getDb()
    .prepare("SELECT * FROM services WHERE id = ?")
    .get(id) as ServiceRow | undefined;

  return row && !row.archived ? rowToService(row) : undefined;
}

export function updateService(input: {
  id: string;
  creatorId: string;
  title: string;
  description: string;
  duration: number;
  price: number;
  deliverables: string[];
  category: string;
}) {
  seedMarketplaceIfEmpty();

  getDb()
    .prepare(`
      UPDATE services SET
        title = @title,
        description = @description,
        duration = @duration,
        price = @price,
        deliverables = @deliverables,
        category = @category
      WHERE id = @id AND creator_id = @creatorId AND archived = 0
    `)
    .run({
      ...input,
      deliverables: JSON.stringify(input.deliverables),
    });

  getDb()
    .prepare("UPDATE creators SET profile_status = 'pending', verified = 0, price_from = ? WHERE id = ?")
    .run(input.price, input.creatorId);

  return getServiceByIdFromDb(input.id);
}

export function archiveService(id: string, creatorId: string) {
  seedMarketplaceIfEmpty();

  getDb()
    .prepare("UPDATE services SET archived = 1 WHERE id = ? AND creator_id = ?")
    .run(id, creatorId);

  getDb()
    .prepare("UPDATE creators SET profile_status = 'pending', verified = 0 WHERE id = ?")
    .run(creatorId);

  return getCreatorByIdFromDb(creatorId);
}

export function getServicesByCreatorIdFromDb(creatorId: string) {
  seedMarketplaceIfEmpty();

  const rows = getDb()
    .prepare("SELECT * FROM services WHERE creator_id = ? AND archived = 0 ORDER BY price ASC")
    .all(creatorId) as ServiceRow[];

  return rows.map(rowToService);
}

export function listCategories() {
  seedMarketplaceIfEmpty();

  const rows = getDb()
    .prepare("SELECT * FROM categories WHERE archived = 0 ORDER BY creator_count DESC, name ASC")
    .all() as CategoryRow[];

  return rows.map(rowToCategory);
}

export function createCategory(input: { name: string; description: string }) {
  seedMarketplaceIfEmpty();

  const id = `category-${input.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48)}`;

  getDb()
    .prepare(`
      INSERT INTO categories (id, name, description, creator_count, archived)
      VALUES (?, ?, ?, 0, 0)
      ON CONFLICT(name) DO UPDATE SET
        description = excluded.description,
        archived = 0
    `)
    .run(id, input.name, input.description);

  return listCategories().find((category) => category.name === input.name);
}

export function updateCategory(input: {
  id: string;
  name: string;
  description: string;
}) {
  seedMarketplaceIfEmpty();

  getDb()
    .prepare("UPDATE categories SET name = ?, description = ? WHERE id = ? AND archived = 0")
    .run(input.name, input.description, input.id);

  return listCategories().find((category) => category.id === input.id);
}

export function archiveCategory(id: string) {
  seedMarketplaceIfEmpty();

  getDb()
    .prepare("UPDATE categories SET archived = 1 WHERE id = ?")
    .run(id);
}

export function listReviews() {
  seedMarketplaceIfEmpty();

  const rows = getDb()
    .prepare("SELECT * FROM reviews ORDER BY created_at DESC")
    .all() as ReviewRow[];

  return rows.map(rowToReview);
}

export function createReview(input: {
  bookingId: string;
  clientId: string;
  creatorId: string;
  rating: number;
  text: string;
}) {
  seedMarketplaceIfEmpty();

  const existingCount = getDb()
    .prepare("SELECT COUNT(*) as count FROM reviews")
    .get() as { count: number };
  const id = `review-${String(existingCount.count + 1).padStart(3, "0")}`;
  const createdAt = new Date().toISOString();

  getDb()
    .prepare(`
      INSERT INTO reviews (id, booking_id, client_id, creator_id, rating, text, created_at)
      VALUES (@id, @bookingId, @clientId, @creatorId, @rating, @text, @createdAt)
    `)
    .run({
      id,
      ...input,
      createdAt,
    });

  return listReviews().find((review) => review.id === id);
}

export function listReports() {
  seedMarketplaceIfEmpty();

  const rows = getDb()
    .prepare("SELECT * FROM reports ORDER BY id ASC")
    .all() as ReportRow[];

  return rows.map(rowToReport);
}

export function createReport(input: {
  reportedBy: string;
  targetType: "profile" | "booking" | "review";
  targetId: string;
  reason: string;
}) {
  seedMarketplaceIfEmpty();

  const existingCount = getDb()
    .prepare("SELECT COUNT(*) as count FROM reports")
    .get() as { count: number };
  const id = `report-${String(existingCount.count + 1).padStart(3, "0")}`;

  getDb()
    .prepare(`
      INSERT INTO reports (id, reported_by, target_type, target_id, reason, status)
      VALUES (@id, @reportedBy, @targetType, @targetId, @reason, 'open')
    `)
    .run({ id, ...input });

  return listReports().find((report) => report.id === id);
}

export function updateReportStatus(id: string, status: ReportStatus) {
  seedMarketplaceIfEmpty();

  getDb()
    .prepare("UPDATE reports SET status = ? WHERE id = ?")
    .run(status, id);

  const row = getDb()
    .prepare("SELECT * FROM reports WHERE id = ?")
    .get(id) as ReportRow | undefined;

  return row ? rowToReport(row) : undefined;
}

export function listAdminAuditEvents() {
  const rows = getDb()
    .prepare("SELECT * FROM admin_audit_events ORDER BY created_at DESC LIMIT 12")
    .all() as AdminAuditRow[];

  return rows.map(rowToAdminAudit);
}
