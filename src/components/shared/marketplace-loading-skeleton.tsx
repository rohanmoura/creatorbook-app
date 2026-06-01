import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function MarketplaceLoadingSkeleton() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="mt-3 h-4 w-full max-w-2xl" />
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="rounded-lg">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <Skeleton className="size-12 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-36" />
                  <Skeleton className="mt-2 h-4 w-48" />
                </div>
              </div>
              <Skeleton className="mt-5 h-16 w-full" />
              <div className="mt-5 flex gap-2">
                <Skeleton className="h-7 w-20" />
                <Skeleton className="h-7 w-24" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
