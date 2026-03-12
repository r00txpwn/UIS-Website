/*
  # Footer links – CMS-driven Quick Links and Services

  - footer_links: section ('quick' | 'services'), label, path, display_order, published
  - RLS: public SELECT where published = true, authenticated full CRUD
*/

CREATE TABLE IF NOT EXISTS footer_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section text NOT NULL,
  label text NOT NULL,
  path text NOT NULL,
  display_order int NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true
);

ALTER TABLE footer_links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read published footer_links" ON footer_links;
CREATE POLICY "Public can read published footer_links"
  ON footer_links FOR SELECT TO authenticated, anon
  USING (published = true);

DROP POLICY IF EXISTS "Authenticated can insert footer_links" ON footer_links;
CREATE POLICY "Authenticated can insert footer_links"
  ON footer_links FOR INSERT TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated can update footer_links" ON footer_links;
CREATE POLICY "Authenticated can update footer_links"
  ON footer_links FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated can delete footer_links" ON footer_links;
CREATE POLICY "Authenticated can delete footer_links"
  ON footer_links FOR DELETE TO authenticated
  USING (true);
