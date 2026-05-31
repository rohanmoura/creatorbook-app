import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type MetricCardProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  detail: string;
  tone?: "default" | "warning" | "success";
};

const toneClasses = {
  default: "bg-primary/10 text-primary",
  warning: "bg-amber-50 text-amber-700",
  success: "bg-emerald-50 text-emerald-700",
};

export function MetricCard({
  icon: Icon,
  label,
  value,
  detail,
  tone = "default",
}: MetricCardProps) {
  return (
    <Card className="premium-card-hover rounded-lg">
      <CardContent className="p-4">
        <div
          className={cn(
            "mb-4 flex size-10 items-center justify-center rounded-lg",
            toneClasses[tone]
          )}
        >
          <Icon className="size-5" />
        </div>
        <p className="text-2xl font-semibold">{value}</p>
        <p className="mt-1 text-sm font-medium">{label}</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  );
}
