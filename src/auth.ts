import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

import {
  getUserByEmail,
  upsertAuthUser,
  type AuthUserRole,
} from "@/lib/server/users-repository";

function isAuthUserRole(role: unknown): role is AuthUserRole {
  return role === "client" || role === "creator" || role === "admin";
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google,
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize(credentials) {
        const email = String(credentials?.email ?? "").trim().toLowerCase();
        const password = String(credentials?.password ?? "");

        if (!email || !email.includes("@") || password.length < 6) {
          return null;
        }

        const dbUser = upsertAuthUser({
          email,
          name: email.split("@")[0],
          provider: "credentials",
        });

        if (!dbUser) {
          return null;
        }

        return {
          id: dbUser.id,
          email: dbUser.email,
          name: dbUser.name,
          image: dbUser.image ?? undefined,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) {
        return false;
      }

      upsertAuthUser({
        email: user.email,
        name: user.name,
        image: user.image,
        provider: account?.provider,
      });

      return true;
    },
    async jwt({ token }) {
      if (token.email) {
        const dbUser = getUserByEmail(token.email);

        if (dbUser) {
          token.userId = dbUser.id;
          token.role = dbUser.role;
          token.onboardingCompleted = dbUser.onboardingCompleted;
          token.name = dbUser.name;
          token.picture = dbUser.image ?? token.picture;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        if (typeof token.userId === "string") {
          session.user.id = token.userId;
        }

        if (isAuthUserRole(token.role)) {
          session.user.role = token.role;
        }

        session.user.onboardingCompleted = Boolean(token.onboardingCompleted);

        if (session.user.email) {
          const dbUser = getUserByEmail(session.user.email);

          if (dbUser) {
            session.user.id = dbUser.id;
            session.user.role = dbUser.role;
            session.user.onboardingCompleted = dbUser.onboardingCompleted;
            session.user.name = dbUser.name;
            session.user.image = dbUser.image ?? session.user.image;
          }
        }
      }

      return session;
    },
  },
});
