/*
  # Contact messages – form submissions

  - contact_messages: name, email, phone, subject, message, created_at, is_read
  - RLS: anon/authenticated INSERT (public form), authenticated SELECT/UPDATE/DELETE (admin)
*/

CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text NOT NULL,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  is_read boolean NOT NULL DEFAULT false
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (contact form submission)
DROP POLICY IF EXISTS "Allow insert contact_messages" ON contact_messages;
CREATE POLICY "Allow insert contact_messages"
  ON contact_messages FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Only authenticated (admins) can read/update/delete
DROP POLICY IF EXISTS "Authenticated can read contact_messages" ON contact_messages;
CREATE POLICY "Authenticated can read contact_messages"
  ON contact_messages FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated can update contact_messages" ON contact_messages;
CREATE POLICY "Authenticated can update contact_messages"
  ON contact_messages FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated can delete contact_messages" ON contact_messages;
CREATE POLICY "Authenticated can delete contact_messages"
  ON contact_messages FOR DELETE TO authenticated
  USING (true);