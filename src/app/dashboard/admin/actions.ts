"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireRole } from "@/lib/server/auth-guards";
import {
  archiveCategory,
  createAdminAuditEvent,
  createCategory,
  getCreatorByIdFromDb,
  updateCategory,
  updateCreatorProfileStatus,
  updateReportStatus,
} from "@/lib/server/marketplace-repository";
import { createNotification } from "@/lib/server/notifications-repository";
import { updateUserSuspension } from "@/lib/server/users-repository";
import type { ProfileStatus, ReportStatus } from "@/types/marketplace";

function revalidateMarketplaceViews(slug?: string) {
  revalidatePath("/");
  revalidatePath("/explore");
  revalidatePath("/dashboard/admin");
  revalidatePath("/case-study");

  if (slug) {
    revalidatePath(`/creators/${slug}`);
  }
}

export async function updateCreatorStatus(formData: FormData) {
  const admin = await requireRole("admin");
  const creatorId = String(formData.get("creatorId") ?? "");
  const creatorSlug = String(formData.get("creatorSlug") ?? "");
  const status = String(formData.get("status") ?? "") as ProfileStatus;

  if (!creatorId || !["approved", "pending", "rejected"].includes(status)) {
    redirect("/dashboard/admin?creator=invalid#moderation");
  }

  updateCreatorProfileStatus(creatorId, status);
  const creator = getCreatorByIdFromDb(creatorId);

  if (creator?.userId) {
    createNotification({
      recipientId: creator.userId,
      type: `creator.${status}`,
      title:
        status === "approved"
          ? "Profile approved"
          : status === "rejected"
            ? "Profile needs attention"
            : "Profile moved to review",
      body:
        status === "approved"
          ? "Your creator profile is now visible in the marketplace."
          : status === "rejected"
            ? "Admin reviewed your creator profile. Update the requested areas and resubmit."
            : "Your creator profile is back under admin review.",
      targetHref: "/dashboard/creator#profile",
    });
  }

  createAdminAuditEvent({
    adminId: admin.id,
    action: `creator.${status}`,
    targetType: "creator",
    targetId: creatorId,
    note: `Creator profile moved to ${status}.`,
  });
  revalidateMarketplaceViews(creatorSlug);

  redirect(`/dashboard/admin?creator=${status}#moderation`);
}

export async function updateReportModerationStatus(formData: FormData) {
  const admin = await requireRole("admin");
  const reportId = String(formData.get("reportId") ?? "");
  const status = String(formData.get("status") ?? "") as ReportStatus;

  if (!reportId || !["open", "reviewing", "resolved"].includes(status)) {
    redirect("/dashboard/admin?report=invalid#reports");
  }

  updateReportStatus(reportId, status);
  createAdminAuditEvent({
    adminId: admin.id,
    action: `report.${status}`,
    targetType: "report",
    targetId: reportId,
    note: `Report moved to ${status}.`,
  });
  revalidatePath("/dashboard/admin");
  revalidatePath("/case-study");

  redirect(`/dashboard/admin?report=${status}#reports`);
}

export async function createAdminCategory(formData: FormData) {
  const admin = await requireRole("admin");
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!name || description.length < 12) {
    redirect("/dashboard/admin?category=invalid#categories");
  }

  const category = createCategory({ name, description });

  createAdminAuditEvent({
    adminId: admin.id,
    action: "category.create",
    targetType: "category",
    targetId: category?.id ?? name,
    note: `${name} category created or restored.`,
  });

  revalidatePath("/");
  revalidatePath("/explore");
  revalidatePath("/dashboard/admin");

  redirect("/dashboard/admin?category=created#categories");
}

export async function updateAdminCategory(formData: FormData) {
  const admin = await requireRole("admin");
  const id = String(formData.get("categoryId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!id || !name || description.length < 12) {
    redirect("/dashboard/admin?category=invalid#categories");
  }

  updateCategory({ id, name, description });

  createAdminAuditEvent({
    adminId: admin.id,
    action: "category.update",
    targetType: "category",
    targetId: id,
    note: `${name} category updated.`,
  });

  revalidatePath("/");
  revalidatePath("/explore");
  revalidatePath("/dashboard/admin");

  redirect("/dashboard/admin?category=updated#categories");
}

export async function archiveAdminCategory(formData: FormData) {
  const admin = await requireRole("admin");
  const id = String(formData.get("categoryId") ?? "");
  const name = String(formData.get("name") ?? "");

  if (!id) {
    redirect("/dashboard/admin?category=invalid#categories");
  }

  archiveCategory(id);

  createAdminAuditEvent({
    adminId: admin.id,
    action: "category.archive",
    targetType: "category",
    targetId: id,
    note: `${name || id} category archived.`,
  });

  revalidatePath("/");
  revalidatePath("/explore");
  revalidatePath("/dashboard/admin");

  redirect("/dashboard/admin?category=archived#categories");
}

export async function updateUserModerationStatus(formData: FormData) {
  const admin = await requireRole("admin");
  const userId = String(formData.get("userId") ?? "");
  const status = String(formData.get("status") ?? "");

  if (!userId || !["active", "suspended"].includes(status) || userId === admin.id) {
    redirect("/dashboard/admin?user=invalid#users");
  }

  updateUserSuspension(userId, status === "suspended");

  createAdminAuditEvent({
    adminId: admin.id,
    action: `user.${status}`,
    targetType: "user",
    targetId: userId,
    note: `User account marked ${status}.`,
  });

  revalidatePath("/dashboard/admin");

  redirect(`/dashboard/admin?user=${status}#users`);
}
