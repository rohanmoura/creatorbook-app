import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

type ProfileStatCardProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  detail: string;
};

export function ProfileStatCard({
  icon: Icon,
  label,
  value,
  detail,
}: ProfileStatCardProps) {
  return (
    <Card className="rounded-lg">
      <CardContent className="p-4">
        <Icon className="mb-3 size-5 text-primary" />
        <p className="text-xl font-semibold">{value}</p>
        <p className="mt-1 text-sm font-medium">{label}</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  );
}

