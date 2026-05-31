import { Activity, CheckCircle2, Clock3, ShieldCheck } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const healthItems = [
  {
    icon: CheckCircle2,
    label: "Booking flow",
    status: "Healthy",
    detail: "Requests, statuses, and dashboards are connected.",
  },
  {
    icon: Clock3,
    label: "Approval queue",
    status: "Needs review",
    detail: "One creator profile is waiting for moderation.",
  },
  {
    icon: ShieldCheck,
    label: "Reports",
    status: "2 open",
    detail: "Moderation queue has actionable items.",
  },
];

export function PlatformHealthCard() {
  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="size-5 text-primary" />
          Platform health
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {healthItems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="flex gap-3">
              <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border bg-muted/30">
                <Icon className="size-4 text-primary" />
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium">{item.label}</p>
                  <span className="text-xs text-muted-foreground">
                    {item.status}
                  </span>
                </div>
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

