/*
  # Create Base Tables for UIS CMS

  Creates all core tables required by the application.
  This migration should run before any other migrations.

  ## Tables Created
  - services - Service offerings with descriptions, images, slugs
  - service_images - Additional images for each service
  - accreditations - Certifications and badges with PDF certificates
  - policies - Company policy documents with PDFs
  - products - Product catalog with images and spec sheets
  - user_profiles - Admin user profiles
  - audit_logs - Activity tracking for CMS changes

  ## Security
  - RLS enabled on all tables
  - Public read access for content tables
  - Authenticated write access for all tables
*/

-- Create services table
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

-- Create service_images table
CREATE TABLE IF NOT EXISTS service_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid REFERENCES services(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  alt_text text,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create accreditations table
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

-- Create policies table
CREATE TABLE IF NOT EXISTS policies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  pdf_url text,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create products table
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

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  role text DEFAULT 'editor',
  created_at timestamptz DEFAULT now(),
  last_login timestamptz
);

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  table_name text,
  record_id text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE accreditations ENABLE ROW LEVEL SECURITY;
ALTER TABLE policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Services: public read, authenticated write
CREATE POLICY "Anyone can view published services"
  ON services FOR SELECT TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated users can insert services"
  ON services FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update services"
  ON services FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete services"
  ON services FOR DELETE TO authenticated
  USING (true);

-- Service images: public read, authenticated write
CREATE POLICY "Anyone can view service images"
  ON service_images FOR SELECT TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated users can insert service images"
  ON service_images FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update service images"
  ON service_images FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete service images"
  ON service_images FOR DELETE TO authenticated
  USING (true);

-- Accreditations: public read, authenticated write
CREATE POLICY "Anyone can view accreditations"
  ON accreditations FOR SELECT TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated users can insert accreditations"
  ON accreditations FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update accreditations"
  ON accreditations FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete accreditations"
  ON accreditations FOR DELETE TO authenticated
  USING (true);

-- Policies: public read, authenticated write
CREATE POLICY "Anyone can view policies"
  ON policies FOR SELECT TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated users can insert policies"
  ON policies FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update policies"
  ON policies FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete policies"
  ON policies FOR DELETE TO authenticated
  USING (true);

-- Products: public read, authenticated write
CREATE POLICY "Anyone can view products"
  ON products FOR SELECT TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated users can insert products"
  ON products FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update products"
  ON products FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete products"
  ON products FOR DELETE TO authenticated
  USING (true);

-- User profiles: authenticated read/write
CREATE POLICY "Authenticated users can view profiles"
  ON user_profiles FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert profiles"
  ON user_profiles FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update profiles"
  ON user_profiles FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

-- Audit logs: authenticated read/write
CREATE POLICY "Authenticated users can view audit logs"
  ON audit_logs FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert audit logs"
  ON audit_logs FOR INSERT TO authenticated
  WITH CHECK (true);

-- Create storage buckets (idempotent)
INSERT INTO storage.buckets (id, name, public) VALUES ('services', 'services', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('accreditations', 'accreditations', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('policies', 'policies', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('products', 'products', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true) ON CONFLICT (id) DO NOTHING;
