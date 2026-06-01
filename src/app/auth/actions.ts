"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

import { signIn, signOut } from "@/auth";

export async function signInWithGoogle() {
  await signIn("google", { redirectTo: "/onboarding/role" });
}

export async function signInWithEmail(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !email.includes("@") || password.length < 6) {
    redirect("/auth/sign-in?error=credentials");
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/onboarding/role",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect("/auth/sign-in?error=credentials");
    }

    throw error;
  }
}

export async function signOutUser() {
  await signOut({ redirectTo: "/" });
}
