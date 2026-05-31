import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDuration } from "@/lib/formatters";
import type { Service } from "@/types/marketplace";

type ServicePackageCardProps = {
  service: Service;
  creatorSlug: string;
};

export function ServicePackageCard({
  service,
  creatorSlug,
}: ServicePackageCardProps) {
  return (
    <Card className="rounded-lg transition hover:shadow-sm">
      <CardHeader>
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
          <div>
            <CardTitle>{service.title}</CardTitle>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {service.description}
            </p>
          </div>
          <div className="shrink-0 rounded-lg border bg-muted/25 px-4 py-3 text-right">
            <p className="text-xs text-muted-foreground">Package price</p>
            <p className="text-xl font-semibold">{formatCurrency(service.price)}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap gap-2">
          <Badge variant="outline" className="rounded-md">
            {formatDuration(service.duration)}
          </Badge>
          <Badge variant="outline" className="rounded-md">
            {service.category}
          </Badge>
        </div>
        <div className="grid gap-2 text-sm text-muted-foreground">
          {service.deliverables.map((deliverable) => (
            <span key={deliverable} className="flex gap-2">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
              {deliverable}
            </span>
          ))}
        </div>
      </CardContent>
      <CardFooter className="justify-between gap-3">
        <p className="text-sm text-muted-foreground">Request approval required</p>
        <Button asChild size="sm">
          <Link href={`/book/${creatorSlug}`}>
            Select
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

