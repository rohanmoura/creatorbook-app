"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireRole } from "@/lib/server/auth-guards";
import { upsertClientPreferences } from "@/lib/server/client-preferences-repository";

export async function saveClientPreferences(formData: FormData) {
  const user = await requireRole("client");
  const categories = formData
    .getAll("categories")
    .map((category) => String(category))
    .filter(Boolean);
  const budgetRange = String(formData.get("budgetRange") ?? "").trim();
  const bookingIntent = String(formData.get("bookingIntent") ?? "").trim();
  const timezone = String(formData.get("timezone") ?? "").trim();

  if (!categories.length || !budgetRange || !bookingIntent || !timezone) {
    redirect("/onboarding/client?setup=invalid");
  }

  upsertClientPreferences({
    userId: user.id,
    categories,
    budgetRange,
    bookingIntent,
    timezone,
  });

  revalidatePath("/dashboard/client");
  revalidatePath("/explore");

  redirect(`/explore?category=${encodeURIComponent(categories[0])}`);
}
