import Link from "next/link";
import {
  Bell,
  CheckCircle2,
  Clock3,
  Heart,
  MessageSquare,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ActivityNotification = {
  id: string;
  type: string;
  title: string;
  body: string;
  targetHref?: string | null;
  createdAt: string;
};

type ActivityFeedProps = {
  notifications?: ActivityNotification[];
};

type ActivityItem = {
  id: string;
  type: string;
  title: string;
  body: string;
  targetHref?: string | null;
  createdAt?: string;
  icon: typeof Bell;
};

function iconForType(type: string) {
  if (type.includes("confirmed") || type.includes("approved")) {
    return CheckCircle2;
  }

  if (type.includes("review") || type.includes("report")) {
    return MessageSquare;
  }

  if (type.includes("saved")) {
    return Heart;
  }

  if (type.includes("booking") || type.includes("reschedule")) {
    return Clock3;
  }

  return Bell;
}

function formatActivityTime(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function ActivityFeed({ notifications = [] }: ActivityFeedProps) {
  const activityItems: ActivityItem[] = notifications.map((notification) => ({
    ...notification,
    icon: iconForType(notification.type),
  }));

  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle>Activity feed</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {activityItems.length > 0 ? (
          activityItems.map((item) => {
          const Icon = item.icon;
          const content = (
            <>
              <p className="text-sm font-medium">{item.title}</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {item.body}
              </p>
              {item.createdAt ? (
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatActivityTime(item.createdAt)}
                </p>
              ) : null}
            </>
          );

          return (
            <div key={item.id} className="flex gap-3">
              <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border bg-muted/30">
                <Icon className="size-4 text-primary" />
              </span>
              {item.targetHref ? (
                <Link href={item.targetHref} className="min-w-0 hover:text-primary">
                  {content}
                </Link>
              ) : (
                <div className="min-w-0">{content}</div>
              )}
            </div>
          );
          })
        ) : (
          <div className="rounded-lg border border-dashed p-5 text-sm leading-6 text-muted-foreground">
            No activity yet. Booking, review, and moderation updates will
            appear here.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
