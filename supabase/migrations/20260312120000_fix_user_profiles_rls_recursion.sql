/*
  # Fix user_profiles RLS infinite recursion

  Replaces generic "authenticated" policies with auth.uid()-based policies
  so that policy evaluation never queries user_profiles (which would
  re-trigger RLS and cause infinite recursion).
*/

-- Drop existing user_profiles policies
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON user_profiles;
DROP POLICY IF EXISTS "Authenticated users can insert profiles" ON user_profiles;
DROP POLICY IF EXISTS "Authenticated users can update profiles" ON user_profiles;

-- Own-row only: use auth.uid() so no recursion
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
