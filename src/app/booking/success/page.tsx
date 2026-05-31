import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock3 } from "lucide-react";

import { BookingTimeline } from "@/components/booking/booking-timeline";
import { StatusBadge } from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BookingSuccessPage() {
  return (
    <main className="mx-auto grid max-w-5xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_320px] lg:px-8">
      <Card className="rounded-lg">
        <CardContent className="p-8">
          <div className="mb-6 flex size-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="size-7" />
          </div>
          <Badge variant="secondary" className="mb-4 rounded-md">
            Request ID CB-1026
          </Badge>
          <h1 className="text-3xl font-semibold tracking-tight">
            Booking request submitted
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
            Your request is now marked as Pending. The creator can accept,
            reject, or suggest a rescheduled time from their dashboard.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border bg-muted/25 p-4">
              <p className="text-sm text-muted-foreground">Current status</p>
              <div className="mt-2">
                <StatusBadge status="Pending" />
              </div>
            </div>
            <div className="rounded-lg border bg-muted/25 p-4">
              <p className="text-sm text-muted-foreground">Creator response</p>
              <p className="mt-2 font-medium">Usually within 2 hours</p>
            </div>
            <div className="rounded-lg border bg-muted/25 p-4">
              <p className="text-sm text-muted-foreground">Mock payment</p>
              <p className="mt-2 font-medium">Authorized, not captured</p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <Link href="/dashboard/client">
                View client dashboard
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/explore">Explore more creators</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <aside className="space-y-4">
        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock3 className="size-5 text-primary" />
              Booking timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BookingTimeline />
          </CardContent>
        </Card>

        <Card className="rounded-lg">
          <CardContent className="p-5">
            <p className="text-sm font-medium">Dashboard impact</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              This request appears in the client dashboard as Pending and in the
              creator dashboard as a request awaiting action.
            </p>
          </CardContent>
        </Card>
      </aside>
    </main>
  );
}

