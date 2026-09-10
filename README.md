# Jentea House

A modern Vietnamese kitchen and tea ordering MVP for Jentea House, Oshawa.

## Run locally

Requirements: Node.js 18+

```bash
npm run install:all
npm run dev
```

Open http://localhost:5173. The API runs at http://localhost:4000.

## Environment

Copy `.env.example` to `server/.env` and provide a rotated, least-privilege MongoDB URI. The app works with a fallback menu and in-memory order response when `MONGODB_URI` is not configured.

Seed the MongoDB product collection after Atlas access is configured:

```bash
npm.cmd run seed --prefix server
```

Never commit passwords, connection strings, JWT secrets, or API keys. The supplied MongoDB credential must be revoked/rotated before development.

## Current flow

- Responsive restaurant homepage with menu search and category filters
- Database-backed product catalog and `/product/:code` detail pages
- Add-to-cart drawer with quantity controls
- Pickup or delivery checkout with cash-on-fulfillment order submission
- Express API for products, health checks, and orders
- MongoDB connection hook ready for Mongoose models
- External links to Google Maps and Uber Eats

This is the first functional slice. Authentication, admin tools, real payment processing, image uploads, and persistent Mongoose models should be added before production launch.
