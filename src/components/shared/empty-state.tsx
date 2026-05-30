import { SearchX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
};

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed bg-muted/30 p-8 text-center",
        className
      )}
    >
      <div className="mb-4 rounded-full border bg-background p-3">
        <SearchX className="size-5 text-muted-foreground" />
      </div>
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        {description}
      </p>
      {actionLabel && actionHref ? (
        <Button asChild className="mt-5">
          <a href={actionHref}>{actionLabel}</a>
        </Button>
      ) : null}
    </div>
  );
}

