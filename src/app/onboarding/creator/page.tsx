import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { marketplaceCategories } from "@/lib/constants";
import { requireRole } from "@/lib/server/auth-guards";

import { submitCreatorApplication } from "./actions";

export default async function CreatorOnboardingPage() {
  await requireRole("creator");

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <Card className="rounded-lg">
        <CardHeader>
          <CardTitle>Creator onboarding</CardTitle>
          <p className="text-sm leading-6 text-muted-foreground">
            Submit your marketplace profile for admin approval. Approved
            creators become visible in public discovery.
          </p>
        </CardHeader>
        <CardContent>
          <form action={submitCreatorApplication} className="grid gap-4">
            <label className="grid gap-2 text-sm font-medium">
              Professional headline
              <Input
                required
                name="headline"
                placeholder="Startup strategist for early-stage founders"
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium">
              Category
              <select
                required
                name="category"
                className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/30"
              >
                {marketplaceCategories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </label>
              <label className="grid gap-2 text-sm font-medium">
                Location
                <Input required name="location" placeholder="Bengaluru, India" />
              </label>
            </div>
            <label className="grid gap-2 text-sm font-medium">
              Language
              <Input required name="language" placeholder="English, Hindi" />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Bio
              <Textarea
                required
                name="bio"
                className="min-h-28"
                placeholder="Explain who you help, how you help, and what clients can book."
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Skills
              <Textarea
                required
                name="skills"
                placeholder={"MVP strategy\nPricing\nGo-to-market"}
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Availability slots
              <Textarea
                required
                name="availabilitySlots"
                placeholder={"Tomorrow, 5:00 PM\nFriday, 11:00 AM"}
              />
            </label>
            <div className="rounded-lg border bg-muted/20 p-4">
              <h2 className="font-medium">First service package</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Clients need at least one bookable offer before your profile can
                be reviewed.
              </p>
              <div className="mt-4 grid gap-4">
                <label className="grid gap-2 text-sm font-medium">
                  Package title
                  <Input
                    required
                    name="serviceTitle"
                    placeholder="MVP scope review"
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium">
                  Package description
                  <Textarea
                    required
                    name="serviceDescription"
                    placeholder="Describe what the client gets in this session."
                  />
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm font-medium">
                    Duration
                    <Input required min={15} step={15} type="number" name="serviceDuration" placeholder="60" />
                  </label>
                  <label className="grid gap-2 text-sm font-medium">
                    Price
                    <Input required min={1} type="number" name="servicePrice" placeholder="149" />
                  </label>
                </div>
                <label className="grid gap-2 text-sm font-medium">
                  Deliverables
                  <Textarea
                    required
                    name="deliverables"
                    placeholder={"Action plan\nPriority fixes\nFollow-up checklist"}
                  />
                </label>
              </div>
            </div>
            <Button type="submit" className="w-fit">
              Submit for approval
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
