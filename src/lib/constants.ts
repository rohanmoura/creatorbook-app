import type { BookingStatus } from "@/types/marketplace";

export const marketplaceCategories = [
  "Startup Strategy",
  "UI/UX Design",
  "Web Development",
  "AI Automation",
  "Marketing",
  "Branding",
  "Content Strategy",
  "No-Code Automation",
  "Career Coaching",
  "Business Consulting",
] as const;

export const bookingStatuses: BookingStatus[] = [
  "Pending",
  "Confirmed",
  "Rescheduled",
  "Completed",
  "Cancelled",
  "Rejected",
];

export const creatorAvailabilityLabels = [
  "Today",
  "Tomorrow",
  "This week",
  "Friday",
  "Next 3 days",
];

export const demoRoleLinks = [
  { label: "Client", href: "/dashboard/client" },
  { label: "Creator", href: "/dashboard/creator" },
  { label: "Admin", href: "/dashboard/admin" },
];

