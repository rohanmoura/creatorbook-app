import { ArrowRight, BadgeCheck, CalendarCheck, ShieldCheck } from "lucide-react";

import { signInWithEmail, signInWithGoogle } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type SignInPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = await searchParams;
  const hasCredentialsError = params.error === "credentials";

  return (
    <main className="premium-grid border-b">
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.9fr_1fr] lg:items-center lg:px-8">
        <div className="hidden lg:block">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-[0_10px_25px_rgba(16,94,150,0.28)]">
              <CalendarCheck className="size-5" />
            </span>
            <div>
              <p className="font-semibold">CreatorBook</p>
              <p className="text-sm text-muted-foreground">
                Expert booking marketplace
              </p>
            </div>
          </div>
          <h1 className="max-w-xl text-4xl font-semibold tracking-tight md:text-5xl">
            Manage expert bookings with one professional workspace.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">
            Sign in to browse trusted experts, request sessions, manage creator
            services, and operate marketplace workflows from the right role.
          </p>
          <div className="mt-8 grid max-w-lg gap-3">
            {[
              "Book and track expert sessions",
              "Manage creator requests and packages",
              "Moderate marketplace quality",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-lg border bg-background/75 p-3 text-sm"
              >
                <BadgeCheck className="size-4 text-emerald-600" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto w-full max-w-md lg:mr-0">
          <Card className="w-full rounded-lg bg-background/95 shadow-[0_24px_70px_rgba(15,23,42,0.14)] backdrop-blur">
            <CardHeader>
              <CardTitle className="text-2xl">Welcome back</CardTitle>
              <p className="text-sm leading-6 text-muted-foreground">
                Sign in to continue to your CreatorBook workspace.
              </p>
            </CardHeader>
            <CardContent className="grid gap-5">
              <form action={signInWithGoogle}>
                <Button type="submit" className="w-full" size="lg">
                  <ShieldCheck className="size-4" />
                  Continue with Google
                </Button>
              </form>

              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="h-px flex-1 bg-border" />
                or sign in with email
                <span className="h-px flex-1 bg-border" />
              </div>

              <form action={signInWithEmail} className="grid gap-4">
                <label className="grid gap-2 text-sm font-medium">
                  Email
                  <Input
                    required
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium">
                  Password
                  <Input
                    required
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                  />
                </label>
                {hasCredentialsError ? (
                  <p className="rounded-md border border-destructive/25 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    Use a valid email and a password with at least 6 characters.
                  </p>
                ) : null}
                <Button type="submit" variant="outline">
                  Sign in with email
                  <ArrowRight className="size-4" />
                </Button>
              </form>

              <p className="text-center text-sm text-muted-foreground">
                New to CreatorBook? Sign in and you will choose your workspace role next.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
