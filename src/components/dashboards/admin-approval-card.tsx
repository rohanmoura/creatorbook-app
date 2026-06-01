import Link from "next/link";
import { FileText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SubmitButton } from "@/components/shared/submit-button";
import { updateCreatorStatus } from "@/app/dashboard/admin/actions";
import { formatCurrency } from "@/lib/formatters";
import type { CreatorProfile } from "@/types/marketplace";

type AdminApprovalCardProps = {
  creator: CreatorProfile;
};

export function AdminApprovalCard({ creator }: AdminApprovalCardProps) {
  return (
    <Card className="premium-card-hover overflow-hidden rounded-lg">
      <CardContent className="p-0">
        <div className="border-l-4 border-primary/70 p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="rounded-md capitalize">
                {creator.profileStatus}
              </Badge>
              <Badge variant="secondary" className="rounded-md">
                {creator.category}
              </Badge>
            </div>
            <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
              Review queue
            </span>
          </div>
          <h3 className="mt-3 text-base font-semibold">{creator.name}</h3>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {creator.headline}
          </p>
          <div className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
            <span className="rounded-md bg-muted/35 px-3 py-2 text-muted-foreground">
              {creator.completedSessions}+ sessions
            </span>
            <span className="rounded-md bg-muted/35 px-3 py-2 text-muted-foreground">
              {creator.rating} rating
            </span>
            <span className="rounded-md bg-muted/35 px-3 py-2 text-muted-foreground">
              From {formatCurrency(creator.priceFrom)}
            </span>
          </div>
          <p className="mt-4 flex gap-2 rounded-md bg-muted/35 p-3 text-sm leading-6 text-muted-foreground">
            <FileText className="mt-1 size-4 shrink-0" />
            Review service clarity, proof quality, and verification before
            approving this creator for marketplace discovery.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t bg-muted/20 p-3">
          <form action={updateCreatorStatus}>
            <input type="hidden" name="creatorId" value={creator.id} />
            <input type="hidden" name="creatorSlug" value={creator.slug} />
            <input type="hidden" name="status" value="approved" />
            <SubmitButton size="sm" className="h-8 px-3" pendingLabel="Approving">
              Approve
            </SubmitButton>
          </form>
          <form action={updateCreatorStatus}>
            <input type="hidden" name="creatorId" value={creator.id} />
            <input type="hidden" name="creatorSlug" value={creator.slug} />
            <input type="hidden" name="status" value="pending" />
            <SubmitButton
              size="sm"
              variant="outline"
              className="h-8 px-3"
              pendingLabel="Sending"
            >
              Request edits
            </SubmitButton>
          </form>
          <form action={updateCreatorStatus}>
            <input type="hidden" name="creatorId" value={creator.id} />
            <input type="hidden" name="creatorSlug" value={creator.slug} />
            <input type="hidden" name="status" value="rejected" />
            <SubmitButton
              size="sm"
              variant="destructive"
              className="h-8 px-3"
              pendingLabel="Rejecting"
            >
              Reject
            </SubmitButton>
          </form>
          <Button
            asChild
            size="sm"
            variant="ghost"
            className="h-8 px-3 sm:ml-auto"
          >
            <Link href={`/creators/${creator.slug}`}>View profile</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
