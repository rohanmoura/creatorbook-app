"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireRole } from "@/lib/server/auth-guards";
import { getBookingById, updateBookingStatus } from "@/lib/server/bookings-repository";
import {
  createReview,
  getCreatorByIdFromDb,
  listReviews,
} from "@/lib/server/marketplace-repository";
import { createNotification } from "@/lib/server/notifications-repository";
import type { BookingStatus } from "@/types/marketplace";

export async function updateClientBookingStatus(formData: FormData) {
  const user = await requireRole("client");
  const bookingId = String(formData.get("bookingId") ?? "");
  const status = String(formData.get("status") ?? "") as BookingStatus;

  if (!bookingId || !["Cancelled", "Rescheduled"].includes(status)) {
    redirect("/dashboard/client?booking=invalid");
  }

  const booking = getBookingById(bookingId);

  if (!booking || booking.clientId !== user.id) {
    redirect("/dashboard/client?booking=unauthorized");
  }

  const updated = updateBookingStatus(bookingId, status, {
    actorId: user.id,
    actorRole: "client",
    note:
      status === "Cancelled"
        ? "Client cancelled the booking."
        : "Client requested a reschedule.",
  });

  if (!updated) {
    redirect("/dashboard/client?booking=invalid-transition");
  }

  const creator = getCreatorByIdFromDb(booking.creatorId);

  if (creator?.userId) {
    createNotification({
      recipientId: creator.userId,
      type: status === "Cancelled" ? "booking.cancelled" : "booking.rescheduled",
      title: status === "Cancelled" ? "Booking cancelled" : "Reschedule requested",
      body:
        status === "Cancelled"
          ? `${user.name} cancelled ${booking.serviceName}.`
          : `${user.name} requested a reschedule for ${booking.serviceName}.`,
      targetHref: "/dashboard/creator#requests",
    });
  }

  revalidatePath("/dashboard/client");
  revalidatePath("/dashboard/creator");
  revalidatePath("/dashboard/admin");
  revalidatePath("/case-study");

  redirect(`/dashboard/client?booking=${status.toLowerCase()}`);
}

export async function submitBookingReview(formData: FormData) {
  const user = await requireRole("client");
  const bookingId = String(formData.get("bookingId") ?? "");
  const creatorId = String(formData.get("creatorId") ?? "");
  const clientId = String(formData.get("clientId") ?? "");
  const rating = Number(formData.get("rating") ?? 0);
  const text = String(formData.get("text") ?? "").trim();
  const creatorSlug = String(formData.get("creatorSlug") ?? "");

  if (
    !bookingId ||
    !creatorId ||
    !clientId ||
    !Number.isFinite(rating) ||
    rating < 1 ||
    rating > 5 ||
    text.length < 10
  ) {
    redirect("/dashboard/client?review=invalid#reviews");
  }

  const booking = getBookingById(bookingId);

  if (
    !booking ||
    booking.clientId !== user.id ||
    booking.creatorId !== creatorId ||
    booking.clientId !== clientId ||
    booking.status !== "Completed"
  ) {
    redirect("/dashboard/client?review=unauthorized#reviews");
  }

  const existingReview = listReviews().find(
    (review) => review.bookingId === bookingId && review.clientId === user.id
  );

  if (existingReview) {
    redirect("/dashboard/client?review=already-submitted#reviews");
  }

  createReview({
    bookingId,
    creatorId,
    clientId,
    rating,
    text,
  });

  const creator = getCreatorByIdFromDb(creatorId);

  if (creator?.userId) {
    createNotification({
      recipientId: creator.userId,
      type: "review.submitted",
      title: "New review submitted",
      body: `${user.name} reviewed ${booking.serviceName}.`,
      targetHref: `/creators/${creator.slug}#reviews`,
    });
  }

  revalidatePath("/dashboard/client");
  revalidatePath("/case-study");

  if (creatorSlug) {
    revalidatePath(`/creators/${creatorSlug}`);
  }

  redirect("/dashboard/client?review=submitted#reviews");
}
