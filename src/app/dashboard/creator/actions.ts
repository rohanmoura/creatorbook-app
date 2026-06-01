"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireRole } from "@/lib/server/auth-guards";
import {
  formatAvailabilityLabel,
  replaceCreatorAvailability,
} from "@/lib/server/availability-repository";
import { getBookingById, updateBookingStatus } from "@/lib/server/bookings-repository";
import {
  archiveService,
  createService,
  getCreatorByIdFromDb,
  getServiceByIdFromDb,
  updateCreatorProfile,
  updateService,
  updateCreatorAvailability,
} from "@/lib/server/marketplace-repository";
import { createNotification } from "@/lib/server/notifications-repository";
import type { BookingStatus } from "@/types/marketplace";

export async function createServicePackage(formData: FormData) {
  const user = await requireRole("creator");
  const creatorId = String(formData.get("creatorId") ?? "");
  const creatorSlug = String(formData.get("creatorSlug") ?? "");
  const category = String(formData.get("category") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const duration = Number(formData.get("duration") ?? 0);
  const price = Number(formData.get("price") ?? 0);
  const deliverables = String(formData.get("deliverables") ?? "")
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);

  if (
    !creatorId ||
    !creatorSlug ||
    !category ||
    !title ||
    !description ||
    !Number.isFinite(duration) ||
    duration <= 0 ||
    !Number.isFinite(price) ||
    price <= 0 ||
    deliverables.length === 0
  ) {
    redirect("/dashboard/creator?package=invalid");
  }

  const creator = getCreatorByIdFromDb(creatorId);

  if (!creator || creator.userId !== user.id) {
    redirect("/dashboard/creator?package=unauthorized");
  }

  createService({
    creatorId,
    title,
    description,
    duration,
    price,
    deliverables,
    category,
  });

  revalidatePath("/dashboard/creator");
  revalidatePath(`/creators/${creatorSlug}`);
  revalidatePath(`/book/${creatorSlug}`);

  redirect("/dashboard/creator?package=created#services");
}

export async function updateCreatorProfileDetails(formData: FormData) {
  const user = await requireRole("creator");
  const creatorId = String(formData.get("creatorId") ?? "");
  const creatorSlug = String(formData.get("creatorSlug") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const headline = String(formData.get("headline") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const language = String(formData.get("language") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();
  const skills = String(formData.get("skills") ?? "")
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
  const portfolio = String(formData.get("portfolio") ?? "")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
  const outcomes = String(formData.get("outcomes") ?? "")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);

  const creator = getCreatorByIdFromDb(creatorId);

  if (!creator || creator.userId !== user.id || !creatorSlug) {
    redirect("/dashboard/creator?profile=unauthorized#profile");
  }

  if (
    !name ||
    !headline ||
    !category ||
    !location ||
    !language ||
    bio.length < 40 ||
    skills.length === 0 ||
    outcomes.length === 0
  ) {
    redirect("/dashboard/creator?profile=invalid#profile");
  }

  updateCreatorProfile({
    id: creatorId,
    name,
    headline,
    bio,
    category,
    skills,
    location,
    language,
    portfolio,
    outcomes,
  });

  revalidatePath("/dashboard/creator");
  revalidatePath("/dashboard/admin");
  revalidatePath("/explore");
  revalidatePath("/");
  revalidatePath(`/creators/${creatorSlug}`);
  revalidatePath(`/book/${creatorSlug}`);

  redirect("/dashboard/creator?profile=submitted#profile");
}

export async function updateServicePackage(formData: FormData) {
  const user = await requireRole("creator");
  const serviceId = String(formData.get("serviceId") ?? "");
  const creatorId = String(formData.get("creatorId") ?? "");
  const creatorSlug = String(formData.get("creatorSlug") ?? "");
  const category = String(formData.get("category") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const duration = Number(formData.get("duration") ?? 0);
  const price = Number(formData.get("price") ?? 0);
  const deliverables = String(formData.get("deliverables") ?? "")
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);

  const creator = getCreatorByIdFromDb(creatorId);
  const service = getServiceByIdFromDb(serviceId);

  if (
    !creator ||
    creator.userId !== user.id ||
    !service ||
    service.creatorId !== creatorId ||
    !creatorSlug
  ) {
    redirect("/dashboard/creator?package=unauthorized#services");
  }

  if (
    !title ||
    !description ||
    !category ||
    !Number.isFinite(duration) ||
    duration <= 0 ||
    !Number.isFinite(price) ||
    price <= 0 ||
    deliverables.length === 0
  ) {
    redirect("/dashboard/creator?package=invalid#services");
  }

  updateService({
    id: serviceId,
    creatorId,
    title,
    description,
    duration,
    price,
    deliverables,
    category,
  });

  revalidatePath("/dashboard/creator");
  revalidatePath("/dashboard/admin");
  revalidatePath("/");
  revalidatePath("/explore");
  revalidatePath(`/creators/${creatorSlug}`);
  revalidatePath(`/book/${creatorSlug}`);

  redirect("/dashboard/creator?package=updated#services");
}

export async function archiveServicePackage(formData: FormData) {
  const user = await requireRole("creator");
  const serviceId = String(formData.get("serviceId") ?? "");
  const creatorId = String(formData.get("creatorId") ?? "");
  const creatorSlug = String(formData.get("creatorSlug") ?? "");
  const creator = getCreatorByIdFromDb(creatorId);
  const service = getServiceByIdFromDb(serviceId);

  if (
    !creator ||
    creator.userId !== user.id ||
    !service ||
    service.creatorId !== creatorId ||
    !creatorSlug
  ) {
    redirect("/dashboard/creator?package=unauthorized#services");
  }

  archiveService(serviceId, creatorId);

  revalidatePath("/dashboard/creator");
  revalidatePath("/dashboard/admin");
  revalidatePath("/");
  revalidatePath("/explore");
  revalidatePath(`/creators/${creatorSlug}`);
  revalidatePath(`/book/${creatorSlug}`);

  redirect("/dashboard/creator?package=archived#services");
}

export async function updateAvailability(formData: FormData) {
  const user = await requireRole("creator");
  const creatorId = String(formData.get("creatorId") ?? "");
  const creatorSlug = String(formData.get("creatorSlug") ?? "");
  const timezone = String(formData.get("timezone") ?? "Asia/Kolkata").trim();
  const slots = String(formData.get("slots") ?? "")
    .split(/\r?\n/)
    .map((slot) => slot.split(",").map((part) => part.trim()))
    .filter((parts) => parts.length >= 3)
    .map(([date, startTime, endTime, rowTimezone]) => ({
      date,
      startTime,
      endTime,
      timezone: rowTimezone || timezone,
      status: "open" as const,
    }))
    .filter((slot) => slot.date && slot.startTime && slot.endTime);

  if (!creatorId || !creatorSlug || slots.length === 0) {
    redirect("/dashboard/creator?availability=invalid#availability");
  }

  const creator = getCreatorByIdFromDb(creatorId);

  if (!creator || creator.userId !== user.id) {
    redirect("/dashboard/creator?availability=unauthorized#availability");
  }

  const updatedSlots = replaceCreatorAvailability(creatorId, slots);
  updateCreatorAvailability(
    creatorId,
    updatedSlots
      .filter((slot) => slot.status === "open")
      .map(formatAvailabilityLabel)
  );

  revalidatePath("/dashboard/creator");
  revalidatePath(`/creators/${creatorSlug}`);
  revalidatePath(`/book/${creatorSlug}`);

  redirect("/dashboard/creator?availability=updated#availability");
}

export async function updateCreatorBookingStatus(formData: FormData) {
  const user = await requireRole("creator");
  const bookingId = String(formData.get("bookingId") ?? "");
  const status = String(formData.get("status") ?? "") as BookingStatus;

  if (
    !bookingId ||
    !["Confirmed", "Rescheduled", "Rejected"].includes(status)
  ) {
    redirect("/dashboard/creator?booking=invalid#requests");
  }

  const booking = getBookingById(bookingId);
  const creator = booking ? getCreatorByIdFromDb(booking.creatorId) : undefined;

  if (!booking || !creator || creator.userId !== user.id) {
    redirect("/dashboard/creator?booking=unauthorized#requests");
  }

  const updated = updateBookingStatus(bookingId, status, {
    actorId: user.id,
    actorRole: "creator",
    note:
      status === "Confirmed"
        ? "Creator accepted the booking."
        : status === "Rejected"
          ? "Creator rejected the booking."
          : "Creator suggested a reschedule.",
  });

  if (!updated) {
    redirect("/dashboard/creator?booking=invalid-transition#requests");
  }

  const statusCopies: Record<
    "Confirmed" | "Rejected" | "Rescheduled",
    { type: string; title: string; body: string }
  > = {
    Confirmed: {
      type: "booking.confirmed",
      title: "Booking confirmed",
      body: `${creator.name} accepted your ${booking.serviceName} request.`,
    },
    Rejected: {
      type: "booking.rejected",
      title: "Booking rejected",
      body: `${creator.name} rejected your ${booking.serviceName} request.`,
    },
    Rescheduled: {
      type: "booking.rescheduled",
      title: "Reschedule suggested",
      body: `${creator.name} suggested a new time for ${booking.serviceName}.`,
    },
  };
  const statusCopy = statusCopies[
    status as "Confirmed" | "Rejected" | "Rescheduled"
  ];

  createNotification({
    recipientId: booking.clientId,
    ...statusCopy,
    targetHref: "/dashboard/client",
  });

  revalidatePath("/dashboard/creator");
  revalidatePath("/dashboard/client");
  revalidatePath("/dashboard/admin");
  revalidatePath("/case-study");

  redirect(`/dashboard/creator?booking=${status.toLowerCase()}#requests`);
}
