import type { DefaultSession } from "next-auth";

type AuthUserRole = "client" | "creator" | "admin";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id?: string;
      role?: AuthUserRole;
      onboardingCompleted?: boolean;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
    role?: AuthUserRole;
    onboardingCompleted?: boolean;
  }
}
