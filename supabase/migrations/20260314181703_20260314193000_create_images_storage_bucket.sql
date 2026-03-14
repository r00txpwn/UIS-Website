/*
  # Create images storage bucket for suppliers and other media

  1. New Storage Bucket
    - `images` - Public bucket for storing supplier logos, product images, etc.
  
  2. Storage Policies
    - Public can view all images
    - Authenticated users can upload images
    - Admins and editors can delete images
  
  3. Security
    - Proper file size and type restrictions
    - Public read access for website display
    - Controlled write/delete access
*/

-- Create the images bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images',
  'images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can view images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Admins and editors can delete images" ON storage.objects;
DROP POLICY IF EXISTS "Admins and editors can update images" ON storage.objects;

-- Allow public to view images
CREATE POLICY "Public can view images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'images');

-- Allow admins and editors to delete images
CREATE POLICY "Admins and editors can delete images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'images' AND (
      EXISTS (SELECT 1 FROM app_admin_users WHERE user_id = auth.uid())
      OR EXISTS (SELECT 1 FROM app_editor_users WHERE user_id = auth.uid())
    )
  );

-- Allow admins and editors to update images
CREATE POLICY "Admins and editors can update images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'images' AND (
      EXISTS (SELECT 1 FROM app_admin_users WHERE user_id = auth.uid())
      OR EXISTS (SELECT 1 FROM app_editor_users WHERE user_id = auth.uid())
    )
  );