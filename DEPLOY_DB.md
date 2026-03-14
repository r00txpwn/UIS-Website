# Deploy database to your Supabase project (e.g. from Vercel)

Use **one** of these methods. Run **once** on a **new/fresh** Supabase project.

---

## Option A: Run one script in Supabase SQL Editor (simplest, no CLI)

1. Open your Supabase project: [Supabase Dashboard](https://supabase.com/dashboard) → select the project (e.g. the one connected from Vercel).
2. Go to **SQL Editor** → **New query**.
3. Open **`supabase/deploy_full.sql`** from this repo, copy its **entire** contents, paste into the editor, and click **Run**.
4. Wait for it to finish. You should see "Success. No rows returned" (or similar).  
   If the seed section reports duplicate key errors because you already ran it once, that’s fine; the schema and RLS are already applied.

**Note:** If you run the script a second time, the seed-data inserts may fail (duplicate key). That’s expected; tables and RLS are already there. For a fresh project, running once is enough.

---

## Option B: Supabase CLI (good for future migrations)

1. Install Supabase CLI (if needed):
   ```bash
   npm install -g supabase
   ```

2. Log in and link the project:
   ```bash
   supabase login
   cd c:\uis-website\UIS-Website
   supabase link --project-ref YOUR_PROJECT_REF
   ```
   Get **Project ref**: Supabase Dashboard → Project Settings → General → Reference ID.  
   When prompted, enter your **database password** (Project Settings → Database).

3. Push migrations:
   ```bash
   supabase db push
   ```
   This runs all files in `supabase/migrations/` in order.

---

## After deploy

- In Supabase **Authentication → Users**, create an admin user (Sign up or Invite) so you can log in to the CMS at `/login`.
- Ensure Vercel has the env vars from this Supabase project: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (from Project Settings → API).
