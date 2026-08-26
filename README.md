# Beer & Books

A private, lightweight hub for the ISB PGP PRO 2027 cohort (55 people): **search → discover → connect**.

A public landing page sits in front (`/`); everything else lives behind sign-in.

If someone in the cohort knows it, has done it, or can help with it, the rest of the cohort
should be able to find them.

## What's in the MVP

| Section | Route | What it does |
| --- | --- | --- |
| Landing page | `/` | Public marketing page — animated hero, live search demo, cohort stats, CTA into the platform |
| Home / dashboard | `/home` | Welcome, global search, quick actions, upcoming deadlines, latest resources / opportunities / requests |
| People directory | `/people`, `/people/[id]` | 55 profiles, filterable by industry, function, skill, interest, location and what they're looking for. "Connect" reveals the person's preferred contact method |
| Resource library | `/resources` | Categorised, searchable, taggable links; any member can add |
| Opportunity board | `/opportunities` | Jobs, internships, referrals, projects, competitions with deadlines |
| Ask the Cohort | `/ask` | Help requests with Open / Resolved status |
| Unified search | `/search?q=...` | One query returns matching people, resources, opportunities and requests together |
| Admin | `/admin` | Add / remove members, toggle admin role, close or delete posts |
| My profile | `/profile` | Edit basics, experience rows, skills, interests, looking-for |

Two roles only: **admin** and **student**.

## Running it

```bash
npm install
npm run dev        # http://localhost:3000
```

With no environment variables set, the app boots in **demo mode**: the 55-person cohort roster and 78 curated resources live in memory, login is skipped, and a banner at the top
lets you switch which seed member you're viewing as (Aadya Singh Rathore is the seeded admin). Writes persist
until the server restarts. This is the fastest way to test the UX.

## Going live with Supabase

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the SQL editor (tables, helper functions, RLS policies,
   a `cohort-files` storage bucket).
3. Run `supabase/seed.sql` for the demo dataset — or skip it and add real members from `/admin`.
   Regenerate it from the TypeScript seed with `npm run seed:sql`.
4. Copy `.env.example` to `.env.local` and fill in:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   ```

5. In Supabase → Authentication → URL configuration, add `http://localhost:3000/auth/callback`
   (and your production URL) as a redirect URL.

Restart the dev server. The app now uses real data and real auth.

### How access control works

* The landing page at `/` is public; every other route requires a session.
* Sign-in is passwordless — Supabase emails a one-time link (`/login` → `/auth/callback`).
* Being able to sign in is **not** the same as being in the cohort. A signed-in user only gets
  into the app if their email appears in the `users` table; otherwise they land on `/pending`.
* Admins add cohort members from `/admin`, which is how someone gets on that list.
* RLS enforces the same rule in the database: `is_cohort_member()` gates every read, authors can
  edit their own posts, admins can edit anything.
* Optionally tighten the front door further in Supabase → Authentication by restricting sign-ups
  to your institution's email domain.

## Tech

Next.js 15 (App Router, Server Components, Server Actions) · TypeScript · Tailwind CSS ·
Supabase (Postgres, Auth, Storage, RLS).

```
src/
  app/
    (marketing)/  the public Beer & Books landing page
    (auth)/       login + pending-approval screens
    (app)/        the signed-in product (home, people, resources, ...)
    actions.ts    every server action
  components/     cards, filters, forms, nav, landing/ (animated pieces)
  lib/
    data/         one repository API; Supabase when configured, in-memory seed when not
    taxonomy.ts   the industry / function / skill / interest vocabularies used everywhere
supabase/         schema.sql, seed.sql
scripts/          gen-seed-sql.mjs — regenerates seed.sql from the TS seed
```

Every page reads through `src/lib/data/index.ts`, so the demo and live modes behave identically.
Filtering happens in `src/lib/data/filters.ts` — in-memory, which is the right call at cohort
scale and keeps demo and Supabase results consistent.

## Access control

Two layers, depending on whether Supabase is connected.

**Before Supabase (where the site is now)** — an access gate: your ISB email must be on the
cohort roster *and* you need the shared access code. A signed, HTTP-only cookie holds the
session; every route including the landing page redirects to `/login` without it.

`ACCESS_MODE` decides who gets through:

| Value | Who can sign in | Landing page |
| --- | --- | --- |
| `admin` (default) | only emails in `ADMIN_EMAILS` | private |
| `cohort` | anyone on the roster with the code | public |

The mode is re-checked on every request, so tightening it locks out sessions that were issued
while the site was open. Set `COHORT_ACCESS_CODE` and `AUTH_SECRET` in your host's environment
variables — without them the app falls back to a development-only code and secret.

**After Supabase** — the gate is bypassed entirely: sign-in becomes a one-time link emailed to
the ISB address, and RLS enforces the same roster rule inside the database.

## Deploying to Netlify

`netlify.toml` and `@netlify/plugin-nextjs` are already configured — the plugin runs the App
Router, server actions and middleware on Netlify Functions.

```bash
npx netlify link          # or: npx netlify sites:create --name <name>
npx netlify deploy --prod # builds and publishes
```

Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Netlify →
Site configuration → Environment variables, and add `https://<site>.netlify.app/auth/callback`
to the Supabase redirect URLs.

**Important:** without those variables the deployed site runs in demo mode, and demo mode keeps
data in the memory of a serverless function. Everyone sees the seed data, but anything a visitor
adds disappears on the next cold start. Connect Supabase before sharing the link with the cohort.

## Deliberately not built (phase 2)

AI assistant and matching, alumni database, LinkedIn scraping, WhatsApp integration, email
notifications, recommendation engine, events management, internal messaging, gamification,
analytics, opportunity aggregation.

Two notes on the brief:

* **Events** — the dashboard shows *upcoming deadlines* drawn from opportunities (including ones
  of type `Event`) rather than a separate events system, since events management is phase 2.
* **Approving opportunity posts** — posts go live immediately; admins can close or delete them
  from `/admin`. A pre-moderation queue would slow the loop down at this size.

## The cohort roster

`src/lib/data/seed.ts` holds `COHORT_ROSTER` — the 55 names and ISB addresses. That list is the
allowlist: an email must appear there (or be added from `/admin`) before a magic link gets
someone past `/pending`. `ADMIN_EMAILS` in the same file controls who gets the admin role.

Twenty members' profiles are pre-filled from their own introductions — role, employer, years,
background group and interests. Everyone else starts blank on purpose: no background is
inferred for anyone, they fill their own profile in at `/profile`.

The opportunity board and Ask the Cohort start empty. Seeding them with invented postings on a
platform real people are about to use would have meant fake referrals with fake deadlines.

## Importing the real cohort

Add members one at a time from `/admin`, or bulk-insert into `public.users` (name, email,
`current_role`, location, role) and let each student fill in the rest from `/profile` — the
directory only gets valuable once people list what they can help with.
