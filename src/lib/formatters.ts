import type { BookingStatus } from "@/types/marketplace";

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDuration(minutes: number) {
  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = minutes / 60;
  return Number.isInteger(hours) ? `${hours} hr` : `${minutes} min`;
}

export function getStatusTone(status: BookingStatus) {
  switch (status) {
    case "Confirmed":
    case "Completed":
      return "success";
    case "Pending":
    case "Rescheduled":
      return "warning";
    case "Cancelled":
    case "Rejected":
      return "danger";
    default:
      return "neutral";
  }
}

