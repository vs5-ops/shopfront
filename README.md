# Next.js Modern Store (Advanced Track)

This folder is the modernization base for your Flipkart-style architecture.

## What You Get

- Clean URL routes (`/`, `/cart`, `/checkout`) with extensionless routing.
- Server-side APIs for pricing and orders:
  - `POST /api/pricing`
  - `POST /api/orders`
  - `POST /api/payments/razorpay/verify`
- Payment signature verification logic on the server.
- Security middleware with baseline headers and CSP.
- Local-first pluggable data mode (`DATA_MODE=local`) with server-side order persistence.

## Why This Is Better Than Multi-Page Static Setup

- Sensitive logic (price calculation, payment verification) can run on server APIs.
- Better SEO and performance options (SSR/ISR) as you expand catalog pages.
- Scales to enterprise patterns: inventory reservation, order orchestration, audit logs.

## Run Locally

```bash
cd next-store
npm install
npm run dev
```

Open `http://localhost:3000`.

## Local-First Development (Recommended)

This project is set up so you can build fully on your local system first, then switch to online DB later.

1. Set in `.env.local`:

```bash
DATA_MODE=local
LOCAL_DB_DIR=.localdb
AUTH_SECRET=replace-with-random-string
ADMIN_BOOTSTRAP_PASSWORD=Admin@12345
```

2. Place orders in the app. Orders are saved server-side in:

`.localdb/orders.json`

3. Check active mode anytime:

`GET /api/dev/mode`

## Login and User Management

- Header now uses API-based login/register/logout with secure cookie sessions.
- Admin page user management is backed by `GET/PATCH /api/admin/users`.
- Primary admin account is `info@azcoglobal.com`.
- On first local boot, primary admin is auto-created with `ADMIN_BOOTSTRAP_PASSWORD`.
- Change `ADMIN_BOOTSTRAP_PASSWORD` in `.env.local` before sharing your local environment.

## Switching to Online Database Later

1. Set `DATA_MODE=firebase`.
2. Add Firebase Admin credentials in env.
3. Implement Firebase repository methods in `lib/server/order-repository.ts`.

Because all APIs call the repository abstraction, app pages do not need major rewrites when you switch.

## Migration Plan From Existing Site

1. Move product list and detail pages into `app/` routes.
2. Replace direct Firestore writes from browser with API routes.
3. Keep `DATA_MODE=local` during development, then add Firebase Admin integration for production.
4. Add webhook-driven payment confirmation and order state machine.
5. Cut over traffic from static hosting to Next deployment.

## Environment

Copy `.env.example` to `.env.local` and fill secrets.
