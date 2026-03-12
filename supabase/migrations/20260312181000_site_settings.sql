/*
  # Site settings – branding, footer, and contact info

  - site_settings: single-row table for global site configuration
  - RLS: public read, authenticated full CRUD
*/

CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name text,
  logo_url text,
  footer_about text,
  address text,
  phone text,
  sales_email text,
  inspection_email text,
  header_contact_label text,
  header_contact_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read site_settings" ON site_settings;
CREATE POLICY "Public can read site_settings"
  ON site_settings FOR SELECT TO authenticated, anon
  USING (true);

DROP POLICY IF EXISTS "Admins can manage site_settings" ON site_settings;
CREATE POLICY "Admins can manage site_settings"
  ON site_settings FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

