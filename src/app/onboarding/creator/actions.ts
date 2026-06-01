"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireRole } from "@/lib/server/auth-guards";
import { createOrUpdateCreatorApplication } from "@/lib/server/marketplace-repository";

export async function submitCreatorApplication(formData: FormData) {
  const user = await requireRole("creator");
  const headline = String(formData.get("headline") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();
  const skills = String(formData.get("skills") ?? "")
    .split(/\r?\n|,/)
    .map((skill) => skill.trim())
    .filter(Boolean);
  const location = String(formData.get("location") ?? "").trim();
  const language = String(formData.get("language") ?? "").trim();
  const availabilitySlots = String(formData.get("availabilitySlots") ?? "")
    .split(/\r?\n/)
    .map((slot) => slot.trim())
    .filter(Boolean);
  const serviceTitle = String(formData.get("serviceTitle") ?? "").trim();
  const serviceDescription = String(formData.get("serviceDescription") ?? "").trim();
  const serviceDuration = Number(formData.get("serviceDuration") ?? 0);
  const servicePrice = Number(formData.get("servicePrice") ?? 0);
  const deliverables = String(formData.get("deliverables") ?? "")
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);

  if (
    !headline ||
    !category ||
    bio.length < 40 ||
    skills.length === 0 ||
    !location ||
    !language ||
    availabilitySlots.length === 0 ||
    !serviceTitle ||
    !serviceDescription ||
    !Number.isFinite(serviceDuration) ||
    serviceDuration <= 0 ||
    !Number.isFinite(servicePrice) ||
    servicePrice <= 0 ||
    deliverables.length === 0
  ) {
    redirect("/onboarding/creator?setup=invalid");
  }

  createOrUpdateCreatorApplication({
    userId: user.id,
    name: user.name,
    headline,
    bio,
    category,
    skills,
    location,
    language,
    availabilitySlots,
    firstService: {
      title: serviceTitle,
      description: serviceDescription,
      duration: serviceDuration,
      price: servicePrice,
      deliverables,
    },
  });

  revalidatePath("/");
  revalidatePath("/explore");
  revalidatePath("/dashboard/creator");
  revalidatePath("/dashboard/admin");
  revalidatePath("/case-study");

  redirect("/dashboard/creator?profile=submitted");
}
