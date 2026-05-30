import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { marketplaceCategories } from "@/lib/constants";

export default function ClientOnboardingPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <Card className="rounded-lg">
        <CardHeader>
          <CardTitle>Client preferences</CardTitle>
          <p className="text-sm leading-6 text-muted-foreground">
            Pick the service areas you want CreatorBook to recommend first.
          </p>
        </CardHeader>
        <CardContent>
          <form className="grid gap-3">
            {marketplaceCategories.slice(0, 8).map((category) => (
              <label key={category} className="flex items-center gap-3 rounded-md border p-3 text-sm">
                <Checkbox name="categories" value={category} />
                {category}
              </label>
            ))}
            <Button asChild className="mt-4 w-fit">
              <Link href="/explore">Start exploring</Link>
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}

