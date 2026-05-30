import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function BookingSuccessPage() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-3xl items-center px-4 py-16 sm:px-6">
      <Card className="w-full rounded-lg">
        <CardContent className="p-8 text-center">
          <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="size-7" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Booking request submitted
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
            Your request is now marked as Pending. In the real product, the
            creator would accept, reject, or suggest a reschedule from their
            dashboard.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild>
              <Link href="/dashboard/client">View client dashboard</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/explore">Explore more creators</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

