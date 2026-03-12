# Pre-deploy checklist – CMS Homepage & Contact enhancements

Follow these steps **before** you commit, migrate, and deploy.

---

## 1. Supabase database (migrations or run-once scripts)

Apply schema and RLS in your Supabase project **once**.

### Option A: Use Supabase migrations (recommended)

From the project root, with Supabase CLI linked to your project:

```bash
supabase db push
```

Or apply migrations in order via the Supabase Dashboard → SQL Editor if you don’t use CLI.

Relevant migrations for this release (in order):

- `20260312140000_news_posts.sql` – `featured_on_home` on `news_posts`
- `20260312180000_homepage_slides.sql` – `homepage_slides` table + `homepage` storage bucket
- `20260312181000_site_settings.sql` – `site_settings` table
- `20260312182000_footer_links.sql` – `footer_links` table
- `20260312183000_contact_messages.sql` – `contact_messages` table

### Option B: Run SQL scripts manually (e.g. new env without migrations)

If you prefer run-once scripts instead of migrations, run these in the **Supabase SQL Editor** in this order (only on a DB that doesn’t already have these objects):

1. `supabase/run_news_posts_once.sql` – adds `featured_on_home` to `news_posts`
2. `supabase/run_homepage_slides_once.sql` – `homepage_slides` + `homepage` bucket
3. `supabase/run_site_settings_once.sql` – `site_settings`
4. `supabase/run_footer_links_once.sql` – `footer_links`
5. `supabase/run_contact_messages_once.sql` – `contact_messages`

**Note:** If `news_posts` or other tables already exist from a previous run, you may need to run only the parts that add new columns/tables (e.g. just the `ALTER TABLE` for `featured_on_home`, or skip scripts that would recreate existing tables).

---

## 2. Environment variables (frontend)

Ensure your deployment has:

- `VITE_SUPABASE_URL` – Supabase project URL
- `VITE_SUPABASE_ANON_KEY` – Supabase anon/public key

Same as in `.env` / `.env.example`. No new frontend env vars were added for this feature set.

---

## 3. Email notifications (optional but recommended)

Contact form submissions are stored in `contact_messages` and the app calls the Edge Function to send an email to the admin. If you skip this, the form still works; admins just won’t get email alerts.

1. **Resend**
   - Sign up at [resend.com](https://resend.com).
   - Create an API key.
   - Optionally verify your domain (or use `onboarding@resend.dev` for testing).

2. **Supabase Edge Function secrets**  
   In Supabase Dashboard → Edge Functions → Secrets (or via CLI):

   - `RESEND_API_KEY` – your Resend API key
   - `NOTIFY_EMAIL` – admin inbox (e.g. `sales@uis.az`)
   - `FROM_EMAIL` (optional) – sender address (e.g. `noreply@yourdomain.com`); if unset, the function uses `noreply@resend.dev`

3. **Deploy the Edge Function**

   ```bash
   supabase functions deploy notify-contact-message
   ```

   If `RESEND_API_KEY` or `NOTIFY_EMAIL` is not set, the function still returns 200 so the contact form does not fail.

---

## 4. Build and sanity check

From the project root:

```bash
npm run build
```

Fix any TypeScript or build errors before deploying the frontend.

---

## 5. After deploy – quick verification

1. **Homepage**
   - Hero: CMS slides from `homepage_slides` (or static fallback if none).
   - “Latest News & Events”: up to 3 posts (featured first, then latest).

2. **Header / Footer**
   - Logo, footer about text, address, phone, emails come from `site_settings`.
   - Quick Links and Services in the footer come from `footer_links` (or fallbacks if empty).

3. **Contact form**
   - Submit a test message → row appears in `contact_messages`.
   - In admin, open **Contact Messages** and confirm the message is listed and can be marked read / replied via mailto.
   - If email is configured, confirm the admin inbox receives the notification.

4. **Admin**
   - **Homepage Slides**, **Site Settings**, **Footer Links**, **Contact Messages** are in the sidebar and load without errors.

---

## Summary order

| Step | Action |
|------|--------|
| 1 | Apply DB changes (migrations **or** run-once SQL scripts). |
| 2 | Confirm `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` for the frontend. |
| 3 | (Optional) Set Resend secrets and deploy `notify-contact-message`. |
| 4 | Run `npm run build`. |
| 5 | Deploy frontend (your host: Vercel, Netlify, etc.). |
| 6 | Run through the verification steps above. |

After this, you can commit, run migrations (or run-once scripts), and deploy with confidence.
