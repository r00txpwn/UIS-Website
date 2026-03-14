/*
  # User Management: admin list/edit/delete + auto-create profile on signup

  - Trigger: on auth.users INSERT, create row in user_profiles (id, email, role from metadata)
  - Backfill: insert user_profiles for existing auth.users that have no profile
  - RLS: admins (user_profiles.role = 'admin') can SELECT, UPDATE, DELETE any user_profiles row
*/

-- Trigger function: create user_profiles row when a new auth user is created
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'role', 'editor')
  );
  RETURN new;
END;
$$;

-- Trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_auth_user();

-- Backfill: ensure existing auth users have a user_profiles row (run once)
INSERT INTO public.user_profiles (id, email, role)
SELECT u.id, u.email, COALESCE(u.raw_user_meta_data->>'role', 'editor')
FROM auth.users u
WHERE NOT EXISTS (SELECT 1 FROM public.user_profiles p WHERE p.id = u.id);

-- RLS: allow admins to view all user_profiles (no recursion: only reads own row to check admin)
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
CREATE POLICY "Admins can view all profiles"
  ON user_profiles FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM user_profiles up WHERE up.id = auth.uid() AND up.role = 'admin')
  );

-- RLS: allow admins to update any user_profile (e.g. role, full_name)
DROP POLICY IF EXISTS "Admins can update any profile" ON user_profiles;
CREATE POLICY "Admins can update any profile"
  ON user_profiles FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM user_profiles up WHERE up.id = auth.uid() AND up.role = 'admin')
  )
  WITH CHECK (true);

-- RLS: allow admins to delete any user_profile (removes from CMS list; auth user remains in auth.users)
DROP POLICY IF EXISTS "Admins can delete any profile" ON user_profiles;
CREATE POLICY "Admins can delete any profile"
  ON user_profiles FOR DELETE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM user_profiles up WHERE up.id = auth.uid() AND up.role = 'admin')
  );