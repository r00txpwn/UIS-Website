-- Fix user_profiles RLS infinite recursion (run in Supabase SQL Editor)
-- Step 1: Drop EVERY policy on user_profiles (handles any naming)
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'user_profiles')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON user_profiles', r.policyname);
  END LOOP;
END $$;

-- Step 2: Create only the three safe policies (auth.uid() only, no recursion)
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
