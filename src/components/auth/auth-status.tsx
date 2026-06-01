import Link from "next/link";
import { LayoutDashboard, LogOut, ShieldCheck } from "lucide-react";

import { signOutUser } from "@/app/auth/actions";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";

export async function AuthStatus() {
  const session = await auth();

  if (!session?.user) {
    return (
      <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
        <Link href="/auth/sign-in">
          <ShieldCheck className="size-4" />
          Sign in
        </Link>
      </Button>
    );
  }

  const dashboardHref = session.user.onboardingCompleted
    ? `/dashboard/${session.user.role ?? "client"}`
    : "/onboarding/role";

  return (
    <div className="hidden items-center gap-2 sm:flex">
      <span className="max-w-36 truncate text-sm text-muted-foreground">
        {session.user.name ?? session.user.email}
      </span>
      <Button asChild variant="outline" size="sm">
        <Link href={dashboardHref}>
          <LayoutDashboard className="size-4" />
          Dashboard
        </Link>
      </Button>
      <form action={signOutUser}>
        <Button type="submit" variant="outline" size="sm">
          <LogOut className="size-4" />
          Sign out
        </Button>
      </form>
    </div>
  );
}
