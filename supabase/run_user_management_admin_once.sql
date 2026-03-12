-- Run once in Supabase Dashboard → SQL Editor
-- Enables: list of admin users, edit role/full_name, remove from list. New signups get a profile automatically.
-- Fixes: infinite recursion in user_profiles RLS by using app_admin_users for "is admin?" check.

-- 1. Table: one row per admin (avoids RLS recursion)
CREATE TABLE IF NOT EXISTS app_admin_users (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE
);

-- 2. Trigger: create user_profiles row when a new auth user is created, and add to app_admin_users if admin
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

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_auth_user();

-- 3. Backfill existing auth users into user_profiles
INSERT INTO public.user_profiles (id, email, role)
SELECT u.id, u.email, COALESCE(u.raw_user_meta_data->>'role', 'editor')
FROM auth.users u
WHERE NOT EXISTS (SELECT 1 FROM public.user_profiles p WHERE p.id = u.id);

-- 4. Drop recursive admin policies (they cause "infinite recursion" error)
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can delete any profile" ON user_profiles;

-- 5. Backfill app_admin_users from current user_profiles where role = 'admin'
INSERT INTO app_admin_users (user_id)
SELECT id FROM user_profiles WHERE role = 'admin'
ON CONFLICT (user_id) DO NOTHING;

-- 6. Trigger on user_profiles: keep app_admin_users in sync when role changes
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

-- 7. New RLS policies: check app_admin_users only (no recursion)
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
