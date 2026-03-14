/*
  # Fix RLS infinite recursion for all tables

  1. Problem
    - Multiple tables have RLS policies that query user_profiles
    - This triggers RLS on user_profiles, causing infinite recursion
  
  2. Solution
    - Replace all user_profiles queries in RLS policies with app_admin_users/app_editor_users
  
  3. Tables fixed
    - audit_logs (admin only)
    - policies (admin and editor)
    - product_company_logos (admin and editor)
    - products (admin and editor)
    - service_images (admin and editor)
    - services (admin and editor)
*/

-- Fix audit_logs (admin only)
DROP POLICY IF EXISTS "Admins can view audit logs" ON audit_logs;
CREATE POLICY "Admins can view audit logs"
  ON audit_logs FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM app_admin_users WHERE user_id = auth.uid()));

-- Fix policies table (admin and editor)
DROP POLICY IF EXISTS "Admins and editors can manage policies" ON policies;
CREATE POLICY "Admins and editors can manage policies"
  ON policies FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM app_admin_users WHERE user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM app_editor_users WHERE user_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM app_admin_users WHERE user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM app_editor_users WHERE user_id = auth.uid())
  );

-- Fix product_company_logos (admin and editor)
DROP POLICY IF EXISTS "Admins and editors can manage product company logos" ON product_company_logos;
CREATE POLICY "Admins and editors can manage product company logos"
  ON product_company_logos FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM app_admin_users WHERE user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM app_editor_users WHERE user_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM app_admin_users WHERE user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM app_editor_users WHERE user_id = auth.uid())
  );

-- Fix products (admin and editor)
DROP POLICY IF EXISTS "Admins and editors can manage products" ON products;
CREATE POLICY "Admins and editors can manage products"
  ON products FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM app_admin_users WHERE user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM app_editor_users WHERE user_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM app_admin_users WHERE user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM app_editor_users WHERE user_id = auth.uid())
  );

-- Fix service_images (admin and editor)
DROP POLICY IF EXISTS "Admins and editors can manage service images" ON service_images;
CREATE POLICY "Admins and editors can manage service images"
  ON service_images FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM app_admin_users WHERE user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM app_editor_users WHERE user_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM app_admin_users WHERE user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM app_editor_users WHERE user_id = auth.uid())
  );

-- Fix services (admin and editor) - Replace 3 separate policies
DROP POLICY IF EXISTS "Admins and editors can insert services" ON services;
DROP POLICY IF EXISTS "Admins and editors can update services" ON services;
DROP POLICY IF EXISTS "Admins and editors can delete services" ON services;

CREATE POLICY "Admins and editors can insert services"
  ON services FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM app_admin_users WHERE user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM app_editor_users WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins and editors can update services"
  ON services FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM app_admin_users WHERE user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM app_editor_users WHERE user_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM app_admin_users WHERE user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM app_editor_users WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins and editors can delete services"
  ON services FOR DELETE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM app_admin_users WHERE user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM app_editor_users WHERE user_id = auth.uid())
  );