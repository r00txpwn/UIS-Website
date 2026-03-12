/*
  # News and Events (blog) – news_posts table and storage

  - news_posts: title, slug, excerpt, content, image_url, published, published_at
  - RLS: public read, authenticated full CRUD
  - Storage bucket "news" (public) for post images
*/

-- Create news_posts table
CREATE TABLE IF NOT EXISTS news_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text,
  content text,
  image_url text,
  published boolean DEFAULT true,
  published_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE news_posts ENABLE ROW LEVEL SECURITY;

-- Public read, authenticated full CRUD
CREATE POLICY "Anyone can view news_posts"
  ON news_posts FOR SELECT TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated users can insert news_posts"
  ON news_posts FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update news_posts"
  ON news_posts FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete news_posts"
  ON news_posts FOR DELETE TO authenticated
  USING (true);

-- Storage bucket for news post images
INSERT INTO storage.buckets (id, name, public) VALUES ('news', 'news', true) ON CONFLICT (id) DO NOTHING;

-- Storage policies for news bucket
DROP POLICY IF EXISTS "Public read access for news" ON storage.objects;
CREATE POLICY "Public read access for news"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'news');

DROP POLICY IF EXISTS "Authenticated users can upload news" ON storage.objects;
CREATE POLICY "Authenticated users can upload news"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'news');

DROP POLICY IF EXISTS "Authenticated users can delete news" ON storage.objects;
CREATE POLICY "Authenticated users can delete news"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'news');
