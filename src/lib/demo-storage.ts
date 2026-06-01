export const demoBookingStorageKey = "creatorbook:lastBookingRequest";

export type DemoBookingRequest = {
  requestId: string;
  creatorSlug: string;
  creatorName: string;
  serviceTitle: string;
  category: string;
  date: string;
  time: string;
  slot?: string;
  price: number;
  duration: number;
  notes?: string;
  submittedAt: string;
};
