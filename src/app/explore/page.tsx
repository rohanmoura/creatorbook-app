import Link from "next/link";
import { ArrowUpDown, Grid2X2, List, Sparkles } from "lucide-react";

import { ActiveFilterBar } from "@/components/marketplace/active-filter-bar";
import { CreatorCard, CreatorListCard } from "@/components/marketplace/creator-card";
import { ExploreFilters } from "@/components/marketplace/explore-filters";
import { EmptyState } from "@/components/shared/empty-state";
import { SectionHeader } from "@/components/shared/section-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";
import { filterCreators } from "@/lib/filters";
import {
  getServicesByCreatorIdFromDb,
  listCategories,
  listPublicCreators,
} from "@/lib/server/marketplace-repository";
import { listSavedCreatorIds } from "@/lib/server/saved-creators-repository";
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
  const session = await auth();
  const categories = listCategories();
  const publicCreators = listPublicCreators();
  const savedCreatorIds =
    session?.user?.role === "client" && session.user.id
      ? listSavedCreatorIds(session.user.id)
      : [];
  const currentQuery = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      currentQuery.set(key, value);
    }
  });

  const returnTo = currentQuery.toString()
    ? `/explore?${currentQuery.toString()}`
    : "/explore";
  const filteredCreators = filterCreators(publicCreators, {
    query: params.q,
    category: params.category,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    minRating: params.minRating ? Number(params.minRating) : undefined,
    availability: params.availability,
    sort: params.sort,
  });
  const hasFocusedQuery = Boolean(
    params.q ||
      (params.category && params.category !== "All") ||
      params.maxPrice ||
      params.minRating ||
      params.availability
  );

  return (
    <main>
      <section className="premium-grid border-b">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <SectionHeader
              as="h1"
              eyebrow="Explore creators"
              title="Browse experts by service, category, and availability"
              description="Search realistic creator profiles, compare trust signals, and move directly into a booking flow."
            />
            <div className="grid grid-cols-3 gap-3 rounded-lg border bg-background p-3 text-center shadow-sm">
              <div>
                <p className="text-xl font-semibold">{publicCreators.length}</p>
                <p className="text-xs text-muted-foreground">Creators</p>
              </div>
              <div>
                <p className="text-xl font-semibold">{categories.length}</p>
                <p className="text-xs text-muted-foreground">Categories</p>
              </div>
              <div>
                <p className="text-xl font-semibold">4.8</p>
                <p className="text-xs text-muted-foreground">Avg rating</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-2 overflow-x-auto pb-1">
            <Button asChild variant={!params.category ? "default" : "outline"} size="sm">
              <Link href="/explore">All</Link>
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                asChild
                variant={params.category === category.name ? "default" : "outline"}
                size="sm"
                className="shrink-0"
              >
                <Link href={`/explore?category=${encodeURIComponent(category.name)}`}>
                  {category.name}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[300px_1fr] lg:px-8">
        <ExploreFilters params={params} />

        <section className="min-w-0">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-primary" />
                <h2 className="font-semibold">Recommended matches</h2>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {hasFocusedQuery
                  ? "Results are narrowed by your current filters."
                  : "Start broad, then filter by category, budget, rating, and availability."}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="rounded-md">
                <ArrowUpDown className="size-3.5" />
                {params.sort ?? "recommended"}
              </Badge>
              <Badge variant="secondary" className="rounded-md">
                <Grid2X2 className="size-3.5" />
                Grid
              </Badge>
              <Badge variant="outline" className="rounded-md">
                <List className="size-3.5" />
                List preview
              </Badge>
            </div>
          </div>

          <ActiveFilterBar
            params={params}
            resultCount={filteredCreators.length}
            totalCount={publicCreators.length}
          />

          {filteredCreators.length > 0 ? (
            <div className="mt-6 space-y-5">
              {filteredCreators.slice(0, 2).map((creator) => {
                const creatorServices = getServicesByCreatorIdFromDb(creator.id);
                return (
                  <CreatorListCard
                    key={creator.id}
                    creator={creator}
                    primaryService={creatorServices[0]?.title}
                    serviceCount={creatorServices.length}
                    isSaved={savedCreatorIds.includes(creator.id)}
                    returnTo={returnTo}
                  />
                );
              })}

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredCreators.slice(2).map((creator) => {
                  const creatorServices = getServicesByCreatorIdFromDb(creator.id);
                  return (
                    <CreatorCard
                      key={creator.id}
                      creator={creator}
                      primaryService={creatorServices[0]?.title}
                      serviceCount={creatorServices.length}
                      isSaved={savedCreatorIds.includes(creator.id)}
                      returnTo={returnTo}
                    />
                  );
                })}
              </div>
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
      </div>
    </main>
  );
}
