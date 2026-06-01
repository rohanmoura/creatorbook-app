"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CalendarClock, CheckCircle2, X } from "lucide-react";

import { StatusBadge } from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  demoBookingStorageKey,
  type DemoBookingRequest,
} from "@/lib/demo-storage";
import { formatCurrency, formatDuration } from "@/lib/formatters";

type DemoBookingNoticeProps = {
  audience: "client" | "creator";
  creatorSlug?: string;
};

export function DemoBookingNotice({
  audience,
  creatorSlug,
}: DemoBookingNoticeProps) {
  const [request, setRequest] = useState<DemoBookingRequest | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const stored = window.localStorage.getItem(demoBookingStorageKey);

      if (!stored) {
        return;
      }

      try {
        const parsed = JSON.parse(stored) as DemoBookingRequest;
        setRequest(parsed);
      } catch {
        window.localStorage.removeItem(demoBookingStorageKey);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  if (!request) {
    return null;
  }

  if (audience === "creator" && creatorSlug !== request.creatorSlug) {
    return null;
  }

  const clearRequest = () => {
    window.localStorage.removeItem(demoBookingStorageKey);
    setRequest(null);
  };

  return (
    <Card className="mb-6 rounded-lg border-primary/30 bg-primary/5 shadow-[0_18px_45px_rgba(0,95,153,0.1)]">
      <CardContent className="grid gap-4 p-5 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Badge className="rounded-md">
              <CheckCircle2 className="size-3.5" />
              Saved demo request
            </Badge>
            <StatusBadge status="Pending" />
            <span className="text-xs font-medium text-muted-foreground">
              {request.requestId}
            </span>
          </div>
          <h2 className="text-lg font-semibold">
            {audience === "client"
              ? `Request sent to ${request.creatorName}`
              : "New client request received"}
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {request.serviceTitle} on {request.date} at {request.time}. This is
            stored locally in the browser so the mock booking flow feels
            connected across screens.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <Badge variant="outline" className="rounded-md">
              <CalendarClock className="size-3.5" />
              {request.slot ?? "Custom slot"}
            </Badge>
            <Badge variant="outline" className="rounded-md">
              {formatDuration(request.duration)}
            </Badge>
            <Badge variant="outline" className="rounded-md">
              {formatCurrency(request.price)}
            </Badge>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 lg:justify-end">
          <Button asChild size="sm">
            <Link href="/dashboard/client">Client view</Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href={`/creators/${request.creatorSlug}`}>Creator profile</Link>
          </Button>
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            aria-label="Dismiss saved demo request"
            onClick={clearRequest}
          >
            <X className="size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
