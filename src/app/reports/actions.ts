"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireRole } from "@/lib/server/auth-guards";
import { createReport } from "@/lib/server/marketplace-repository";
import { notifyMany } from "@/lib/server/notifications-repository";
import { listUsers } from "@/lib/server/users-repository";

export async function submitReport(formData: FormData) {
  const user = await requireRole("client");
  const targetType = String(formData.get("targetType") ?? "");
  const targetId = String(formData.get("targetId") ?? "");
  const reason = String(formData.get("reason") ?? "").trim();
  const returnTo = String(formData.get("returnTo") ?? "/dashboard/client");

  if (
    !["profile", "booking", "review"].includes(targetType) ||
    !targetId ||
    reason.length < 10
  ) {
    redirect(returnTo);
  }

  createReport({
    reportedBy: user.id,
    targetType: targetType as "profile" | "booking" | "review",
    targetId,
    reason,
  });

  const adminIds = listUsers()
    .filter((candidate) => candidate.role === "admin")
    .map((candidate) => candidate.id);

  notifyMany(adminIds, {
    type: "report.created",
    title: "New report submitted",
    body: `${user.name} reported a ${targetType}.`,
    targetHref: "/dashboard/admin#reports",
  });

  revalidatePath("/dashboard/admin");
  revalidatePath(returnTo);

  redirect(returnTo);
}
