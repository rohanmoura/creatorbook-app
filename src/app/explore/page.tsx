import { SlidersHorizontal } from "lucide-react";

import { CreatorCard } from "@/components/marketplace/creator-card";
import { EmptyState } from "@/components/shared/empty-state";
import { SectionHeader } from "@/components/shared/section-header";
import { Button } from "@/components/ui/button";
import { creatorAvailabilityLabels, marketplaceCategories } from "@/lib/constants";
import { filterCreators } from "@/lib/filters";
import { creators } from "@/data/mock-creators";
import type { CreatorSort } from "@/types/marketplace";

type ExplorePageProps = {
  searchParams: Promise<{
    q?: string;
    category?: string;
    maxPrice?: string;
    minRating?: string;
    availability?: string;
    sort?: CreatorSort;
  }>;
};

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const params = await searchParams;
  const filteredCreators = filterCreators(creators, {
    query: params.q,
    category: params.category,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    minRating: params.minRating ? Number(params.minRating) : undefined,
    availability: params.availability,
    sort: params.sort,
  });

  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-8">
      <aside className="h-fit rounded-lg border bg-card p-4">
        <div className="mb-4 flex items-center gap-2 font-medium">
          <SlidersHorizontal className="size-4" />
          Filters
        </div>
        <form className="grid gap-4">
          <label className="grid gap-2 text-sm">
            Search
            <input
              name="q"
              defaultValue={params.q}
              placeholder="AI, UX, founder..."
              className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/30"
            />
          </label>
          <label className="grid gap-2 text-sm">
            Category
            <select
              name="category"
              defaultValue={params.category ?? "All"}
              className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/30"
            >
              <option>All</option>
              {marketplaceCategories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm">
            Max price
            <select
              name="maxPrice"
              defaultValue={params.maxPrice ?? ""}
              className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/30"
            >
              <option value="">Any price</option>
              <option value="80">Up to $80</option>
              <option value="100">Up to $100</option>
              <option value="130">Up to $130</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm">
            Rating
            <select
              name="minRating"
              defaultValue={params.minRating ?? ""}
              className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/30"
            >
              <option value="">Any rating</option>
              <option value="4.6">4.6+</option>
              <option value="4.8">4.8+</option>
              <option value="4.9">4.9+</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm">
            Availability
            <select
              name="availability"
              defaultValue={params.availability ?? ""}
              className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/30"
            >
              <option value="">Any time</option>
              {creatorAvailabilityLabels.map((label) => (
                <option key={label}>{label}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm">
            Sort
            <select
              name="sort"
              defaultValue={params.sort ?? "recommended"}
              className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/30"
            >
              <option value="recommended">Recommended</option>
              <option value="rating">Rating</option>
              <option value="price">Price</option>
              <option value="newest">Newest</option>
            </select>
          </label>
          <Button type="submit">Apply filters</Button>
        </form>
      </aside>

      <section className="min-w-0">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <SectionHeader
            eyebrow="Explore creators"
            title="Browse experts by service, category, and availability"
            description="This listing proves marketplace discovery, filtering, sorting, and empty states."
          />
          <p className="text-sm text-muted-foreground">
            {filteredCreators.length} creators found
          </p>
        </div>
        {filteredCreators.length > 0 ? (
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredCreators.map((creator) => (
              <CreatorCard key={creator.id} creator={creator} />
            ))}
          </div>
        ) : (
          <EmptyState
            className="mt-8"
            title="No creators found"
            description="Try changing category, price, rating, or availability filters to widen the marketplace results."
            actionLabel="Reset filters"
            actionHref="/explore"
          />
        )}
      </section>
    </main>
  );
}

