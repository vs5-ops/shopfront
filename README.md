# Shopfront Workspace (Cleaned)

This workspace is cleaned and switched to the Next.js application.

## Active Application

- Path: `next-store/`
- Framework: Next.js (App Router)
- Clean routes: `/`, `/products`, `/cart`, `/checkout`, `/orders`, `/admin`

## Local Development

```bash
cd next-store
npm install
npm run dev
```

Open `http://localhost:3000`.

## Data Mode

- Local-first mode is supported (`DATA_MODE=local`).
- See `next-store/README.md` for mode switching and Firebase migration details.

## Workspace Notes

- Legacy root HTML/PHP storefront files were removed.
- Root-level Firebase rules and deployment docs are retained for infrastructure workflows.
