# notify-contact-message

Sends an email to the admin when a new contact form message is submitted.

## Setup

1. **Resend**: Create an API key at [resend.com](https://resend.com) and verify your domain (or use `onboarding@resend.dev` for testing).

2. **Supabase secrets** (Dashboard → Edge Functions → Secrets, or CLI):
   - `RESEND_API_KEY` – your Resend API key
   - `NOTIFY_EMAIL` – admin inbox (e.g. `sales@uis.az`)
   - `FROM_EMAIL` (optional) – sender address (e.g. `noreply@yourdomain.com`); defaults to `noreply@resend.dev` if unset

3. **Deploy**: `supabase functions deploy notify-contact-message`

If `RESEND_API_KEY` or `NOTIFY_EMAIL` is not set, the function returns 200 without sending (so the contact form still succeeds).

## Invocation

The function is invoked from the Contact page after a successful insert into `contact_messages`. You can also trigger it via a Database Webhook on `contact_messages` INSERT if you prefer server-only notification.
