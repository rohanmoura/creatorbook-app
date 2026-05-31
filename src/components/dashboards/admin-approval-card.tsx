import Link from "next/link";
import { FileText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ToastActionButton } from "@/components/shared/toast-action-button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";
import type { CreatorProfile } from "@/types/marketplace";

type AdminApprovalCardProps = {
  creator: CreatorProfile;
};

export function AdminApprovalCard({ creator }: AdminApprovalCardProps) {
  return (
    <Card className="premium-card-hover rounded-lg">
      <CardContent className="grid gap-4 p-4 lg:grid-cols-[1fr_auto]">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="rounded-md capitalize">
              {creator.profileStatus}
            </Badge>
            <Badge variant="secondary" className="rounded-md">
              {creator.category}
            </Badge>
          </div>
          <h3 className="font-semibold">{creator.name}</h3>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {creator.headline}
          </p>
          <div className="mt-4 grid gap-2 text-sm text-muted-foreground md:grid-cols-3">
            <span>{creator.completedSessions}+ sessions</span>
            <span>{creator.rating} rating</span>
            <span>From {formatCurrency(creator.priceFrom)}</span>
          </div>
          <p className="mt-4 flex gap-2 rounded-md bg-muted/35 p-3 text-sm leading-6 text-muted-foreground">
            <FileText className="mt-1 size-4 shrink-0" />
            Review service clarity, proof quality, and verification before
            approving this creator for marketplace discovery.
          </p>
        </div>

        <div className="flex gap-2 lg:w-40 lg:flex-col">
          <ToastActionButton
            label="Approve"
            message="Creator approved"
            description={`${creator.name} would become visible in marketplace search.`}
            variant="default"
            className="flex-1"
          />
          <ToastActionButton
            label="Request edits"
            message="Edit request sent"
            description={`${creator.name} would receive profile improvement notes.`}
            variant="outline"
            className="flex-1"
          />
          <ToastActionButton
            label="Reject"
            message="Creator rejected"
            description={`${creator.name} would remain hidden from marketplace discovery.`}
            variant="ghost"
            className="flex-1"
          />
          <Button asChild size="sm" variant="outline" className="flex-1">
            <Link href={`/creators/${creator.slug}`}>View profile</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
