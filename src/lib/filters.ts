import type {
  CreatorFilters,
  CreatorProfile,
  CreatorSort,
} from "@/types/marketplace";

export function filterCreators(
  creators: CreatorProfile[],
  filters: CreatorFilters
) {
  const query = filters.query?.trim().toLowerCase();

  const filtered = creators.filter((creator) => {
    const matchesQuery = query
      ? [
          creator.name,
          creator.headline,
          creator.category,
          creator.bio,
          ...creator.skills,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query)
      : true;

    const matchesCategory =
      !filters.category || filters.category === "All"
        ? true
        : creator.category === filters.category;

    const matchesPrice = filters.maxPrice
      ? creator.priceFrom <= filters.maxPrice
      : true;

    const matchesRating = filters.minRating
      ? creator.rating >= filters.minRating
      : true;

    const matchesAvailability = filters.availability
      ? creator.availabilityLabel === filters.availability
      : true;

    return (
      matchesQuery &&
      matchesCategory &&
      matchesPrice &&
      matchesRating &&
      matchesAvailability
    );
  });

  return sortCreators(filtered, filters.sort ?? "recommended");
}

export function sortCreators(
  creators: CreatorProfile[],
  sort: CreatorSort
) {
  return [...creators].sort((first, second) => {
    if (sort === "rating") {
      return second.rating - first.rating;
    }

    if (sort === "price") {
      return first.priceFrom - second.priceFrom;
    }

    if (sort === "newest") {
      return second.id.localeCompare(first.id);
    }

    return Number(second.featured) - Number(first.featured);
  });
}

