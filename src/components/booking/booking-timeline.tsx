import { CheckCircle2, CircleDashed, Clock3 } from "lucide-react";

import { cn } from "@/lib/utils";

type BookingTimelineProps = {
  compact?: boolean;
};

const timeline = [
  {
    title: "Request submitted",
    description: "Client sends service, time, and context.",
    icon: CheckCircle2,
    state: "done",
  },
  {
    title: "Creator review",
    description: "Creator accepts, rejects, or suggests a new time.",
    icon: Clock3,
    state: "active",
  },
  {
    title: "Session confirmed",
    description: "Booking moves to confirmed and appears in dashboards.",
    icon: CircleDashed,
    state: "pending",
  },
];

export function BookingTimeline({ compact = false }: BookingTimelineProps) {
  return (
    <div className="grid gap-3">
      {timeline.map((item) => {
        const Icon = item.icon;

        return (
          <div key={item.title} className="flex gap-3">
            <span
              className={cn(
                "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border",
                item.state === "done" &&
                  "border-emerald-200 bg-emerald-50 text-emerald-700",
                item.state === "active" &&
                  "border-amber-200 bg-amber-50 text-amber-700",
                item.state === "pending" && "bg-background text-muted-foreground"
              )}
            >
              <Icon className="size-4" />
            </span>
            <div>
              <p className="text-sm font-medium">{item.title}</p>
              {!compact ? (
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {item.description}
                </p>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}

