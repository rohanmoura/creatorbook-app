import { Skeleton } from "@/components/ui/skeleton";

export function LoadingGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="rounded-xl border p-4">
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="mt-4 h-5 w-2/3" />
          <Skeleton className="mt-2 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-3/4" />
          <div className="mt-5 flex gap-2">
            <Skeleton className="h-8 flex-1" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}

