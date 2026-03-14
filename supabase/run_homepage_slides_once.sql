-- Run this once in Supabase Dashboard → SQL Editor → New query
-- Creates homepage_slides table and "homepage" storage bucket for hero carousel

-- Table
CREATE TABLE IF NOT EXISTS homepage_slides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text,
  image_url text NOT NULL,
  button_label text,
  button_url text,
  display_order int NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE homepage_slides ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view homepage_slides" ON homepage_slides;
CREATE POLICY "Public can view homepage_slides"
  ON homepage_slides FOR SELECT TO authenticated, anon
  USING (published = true);

DROP POLICY IF EXISTS "Authenticated can insert homepage_slides" ON homepage_slides;
CREATE POLICY "Authenticated can insert homepage_slides"
  ON homepage_slides FOR INSERT TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated can update homepage_slides" ON homepage_slides;
CREATE POLICY "Authenticated can update homepage_slides"
  ON homepage_slides FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated can delete homepage_slides" ON homepage_slides;
CREATE POLICY "Authenticated can delete homepage_slides"
  ON homepage_slides FOR DELETE TO authenticated
  USING (true);

-- Bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('homepage', 'homepage', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public read access for homepage" ON storage.objects;
CREATE POLICY "Public read access for homepage"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'homepage');

DROP POLICY IF EXISTS "Authenticated users can upload homepage" ON storage.objects;
CREATE POLICY "Authenticated users can upload homepage"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'homepage');

DROP POLICY IF EXISTS "Authenticated users can delete homepage" ON storage.objects;
CREATE POLICY "Authenticated users can delete homepage"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'homepage');

