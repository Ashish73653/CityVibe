# CityVibe

CityVibe is a hyperlocal city discovery platform for recommendations, places, and community posts.

## Prerequisites

- Node.js 18+
- npm

## Local Setup

1. Install dependencies.

```bash
npm install
```

2. Create environment file.

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

macOS/Linux:

```bash
cp .env.example .env
```

3. Generate Prisma client.

```bash
npm run prisma:generate
```

4. Run migrations.

```bash
npm run prisma:migrate
```

5. Seed sample data (first-time setup only).

```bash
npm run prisma:seed
```

If you already seeded before and want a clean database, run:

```bash
npx prisma migrate reset --force
```

6. Start the app.

```bash
npm run dev
```

7. Open:

- http://localhost:3000

## Why Prisma Generate Is Required

If Prisma client is not generated, the app fails with:

`@prisma/client did not initialize yet. Please run "prisma generate"`

This project now runs `prisma generate` automatically on `npm install` via `postinstall`.

## Useful Commands

```bash
npm run dev            # Start development server
npm run build          # Production build
npm run start          # Start production server
npm run lint           # Lint code
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run prisma:studio
```

## Test Accounts (after seed)

- Admin: `admin@cityvibe.com` / `admin123`
- User: `rahul@example.com` / `user123`
- User: `priya@example.com` / `user123`
- User: `amit@example.com` / `user123`
