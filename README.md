# CreatorBook

CreatorBook is a portfolio-ready marketplace MVP for expert discovery and session booking. It demonstrates a complete multi-role product flow for clients, creators, and marketplace admins.

## What It Proves

- Marketplace discovery with creator listings, search, filters, sorting, and empty states.
- Creator profile pages with service packages, availability, reviews, trust signals, and booking CTAs.
- Booking request flow with service selection, structured availability slots, notes, and success timeline.
- Client dashboard for upcoming bookings, status tracking, history, and saved creators.
- Creator dashboard for incoming requests, service packages, availability, profile quality, and earnings.
- Admin dashboard for creator approvals, reports, category management, booking oversight, and platform health.
- Auth.js role access, SQLite persistence, Stripe test checkout, and in-app notifications.
- Portfolio case study page at `/case-study`.

## Demo Walkthrough

1. Start at `/` and use the marketplace search.
2. Open `/explore` and filter by category, budget, rating, availability, or sort order.
3. Open `/creators/aarav-mehta` to review a complete creator profile.
4. Continue to `/book/aarav-mehta` and submit the mock booking request.
5. Review `/dashboard/client`, `/dashboard/creator`, and `/dashboard/admin` to see role-owned workflows.
6. Use the client dashboard `Pay` action with Stripe test card `4242 4242 4242 4242`.
7. Open `/case-study` for portfolio positioning and the KMAX-ready project story.

## Tech Stack

- Next.js 16 App Router
- TypeScript
- Tailwind CSS 4
- shadcn/Radix UI components
- lucide-react icons
- SQLite-backed booking persistence with `better-sqlite3`
- Auth.js / NextAuth Google OAuth
- Stripe test checkout
- Database-backed creators, services, bookings, reports, reviews, saved creators, payments, availability, and notifications

## Local Development

```bash
npm install
npm run db:seed
npm run dev
```

Open `http://localhost:3000`.

## Auth Setup

CreatorBook uses Auth.js / NextAuth with Google OAuth.

Create local env values from `.env.example`:

```bash
AUTH_SECRET="replace-with-a-random-secret"
AUTH_GOOGLE_ID="your-google-oauth-client-id"
AUTH_GOOGLE_SECRET="your-google-oauth-client-secret"
AUTH_URL="http://localhost:3000"
CREATORBOOK_ADMIN_EMAILS="admin@creatorbook.demo"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
STRIPE_WEBHOOK_SECRET="whsec_optional_for_webhook_testing"
```

In Google Cloud Console, create an OAuth client and add this redirect URI:

```text
http://localhost:3000/api/auth/callback/google
```

## Quality Checks

```bash
npm run lint
npm run build
```

## Backend Progress

- Booking requests, reviews, reports, users, saved creators, payments, availability slots, and notifications are written to SQLite.
- Client, creator, admin, and case-study pages read live data from server repositories.
- Google and credentials sign-in persist users into the local SQLite `users` table.
- Creator profiles and service packages can be created and managed from onboarding/dashboard flows.

## Production Roadmap

- Move SQLite to a hosted production database strategy such as Turso/LibSQL or Supabase/Postgres.
- Add Google Calendar sync for busy-time reads and confirmed session events.
- Add email notifications with Resend, SendGrid, or another transactional provider.
- Add booking message threads and stronger creator verification/dispute workflows.
- Capture final screenshots and deploy the portfolio demo.
