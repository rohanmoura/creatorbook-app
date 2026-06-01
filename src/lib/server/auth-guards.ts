import "server-only";

import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getUserByEmail, type AuthUserRole } from "@/lib/server/users-repository";

export async function requireAuthUser() {
  const session = await auth();
  const email = session?.user?.email;

  if (!email) {
    redirect("/auth/sign-in");
  }

  const user = getUserByEmail(email);

  if (!user) {
    redirect("/auth/sign-in");
  }

  if (user.suspended) {
    redirect("/auth/sign-in?suspended=1");
  }

  return user;
}

export async function requireRole(role: AuthUserRole) {
  const user = await requireAuthUser();

  if (user.role !== "admin" && !user.onboardingCompleted) {
    redirect("/onboarding/role");
  }

  if (user.role !== role) {
    redirect(`/dashboard/${user.role}`);
  }

  return user;
}
