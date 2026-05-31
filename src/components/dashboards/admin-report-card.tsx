import { AlertTriangle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { ToastActionButton } from "@/components/shared/toast-action-button";
import { Card, CardContent } from "@/components/ui/card";
import type { Report } from "@/types/marketplace";

type AdminReportCardProps = {
  report: Report;
};

export function AdminReportCard({ report }: AdminReportCardProps) {
  return (
    <Card className="premium-card-hover rounded-lg">
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="rounded-md">
              {report.targetType}
            </Badge>
            <Badge variant="secondary" className="rounded-md">
              {report.status}
            </Badge>
          </div>
          <span className="text-xs text-muted-foreground">{report.id}</span>
        </div>
        <p className="mt-3 flex gap-2 text-sm leading-6 text-muted-foreground">
          <AlertTriangle className="mt-1 size-4 shrink-0 text-amber-600" />
          {report.reason}
        </p>
        <p className="mt-3 text-xs text-muted-foreground">
          Reported by {report.reportedBy}
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          <ToastActionButton
            label="Inspect"
            message="Report inspection mocked"
            description={`${report.id} would open the reported content.`}
            variant="outline"
          />
          <ToastActionButton
            label="Review"
            message="Report marked for review"
            description={`${report.id} would move into moderation review.`}
            variant="default"
          />
          <ToastActionButton
            label="Resolve"
            message="Report resolved"
            description={`${report.id} would be closed in the moderation queue.`}
            variant="ghost"
          />
        </div>
      </CardContent>
    </Card>
  );
}
