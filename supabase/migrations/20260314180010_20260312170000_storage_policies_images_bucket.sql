/*
  # Storage policies for images bucket (clients/suppliers logos)

  The images bucket exists but had no INSERT/SELECT/DELETE policies, so uploads failed.
  Add public read and authenticated upload/delete for bucket_id = 'images'.
*/

DROP POLICY IF EXISTS "Public read access for images" ON storage.objects;
CREATE POLICY "Public read access for images"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'images');

DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
CREATE POLICY "Authenticated users can upload images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'images');

DROP POLICY IF EXISTS "Authenticated users can delete images" ON storage.objects;
CREATE POLICY "Authenticated users can delete images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'images');