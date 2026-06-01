"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { updateUserRole } from "@/lib/server/users-repository";

const allowedRoles = ["client", "creator"] as const;

export async function chooseRole(formData: FormData) {
  const session = await auth();
  const email = session?.user?.email;
  const role = String(formData.get("role") ?? "");

  if (!email) {
    redirect("/auth/sign-in");
  }

  if (!allowedRoles.includes(role as (typeof allowedRoles)[number])) {
    redirect("/onboarding/role?error=role");
  }

  updateUserRole(email, role as (typeof allowedRoles)[number]);

  revalidatePath("/");
  revalidatePath("/onboarding/role");
  revalidatePath("/dashboard/client");
  revalidatePath("/dashboard/creator");

  if (role === "creator") {
    redirect("/onboarding/creator");
  }

  redirect("/onboarding/client");
}
