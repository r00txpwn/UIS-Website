/*
  # Fix user_profiles RLS infinite recursion

  Admin policies were querying user_profiles to check "is admin?", which re-triggers
  RLS on user_profiles -> infinite recursion. Fix by using a separate app_admin_users
  table for the "is admin?" check and keeping it in sync via triggers.
*/

-- 1. Table: one row per admin (no RLS that reads user_profiles)
CREATE TABLE IF NOT EXISTS app_admin_users (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE
);

-- 2. Drop the recursive policies so we can backfill and use the new check
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can delete any profile" ON user_profiles;

-- 3. Backfill app_admin_users from user_profiles (migration runs as owner, can read all rows)
INSERT INTO app_admin_users (user_id)
SELECT id FROM user_profiles WHERE role = 'admin'
ON CONFLICT (user_id) DO NOTHING;

-- 4. Trigger function: create user_profiles row AND add to app_admin_users when role is admin
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
  RETURN new;
END;
$$;

-- Trigger on auth.users (recreate so it uses updated function)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_auth_user();

-- 5. Trigger on user_profiles: sync app_admin_users when role changes
CREATE OR REPLACE FUNCTION public.sync_app_admin_users()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.role = 'admin' THEN
    INSERT INTO app_admin_users (user_id) VALUES (NEW.id) ON CONFLICT (user_id) DO NOTHING;
  ELSE
    DELETE FROM app_admin_users WHERE user_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_user_profiles_role_change ON user_profiles;
CREATE TRIGGER on_user_profiles_role_change
  AFTER UPDATE OF role ON user_profiles
  FOR EACH ROW
  WHEN (OLD.role IS DISTINCT FROM NEW.role)
  EXECUTE PROCEDURE public.sync_app_admin_users();

-- 6. New RLS policies: check app_admin_users only (no recursion)
CREATE POLICY "Admins can view all profiles"
  ON user_profiles FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM app_admin_users WHERE user_id = auth.uid()));

CREATE POLICY "Admins can update any profile"
  ON user_profiles FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM app_admin_users WHERE user_id = auth.uid()))
  WITH CHECK (true);

CREATE POLICY "Admins can delete any profile"
  ON user_profiles FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM app_admin_users WHERE user_id = auth.uid()));
