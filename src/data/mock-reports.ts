import type { Report } from "@/types/marketplace";

export const reports: Report[] = [
  {
    id: "report-001",
    reportedBy: "Neha Sharma",
    targetType: "profile",
    targetId: "creator-006",
    reason: "Profile needs clearer service details before approval.",
    status: "reviewing",
  },
  {
    id: "report-002",
    reportedBy: "Aman Verma",
    targetType: "review",
    targetId: "review-003",
    reason: "Review context is unclear.",
    status: "open",
  },
  {
    id: "report-003",
    reportedBy: "Rohan Shah",
    targetType: "booking",
    targetId: "CB-1029",
    reason: "Client expected implementation work from a strategy-only package.",
    status: "resolved",
  },
];
