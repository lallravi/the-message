# The Message

A Next.js (App Router) website for "The Message" church, with a gated
podcast page and an admin dashboard.

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS
- Auth.js (NextAuth v5) — Google OAuth + email/password (Credentials, bcrypt)
- Prisma + Postgres
- Resend for verification emails (falls back to logging the link to the
  console if `RESEND_API_KEY` is not set — handy for local dev)
- Vercel Blob storage for podcast audio, uploaded directly from the
  browser (via `@vercel/blob/client`) so large sermon recordings don't
  hit serverless request-size limits — requires `BLOB_READ_WRITE_TOKEN`
  even in local dev (see `src/app/api/episodes/upload-token/route.ts`)

## Getting started (local dev)

1. Get a free Postgres database from [neon.tech](https://neon.tech) (no
   credit card needed) — create a project and copy its connection string.
2. Fill in `.env`:
   ```bash
   DATABASE_URL="<your Neon connection string>"
   ADMIN_EMAIL="you@example.com"
   ```
   (`AUTH_SECRET` is already generated for you.)
3. Install and migrate:
   ```bash
   npm install
   npm run db:migrate
   npm run dev
   ```
4. Visit http://localhost:3000.

### Becoming the admin

The **first account** that signs up (via Google or email/password) with
the address in `ADMIN_EMAIL` is automatically promoted to `role: ADMIN`.
If you set `ADMIN_EMAIL` after already signing up, run `npm run db:seed`
to promote the existing user with that email.

### Email verification in local dev

With no `RESEND_API_KEY` set, verification links are printed to the
terminal running `npm run dev` instead of being emailed — copy the link
from the console into your browser to verify an account.

### Browsing the database

```bash
npm run db:studio
```

Opens Prisma Studio at http://localhost:5555 so you can inspect/edit
`User`, `Episode`, `LoginEvent`, etc. directly.

## Deploying to production (Vercel)

1. **Push the code to GitHub** (Vercel deploys from a git repo).
2. **Database**: use the same Neon (or other Postgres) connection string
   from local dev, or create a separate production database.
3. **File storage**: create a Vercel Blob store at
   [vercel.com/dashboard/stores](https://vercel.com/dashboard/stores) and
   copy its `BLOB_READ_WRITE_TOKEN` — required in production, since
   serverless hosts have no persistent local disk.
4. **Import the repo into Vercel** ([vercel.com/new](https://vercel.com/new)).
5. **Set environment variables** in the Vercel project settings — same
   keys as `.env.example`:
   - `DATABASE_URL`
   - `AUTH_SECRET`
   - `NEXTAUTH_URL` → your production URL, e.g. `https://themessage.church`
   - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` (optional, see below)
   - `RESEND_API_KEY` / `EMAIL_FROM` (required for real verification emails)
   - `ADMIN_EMAIL`
   - `BLOB_READ_WRITE_TOKEN`
6. **Google OAuth redirect URI**: in the
   [Google Cloud Console](https://console.cloud.google.com/apis/credentials),
   add `https://<your-domain>/api/auth/callback/google` as an authorized
   redirect URI (alongside the localhost one).
7. **Apply the database schema** to production before or right after the
   first deploy:
   ```bash
   DATABASE_URL="<production connection string>" npx prisma migrate deploy
   ```
8. **Deploy.** Vercel builds and hosts it; visit the assigned URL (or your
   custom domain once attached in Vercel's Domains settings).

## Environment variables

See `.env.example` for the full list and inline notes.

## Pages

- `/` — homepage with hero + scripture quotes
- `/sign-in`, `/sign-up` — auth pages (Google + email/password)
- `/the-message` — gated podcast list + player; admins also see an upload form
- `/admin/users` — admin-only users table + full login history
