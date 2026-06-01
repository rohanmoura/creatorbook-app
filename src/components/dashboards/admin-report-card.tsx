import { AlertTriangle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SubmitButton } from "@/components/shared/submit-button";
import { updateReportModerationStatus } from "@/app/dashboard/admin/actions";
import type { Report } from "@/types/marketplace";

type AdminReportCardProps = {
  report: Report;
};

export function AdminReportCard({ report }: AdminReportCardProps) {
  return (
    <Card className="premium-card-hover overflow-hidden rounded-lg">
      <CardContent className="p-0">
        <div className="p-4">
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
        </div>
        <div className="flex flex-wrap items-center gap-2 border-t bg-muted/20 p-3">
          <form action={updateReportModerationStatus}>
            <input type="hidden" name="reportId" value={report.id} />
            <input type="hidden" name="status" value="open" />
            <SubmitButton
              size="sm"
              variant="outline"
              className="h-8 px-3"
              pendingLabel="Reopening"
            >
              Reopen
            </SubmitButton>
          </form>
          <form action={updateReportModerationStatus}>
            <input type="hidden" name="reportId" value={report.id} />
            <input type="hidden" name="status" value="reviewing" />
            <SubmitButton size="sm" className="h-8 px-3" pendingLabel="Updating">
              Review
            </SubmitButton>
          </form>
          <form action={updateReportModerationStatus}>
            <input type="hidden" name="reportId" value={report.id} />
            <input type="hidden" name="status" value="resolved" />
            <SubmitButton
              size="sm"
              variant="ghost"
              className="h-8 px-3"
              pendingLabel="Resolving"
            >
              Resolve
            </SubmitButton>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
