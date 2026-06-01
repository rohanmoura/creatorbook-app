export type UserRole = "client" | "creator" | "admin";

export type BookingStatus =
  | "Pending"
  | "Confirmed"
  | "Rescheduled"
  | "Completed"
  | "Cancelled"
  | "Rejected";

export type ProfileStatus = "pending" | "approved" | "rejected";

export type ReportStatus = "open" | "reviewing" | "resolved";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  createdAt: string;
};

export type CreatorProfile = {
  id: string;
  userId: string;
  slug: string;
  name: string;
  headline: string;
  bio: string;
  category: string;
  skills: string[];
  rating: number;
  reviewCount: number;
  location: string;
  language: string;
  responseTime: string;
  profileStatus: ProfileStatus;
  featured: boolean;
  availabilityLabel: string;
  priceFrom: number;
  avatar: string;
  coverTone: string;
  portfolio: string[];
  completedSessions: number;
  repeatClientRate: number;
  verified: boolean;
  nextAvailableSlots: string[];
  outcomes: string[];
};

export type Service = {
  id: string;
  creatorId: string;
  title: string;
  description: string;
  duration: number;
  price: number;
  deliverables: string[];
  category: string;
};

export type Booking = {
  id: string;
  clientId: string;
  creatorId: string;
  serviceId: string;
  availabilityId?: string | null;
  clientName: string;
  creatorName: string;
  serviceName: string;
  category: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  status: BookingStatus;
  notes: string;
  createdAt: string;
};

export type Review = {
  id: string;
  bookingId: string;
  clientId: string;
  creatorId: string;
  rating: number;
  text: string;
  createdAt: string;
};

export type Category = {
  id: string;
  name: string;
  description: string;
  creatorCount: number;
};

export type Report = {
  id: string;
  reportedBy: string;
  targetType: "profile" | "booking" | "review";
  targetId: string;
  reason: string;
  status: ReportStatus;
};

export type CreatorSort = "recommended" | "rating" | "price" | "newest";

export type CreatorFilters = {
  query?: string;
  category?: string;
  maxPrice?: number;
  minRating?: number;
  availability?: string;
  sort?: CreatorSort;
};
