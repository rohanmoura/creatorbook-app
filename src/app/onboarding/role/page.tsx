import Link from "next/link";
import { redirect } from "next/navigation";
import { BriefcaseBusiness, Search, UserRoundCog } from "lucide-react";

import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { chooseRole } from "./actions";

const roles = [
  {
    value: "client",
    title: "Book an expert",
    description: "Find creators, save favorites, and request paid sessions.",
    icon: Search,
  },
  {
    value: "creator",
    title: "Become a creator",
    description: "Create a profile, add services, and manage booking requests.",
    icon: BriefcaseBusiness,
  },
];

export default async function RoleOnboardingPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/auth/sign-in");
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight">Choose your role</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Select how you want to use CreatorBook. This choice controls your
          onboarding flow, dashboard access, and workspace navigation.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {roles.map((role) => {
          const Icon = role.icon;
          return (
            <Card key={role.value} className="rounded-lg">
              <CardContent className="p-5">
                <Icon className="mb-4 size-6 text-primary" />
                <h2 className="font-semibold">{role.title}</h2>
                <p className="mt-2 min-h-16 text-sm leading-6 text-muted-foreground">
                  {role.description}
                </p>
                <form action={chooseRole} className="mt-5">
                  <input type="hidden" name="role" value={role.value} />
                  <Button type="submit" className="w-full">
                    Continue
                  </Button>
                </form>
              </CardContent>
            </Card>
          );
        })}
      </div>
      {session.user.role === "admin" ? (
        <Card className="mt-4 rounded-lg border-primary/20 bg-primary/5">
          <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <UserRoundCog className="mt-0.5 size-5 text-primary" />
              <div>
                <h2 className="font-semibold">Admin workspace</h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Admin access is assigned by the platform, not selected by a
                  normal user during onboarding.
                </p>
              </div>
            </div>
            <Button asChild variant="outline">
              <Link href="/dashboard/admin">Open admin</Link>
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </main>
  );
}
