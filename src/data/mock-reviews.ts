import type { Review } from "@/types/marketplace";

export const reviews: Review[] = [
  {
    id: "review-001",
    bookingId: "CB-1019",
    clientId: "user-client-1",
    creatorId: "creator-003",
    rating: 5,
    text: "Daniel gave us a clear path for the MVP architecture and called out risks we had missed.",
    createdAt: "2026-05-23",
  },
  {
    id: "review-002",
    bookingId: "CB-1018",
    clientId: "user-client-3",
    creatorId: "creator-001",
    rating: 5,
    text: "Aarav helped us cut the MVP scope down to something we could actually launch.",
    createdAt: "2026-05-21",
  },
  {
    id: "review-003",
    bookingId: "CB-1017",
    clientId: "user-client-4",
    creatorId: "creator-002",
    rating: 5,
    text: "Riya's audit was specific, useful, and easy for our developer to act on.",
    createdAt: "2026-05-20",
  },
];

