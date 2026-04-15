# Quick Start (Next.js)

## 1. Install and Run

```bash
cd next-store
npm install
npm run dev
```

Open `http://localhost:3000`.

## 2. Use Local-First Data (Default)

Create `next-store/.env.local`:

```bash
DATA_MODE=local
LOCAL_DB_DIR=.localdb
```

Orders are persisted in `next-store/.localdb/orders.json`.

## 3. Verify Mode

Open `http://localhost:3000/api/dev/mode`.

## 4. Later Switch to Online DB

1. Set `DATA_MODE=firebase`.
2. Add Firebase Admin credentials in env.
3. Complete Firebase repository methods in `next-store/lib/server/order-repository.ts`.

## 5. Admin Access Recovery

Admin auth uses Firebase Authentication. Use password reset from the admin login flow with your admin email.
