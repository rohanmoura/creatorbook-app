import { CheckCircle2, Clock3, Heart, MessageSquare } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const activityItems = [
  {
    icon: Clock3,
    title: "Riya Kapoor request is pending",
    detail: "Creator can accept or propose a new time.",
  },
  {
    icon: CheckCircle2,
    title: "Aarav Mehta session confirmed",
    detail: "Session appears in upcoming bookings.",
  },
  {
    icon: Heart,
    title: "Daniel Brooks saved",
    detail: "Saved creators stay available for repeat booking.",
  },
  {
    icon: MessageSquare,
    title: "Review available",
    detail: "Completed sessions can collect marketplace trust signals.",
  },
];

export function ActivityFeed() {
  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle>Activity feed</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {activityItems.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.title} className="flex gap-3">
              <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border bg-muted/30">
                <Icon className="size-4 text-primary" />
              </span>
              <div>
                <p className="text-sm font-medium">{item.title}</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {item.detail}
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

