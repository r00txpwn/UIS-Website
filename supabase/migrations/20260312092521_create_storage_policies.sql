/*
  # Storage Policies for CMS

  1. Policies Created
    - Public read access for all storage buckets (services, accreditations, policies, products)
    - Authenticated user upload access for all buckets
    - Authenticated user delete access for all buckets
  
  2. Security
    - All users can view uploaded files (public read)
    - Only authenticated users can upload files
    - Only authenticated users can delete files
*/

-- Public read access policies
DROP POLICY IF EXISTS "Public read access for services" ON storage.objects;
CREATE POLICY "Public read access for services"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'services');

DROP POLICY IF EXISTS "Public read access for accreditations" ON storage.objects;
CREATE POLICY "Public read access for accreditations"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'accreditations');

DROP POLICY IF EXISTS "Public read access for policies" ON storage.objects;
CREATE POLICY "Public read access for policies"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'policies');

DROP POLICY IF EXISTS "Public read access for products" ON storage.objects;
CREATE POLICY "Public read access for products"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'products');

-- Authenticated upload policies
DROP POLICY IF EXISTS "Authenticated users can upload services" ON storage.objects;
CREATE POLICY "Authenticated users can upload services"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'services');

DROP POLICY IF EXISTS "Authenticated users can upload accreditations" ON storage.objects;
CREATE POLICY "Authenticated users can upload accreditations"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'accreditations');

DROP POLICY IF EXISTS "Authenticated users can upload policies" ON storage.objects;
CREATE POLICY "Authenticated users can upload policies"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'policies');

DROP POLICY IF EXISTS "Authenticated users can upload products" ON storage.objects;
CREATE POLICY "Authenticated users can upload products"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'products');

-- Authenticated delete policies
DROP POLICY IF EXISTS "Authenticated users can delete services" ON storage.objects;
CREATE POLICY "Authenticated users can delete services"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'services');

DROP POLICY IF EXISTS "Authenticated users can delete accreditations" ON storage.objects;
CREATE POLICY "Authenticated users can delete accreditations"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'accreditations');

DROP POLICY IF EXISTS "Authenticated users can delete policies" ON storage.objects;
CREATE POLICY "Authenticated users can delete policies"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'policies');

DROP POLICY IF EXISTS "Authenticated users can delete products" ON storage.objects;
CREATE POLICY "Authenticated users can delete products"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'products');
