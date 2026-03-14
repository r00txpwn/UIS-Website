/*
  # Fix accreditations RLS infinite recursion

  1. Problem
    - The "Admins and editors can manage accreditations" policy queries user_profiles
    - This triggers RLS on user_profiles, causing infinite recursion
  
  2. Solution
    - Use app_admin_users table for admin check (no RLS recursion)
    - Create app_editor_users table for editor check
    - Update policy to check these tables instead of user_profiles
  
  3. Changes
    - Create app_editor_users table
    - Backfill app_editor_users from user_profiles
    - Update sync trigger to include editors
    - Replace accreditations RLS policy with non-recursive version
*/

-- 1. Create table for editors (similar to app_admin_users)
CREATE TABLE IF NOT EXISTS app_editor_users (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE
);

-- 2. Backfill app_editor_users from user_profiles
INSERT INTO app_editor_users (user_id)
SELECT id FROM user_profiles WHERE role = 'editor'
ON CONFLICT (user_id) DO NOTHING;

-- 3. Update sync trigger to include editors
CREATE OR REPLACE FUNCTION public.sync_app_admin_users()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Handle admin
  IF NEW.role = 'admin' THEN
    INSERT INTO app_admin_users (user_id) VALUES (NEW.id) ON CONFLICT (user_id) DO NOTHING;
  ELSE
    DELETE FROM app_admin_users WHERE user_id = NEW.id;
  END IF;
  
  -- Handle editor
  IF NEW.role = 'editor' THEN
    INSERT INTO app_editor_users (user_id) VALUES (NEW.id) ON CONFLICT (user_id) DO NOTHING;
  ELSE
    DELETE FROM app_editor_users WHERE user_id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- 4. Update handle_new_auth_user to include editors
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role text;
BEGIN
  user_role := COALESCE(new.raw_user_meta_data->>'role', 'editor');
  INSERT INTO public.user_profiles (id, email, role)
  VALUES (new.id, new.email, user_role);
  
  IF user_role = 'admin' THEN
    INSERT INTO app_admin_users (user_id) VALUES (new.id) ON CONFLICT (user_id) DO NOTHING;
  END IF;
  
  IF user_role = 'editor' THEN
    INSERT INTO app_editor_users (user_id) VALUES (new.id) ON CONFLICT (user_id) DO NOTHING;
  END IF;
  
  RETURN new;
END;
$$;

-- 5. Fix accreditations RLS policy: use app_admin_users and app_editor_users instead of user_profiles
DROP POLICY IF EXISTS "Admins and editors can manage accreditations" ON accreditations;
CREATE POLICY "Admins and editors can manage accreditations"
  ON accreditations FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM app_admin_users WHERE user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM app_editor_users WHERE user_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM app_admin_users WHERE user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM app_editor_users WHERE user_id = auth.uid())
  );