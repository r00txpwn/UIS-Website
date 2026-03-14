-- =============================================================================
-- UIS Website – Full DB deploy (run once on a fresh Supabase project)
-- Run this in Supabase Dashboard → SQL Editor → New query
-- =============================================================================

/*
  # 1/5 – Create Base Tables for UIS CMS
*/
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  content text,
  image_url text,
  published boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS service_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid REFERENCES services(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  alt_text text,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS accreditations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  logo_url text,
  certificate_pdf_url text,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS policies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  pdf_url text,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category text,
  image_url text,
  spec_sheet_pdf_url text,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  role text DEFAULT 'editor',
  created_at timestamptz DEFAULT now(),
  last_login timestamptz
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  table_name text,
  record_id text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE accreditations ENABLE ROW LEVEL SECURITY;
ALTER TABLE policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published services" ON services FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Authenticated users can insert services" ON services FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update services" ON services FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete services" ON services FOR DELETE TO authenticated USING (true);

CREATE POLICY "Anyone can view service images" ON service_images FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Authenticated users can insert service images" ON service_images FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update service images" ON service_images FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete service images" ON service_images FOR DELETE TO authenticated USING (true);

CREATE POLICY "Anyone can view accreditations" ON accreditations FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Authenticated users can insert accreditations" ON accreditations FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update accreditations" ON accreditations FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete accreditations" ON accreditations FOR DELETE TO authenticated USING (true);

CREATE POLICY "Anyone can view policies" ON policies FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Authenticated users can insert policies" ON policies FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update policies" ON policies FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete policies" ON policies FOR DELETE TO authenticated USING (true);

CREATE POLICY "Anyone can view products" ON products FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Authenticated users can insert products" ON products FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update products" ON products FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete products" ON products FOR DELETE TO authenticated USING (true);

-- user_profiles: use auth.uid() to avoid RLS recursion (replaced in step 5)
CREATE POLICY "Authenticated users can view profiles" ON user_profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert profiles" ON user_profiles FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update profiles" ON user_profiles FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can view audit logs" ON audit_logs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert audit logs" ON audit_logs FOR INSERT TO authenticated WITH CHECK (true);

INSERT INTO storage.buckets (id, name, public) VALUES ('services', 'services', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('accreditations', 'accreditations', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('policies', 'policies', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('products', 'products', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true) ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- # 2/5 – Storage policies
-- =============================================================================
DROP POLICY IF EXISTS "Public read access for services" ON storage.objects;
CREATE POLICY "Public read access for services" ON storage.objects FOR SELECT TO public USING (bucket_id = 'services');
DROP POLICY IF EXISTS "Public read access for accreditations" ON storage.objects;
CREATE POLICY "Public read access for accreditations" ON storage.objects FOR SELECT TO public USING (bucket_id = 'accreditations');
DROP POLICY IF EXISTS "Public read access for policies" ON storage.objects;
CREATE POLICY "Public read access for policies" ON storage.objects FOR SELECT TO public USING (bucket_id = 'policies');
DROP POLICY IF EXISTS "Public read access for products" ON storage.objects;
CREATE POLICY "Public read access for products" ON storage.objects FOR SELECT TO public USING (bucket_id = 'products');

DROP POLICY IF EXISTS "Authenticated users can upload services" ON storage.objects;
CREATE POLICY "Authenticated users can upload services" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'services');
DROP POLICY IF EXISTS "Authenticated users can upload accreditations" ON storage.objects;
CREATE POLICY "Authenticated users can upload accreditations" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'accreditations');
DROP POLICY IF EXISTS "Authenticated users can upload policies" ON storage.objects;
CREATE POLICY "Authenticated users can upload policies" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'policies');
DROP POLICY IF EXISTS "Authenticated users can upload products" ON storage.objects;
CREATE POLICY "Authenticated users can upload products" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'products');

DROP POLICY IF EXISTS "Authenticated users can delete services" ON storage.objects;
CREATE POLICY "Authenticated users can delete services" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'services');
DROP POLICY IF EXISTS "Authenticated users can delete accreditations" ON storage.objects;
CREATE POLICY "Authenticated users can delete accreditations" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'accreditations');
DROP POLICY IF EXISTS "Authenticated users can delete policies" ON storage.objects;
CREATE POLICY "Authenticated users can delete policies" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'policies');
DROP POLICY IF EXISTS "Authenticated users can delete products" ON storage.objects;
CREATE POLICY "Authenticated users can delete products" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'products');

-- =============================================================================
-- # 3/5 – Seed content (run once; skip if you get duplicate key errors)
-- =============================================================================
INSERT INTO services (title, slug, description, content, image_url, published, display_order) VALUES
('Rope Access Solutions', 'rope-access-solutions', 'Professional rope access services for safe and efficient operations at height', 'UIS provides comprehensive rope access solutions for industrial applications. Our certified technicians deliver safe, efficient, and cost-effective access to challenging work locations, reducing the need for traditional scaffolding or mechanical lifts.', '/images/files_8280743-1764243500028-files_8280743-1764243185940-image.png', true, 1),
('Facilities Management', 'facilities-management', 'Complete facilities management solutions for industrial and commercial operations', 'Our facilities management services ensure optimal operation and maintenance of your infrastructure. We provide comprehensive solutions including preventive maintenance, emergency response, and facility optimization.', '/images/facilities-management.png', true, 2),
('Training & Consultancy Solutions', 'training-consultancy', 'Expert training and consultancy services for industrial operations', 'UIS offers specialized training programs and consultancy services designed to enhance safety, efficiency, and compliance in industrial operations. Our experienced team provides customized solutions tailored to your specific needs.', '/images/training-consultancy.png', true, 3),
('Maintenance & Repairs', 'maintenance-repairs', 'Comprehensive maintenance and repair services for industrial equipment', 'Our maintenance and repair services keep your equipment running at peak performance. We provide scheduled maintenance, emergency repairs, and equipment refurbishment to minimize downtime and extend asset life.', '/images/service-4.png', true, 4),
('Rig Move Services', 'rig-move-services', 'Specialized rig moving and relocation services', 'UIS provides expert rig move services for oil and gas operations. Our experienced team ensures safe, efficient, and compliant rig relocations with minimal disruption to your operations.', '/images/service-5.jpg', true, 5),
('Rental Solutions', 'rental-solutions', 'Equipment rental solutions for industrial projects', 'We offer a comprehensive range of industrial equipment for rent, from lifting gear to specialized tools. Our rental solutions provide flexibility and cost-effectiveness for short-term and long-term projects.', '/images/service-6.jpg', true, 6),
('Tank Calibration and Survey', 'tank-calibration-survey', 'Precision tank calibration and survey services', 'Our tank calibration and survey services ensure accuracy in inventory management and compliance with industry standards. We use advanced technology and certified methods for reliable measurements.', '/images/service-7.jpg', true, 7),
('Human Resources Management', 'human-resources-management', 'Professional HR management services for industrial operations', 'UIS provides comprehensive human resources management solutions including recruitment, training, compliance, and workforce optimization tailored to the industrial sector.', '/images/service-8.jpg', true, 8),
('Fleet Management', 'fleet-management', 'Comprehensive fleet management solutions for efficient operations', 'Our fleet management services provide end-to-end solutions for maintaining and optimizing your vehicle fleet. We ensure compliance, reduce costs, and maximize fleet utilization through advanced tracking and maintenance systems.', '/images/service-1.jpg', true, 9),
('NDT Inspection, Testing & Certification', 'ndt-inspection', 'Professional non-destructive testing and certification services', 'UIS offers comprehensive NDT inspection, testing, and certification services using the latest technology and certified inspectors. We ensure equipment integrity, safety compliance, and regulatory requirements are met across all industrial applications.', '/images/service-2.jpg', true, 10);

INSERT INTO accreditations (name, description, logo_url, display_order) VALUES
('ISO 14001:2015', 'Environmental Management System', '/images/cert-iso-140001.png', 1),
('DDLA - Azerbaijan State Marine Certification', 'State Marine Authority', '/images/deniz-liman-agentliyi-1.png', 2),
('ISO 9001:2015', 'Quality Management System', '/images/ISO-9001-2015-DQS-Stamp.jpg', 3),
('RMRS NDT', 'Non-Destructive Testing', '/images/RS-Logo-P307-ENG.jpg', 4),
('ISO 45001', 'Occupational Health & Safety', '/images/iso-45001-e-ohs-management-wfsduhygvzdd.jpg', 5),
('RMRS Lifting', 'Lifting Equipment Certification', '/images/RS-Logo-P307-ENG.jpg', 6),
('LEEA Certificate', 'Lifting Equipment Engineers', '/images/AMA_LEEA-Colour-Logo-Large copy.jpg', 7);

-- =============================================================================
-- # 4/5 – Clients and suppliers
-- =============================================================================
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'supplier_id') THEN
    ALTER TABLE products ADD COLUMN supplier_id uuid REFERENCES suppliers(id) ON DELETE SET NULL;
  END IF;
END $$;

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view clients" ON clients FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Authenticated users can insert clients" ON clients FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update clients" ON clients FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete clients" ON clients FOR DELETE TO authenticated USING (true);

CREATE POLICY "Anyone can view suppliers" ON suppliers FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Authenticated users can insert suppliers" ON suppliers FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update suppliers" ON suppliers FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete suppliers" ON suppliers FOR DELETE TO authenticated USING (true);

-- =============================================================================
-- # 5/5 – Fix user_profiles RLS recursion
-- =============================================================================
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON user_profiles;
DROP POLICY IF EXISTS "Authenticated users can insert profiles" ON user_profiles;
DROP POLICY IF EXISTS "Authenticated users can update profiles" ON user_profiles;

CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
