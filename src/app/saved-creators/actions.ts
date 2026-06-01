"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireRole } from "@/lib/server/auth-guards";
import { getCreatorByIdFromDb } from "@/lib/server/marketplace-repository";
import {
  saveCreator,
  unsaveCreator,
} from "@/lib/server/saved-creators-repository";

export async function toggleSavedCreator(formData: FormData) {
  const user = await requireRole("client");
  const creatorId = String(formData.get("creatorId") ?? "");
  const intent = String(formData.get("intent") ?? "");
  const returnTo = String(formData.get("returnTo") ?? "/explore");
  const creator = getCreatorByIdFromDb(creatorId);

  if (!creator || creator.profileStatus !== "approved") {
    redirect(returnTo);
  }

  if (intent === "save") {
    saveCreator(user.id, creatorId);
  } else if (intent === "unsave") {
    unsaveCreator(user.id, creatorId);
  } else {
    redirect(returnTo);
  }

  revalidatePath("/dashboard/client");
  revalidatePath("/explore");
  revalidatePath(`/creators/${creator.slug}`);

  redirect(returnTo);
}
