import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { marketplaceCategories } from "@/lib/constants";

export default function CreatorOnboardingPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <Card className="rounded-lg">
        <CardHeader>
          <CardTitle>Creator onboarding</CardTitle>
          <p className="text-sm leading-6 text-muted-foreground">
            Mock application form for provider profile approval.
          </p>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4">
            <label className="grid gap-2 text-sm">
              Professional headline
              <Input placeholder="Startup strategist for early-stage founders" />
            </label>
            <label className="grid gap-2 text-sm">
              Category
              <select className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/30">
                {marketplaceCategories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm">
              Bio
              <Textarea placeholder="Explain who you help, how you help, and what clients can book." />
            </label>
            <Button asChild className="w-fit">
              <Link href="/dashboard/creator">Submit mock application</Link>
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}

