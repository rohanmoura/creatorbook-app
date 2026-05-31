import Link from "next/link";
import { RotateCcw, Search, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  creatorAvailabilityLabels,
  marketplaceCategories,
} from "@/lib/constants";
import type { CreatorSort } from "@/types/marketplace";

type ExploreFiltersProps = {
  params: {
    q?: string;
    category?: string;
    maxPrice?: string;
    minRating?: string;
    availability?: string;
    sort?: CreatorSort;
  };
};

export function ExploreFilters({ params }: ExploreFiltersProps) {
  return (
    <aside className="premium-panel h-fit rounded-lg lg:sticky lg:top-24">
      <div className="border-b p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-medium">
            <SlidersHorizontal className="size-4" />
            Filters
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link href="/explore">
              <RotateCcw className="size-3.5" />
              Reset
            </Link>
          </Button>
        </div>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Narrow creators by intent, category, budget, trust, and availability.
        </p>
      </div>

      <form className="grid gap-4 p-4">
        <label className="grid gap-2 text-sm font-medium">
          Search intent
          <span className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              name="q"
              defaultValue={params.q}
              placeholder="AI, UX, founder..."
              className="h-10 w-full rounded-md border bg-background pl-9 pr-3 text-sm font-normal outline-none focus:ring-2 focus:ring-ring/30"
            />
          </span>
        </label>

        <label className="grid gap-2 text-sm font-medium">
          Category
          <select
            name="category"
            defaultValue={params.category ?? "All"}
            className="h-10 rounded-md border bg-background px-3 text-sm font-normal outline-none focus:ring-2 focus:ring-ring/30"
          >
            <option>All</option>
            {marketplaceCategories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </label>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
          <label className="grid gap-2 text-sm font-medium">
            Budget
            <select
              name="maxPrice"
              defaultValue={params.maxPrice ?? ""}
              className="h-10 rounded-md border bg-background px-3 text-sm font-normal outline-none focus:ring-2 focus:ring-ring/30"
            >
              <option value="">Any price</option>
              <option value="80">Up to $80</option>
              <option value="100">Up to $100</option>
              <option value="130">Up to $130</option>
            </select>
          </label>

          <label className="grid gap-2 text-sm font-medium">
            Minimum rating
            <select
              name="minRating"
              defaultValue={params.minRating ?? ""}
              className="h-10 rounded-md border bg-background px-3 text-sm font-normal outline-none focus:ring-2 focus:ring-ring/30"
            >
              <option value="">Any rating</option>
              <option value="4.6">4.6+</option>
              <option value="4.8">4.8+</option>
              <option value="4.9">4.9+</option>
            </select>
          </label>
        </div>

        <label className="grid gap-2 text-sm font-medium">
          Availability
          <select
            name="availability"
            defaultValue={params.availability ?? ""}
            className="h-10 rounded-md border bg-background px-3 text-sm font-normal outline-none focus:ring-2 focus:ring-ring/30"
          >
            <option value="">Any time</option>
            {creatorAvailabilityLabels.map((label) => (
              <option key={label}>{label}</option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm font-medium">
          Sort
          <select
            name="sort"
            defaultValue={params.sort ?? "recommended"}
            className="h-10 rounded-md border bg-background px-3 text-sm font-normal outline-none focus:ring-2 focus:ring-ring/30"
          >
            <option value="recommended">Recommended</option>
            <option value="rating">Highest rated</option>
            <option value="price">Lowest price</option>
            <option value="newest">Newest</option>
          </select>
        </label>

        <Button type="submit" className="mt-1">
          Apply filters
        </Button>
      </form>
    </aside>
  );
}
