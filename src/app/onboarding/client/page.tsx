import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { marketplaceCategories } from "@/lib/constants";
import { requireRole } from "@/lib/server/auth-guards";

import { saveClientPreferences } from "./actions";

export default async function ClientOnboardingPage() {
  await requireRole("client");

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
          <form action={saveClientPreferences} className="grid gap-5">
            <div className="grid gap-3">
              <p className="text-sm font-medium">Service areas</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {marketplaceCategories.map((category) => (
                  <label key={category} className="flex items-center gap-3 rounded-md border p-3 text-sm">
                    <Checkbox name="categories" value={category} />
                    {category}
                  </label>
                ))}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium">
                Budget range
                <select
                  required
                  name="budgetRange"
                  className="h-10 rounded-md border bg-background px-3 font-normal outline-none focus:ring-2 focus:ring-ring/30"
                >
                  <option value="$50-$100">$50-$100</option>
                  <option value="$100-$200">$100-$200</option>
                  <option value="$200-$500">$200-$500</option>
                  <option value="$500+">$500+</option>
                </select>
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Timezone
                <Input required name="timezone" placeholder="Asia/Kolkata" />
              </label>
            </div>
            <label className="grid gap-2 text-sm font-medium">
              What are you booking for?
              <Input
                required
                name="bookingIntent"
                placeholder="Example: MVP planning, UX audit, automation setup"
              />
            </label>
            <Button type="submit" className="mt-4 w-fit">
              Save and start exploring
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
