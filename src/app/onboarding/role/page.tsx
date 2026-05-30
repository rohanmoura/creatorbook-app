import Link from "next/link";
import { BriefcaseBusiness, Search, UserRoundCog } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const roles = [
  {
    href: "/onboarding/client",
    title: "Book an expert",
    description: "Find creators, save favorites, and request paid sessions.",
    icon: Search,
  },
  {
    href: "/onboarding/creator",
    title: "Become a creator",
    description: "Create a profile, add services, and manage booking requests.",
    icon: BriefcaseBusiness,
  },
  {
    href: "/dashboard/admin",
    title: "Admin demo",
    description: "Review approvals, bookings, categories, and marketplace reports.",
    icon: UserRoundCog,
  },
];

export default function RoleOnboardingPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight">Choose your role</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Role switching is mocked for portfolio review, but the permissions map
          to a real marketplace product.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {roles.map((role) => {
          const Icon = role.icon;
          return (
            <Card key={role.href} className="rounded-lg">
              <CardContent className="p-5">
                <Icon className="mb-4 size-6 text-primary" />
                <h2 className="font-semibold">{role.title}</h2>
                <p className="mt-2 min-h-16 text-sm leading-6 text-muted-foreground">
                  {role.description}
                </p>
                <Button asChild className="mt-5 w-full">
                  <Link href={role.href}>Continue</Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </main>
  );
}

