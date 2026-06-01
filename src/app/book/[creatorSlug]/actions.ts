"use server";

import { redirect } from "next/navigation";

import { requireRole } from "@/lib/server/auth-guards";
import {
  getAvailabilityDurationMinutes,
  getAvailabilitySlotById,
} from "@/lib/server/availability-repository";
import {
  createBooking,
  getNextBookingId,
  hasCreatorSlotConflict,
} from "@/lib/server/bookings-repository";
import {
  getCreatorBySlugFromDb,
  getServicesByCreatorIdFromDb,
} from "@/lib/server/marketplace-repository";
import { createNotification } from "@/lib/server/notifications-repository";

export async function createBookingRequest(formData: FormData) {
  const user = await requireRole("client");
  const creatorSlug = String(formData.get("creator") ?? "");
  const serviceId = String(formData.get("service") ?? "");
  const availabilityId = String(formData.get("availabilityId") ?? "");
  const notes = String(formData.get("notes") ?? "");

  const creator = getCreatorBySlugFromDb(creatorSlug);

  if (!creator || creator.profileStatus !== "approved") {
    redirect("/explore");
  }

  const services = getServicesByCreatorIdFromDb(creator.id);
  const service = services.find((item) => item.id === serviceId) ?? services[0];
  const slot = availabilityId ? getAvailabilitySlotById(availabilityId) : undefined;

  if (
    !service ||
    !slot ||
    slot.creatorId !== creator.id ||
    slot.status !== "open" ||
    getAvailabilityDurationMinutes(slot) < service.duration ||
    !notes.trim()
  ) {
    redirect(`/book/${creator.slug}?booking=invalid`);
  }

  if (
    hasCreatorSlotConflict({
      creatorId: creator.id,
      date: slot.date,
      time: slot.startTime,
      availabilityId: slot.id,
    })
  ) {
    redirect(`/book/${creator.slug}?booking=slot-unavailable`);
  }

  const booking = createBooking({
    id: getNextBookingId(),
    clientId: user.id,
    creatorId: creator.id,
    serviceId: service.id,
    availabilityId: slot.id,
    clientName: user.name,
    creatorName: creator.name,
    serviceName: service.title,
    category: service.category,
    date: slot.date,
    time: slot.startTime,
    duration: service.duration,
    price: service.price,
    status: "Pending",
    notes,
  });

  if (booking && creator.userId) {
    createNotification({
      recipientId: creator.userId,
      type: "booking.requested",
      title: "New booking request",
      body: `${user.name} requested ${service.title} for ${slot.date} at ${slot.startTime}.`,
      targetHref: "/dashboard/creator#requests",
    });

    createNotification({
      recipientId: user.id,
      type: "booking.submitted",
      title: "Booking request submitted",
      body: `${creator.name} can now accept, reject, or suggest a reschedule.`,
      targetHref: "/dashboard/client",
    });
  }

  redirect(`/booking/success?request=${booking?.id}`);
}
