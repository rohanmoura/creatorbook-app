import Link from "next/link";
import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CreatorSort } from "@/types/marketplace";

type ActiveFilterBarProps = {
  params: {
    q?: string;
    category?: string;
    maxPrice?: string;
    minRating?: string;
    availability?: string;
    sort?: CreatorSort;
  };
  resultCount: number;
  totalCount: number;
};

export function ActiveFilterBar({
  params,
  resultCount,
  totalCount,
}: ActiveFilterBarProps) {
  const activeFilters = [
    params.q ? `Search: ${params.q}` : null,
    params.category && params.category !== "All"
      ? `Category: ${params.category}`
      : null,
    params.maxPrice ? `Up to $${params.maxPrice}` : null,
    params.minRating ? `${params.minRating}+ rating` : null,
    params.availability ? `Available: ${params.availability}` : null,
    params.sort && params.sort !== "recommended" ? `Sort: ${params.sort}` : null,
  ].filter(Boolean);

  return (
    <div className="premium-panel mt-6 rounded-lg p-3">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-medium text-foreground">{resultCount}</span> of{" "}
          <span className="font-medium text-foreground">{totalCount}</span>{" "}
          verified marketplace creators
        </p>
        {activeFilters.length > 0 ? (
          <Button asChild variant="ghost" size="sm">
            <Link href="/explore">
              <X className="size-3.5" />
              Clear all
            </Link>
          </Button>
        ) : null}
      </div>
      {activeFilters.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {activeFilters.map((filter) => (
            <Badge key={filter} variant="secondary" className="rounded-md">
              {filter}
            </Badge>
          ))}
        </div>
      ) : null}
    </div>
  );
}
