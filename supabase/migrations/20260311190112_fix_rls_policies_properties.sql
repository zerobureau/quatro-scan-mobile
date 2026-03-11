/*
  # Fix RLS Policies on properties

  Replaces overly permissive policies (USING true / WITH CHECK true targeting
  the public role) with restrictive policies scoped to proper roles.

  1. Changes
    - DROP "Service role can delete properties" (DELETE, public, always true)
    - DROP "Service role can insert properties" (INSERT, public, always true)
    - DROP "Anyone can read properties" (SELECT, public, always true)
    - DROP "Service role can update properties" (UPDATE, public, always true)
    - CREATE "Anon and authenticated can read properties" (SELECT, anon + authenticated)
    - CREATE "Service role can insert properties" (INSERT, service_role only)
    - CREATE "Service role can update properties" (UPDATE, service_role only)
    - CREATE "Service role can delete properties" (DELETE, service_role only)

  2. Security
    - Read access limited to anon and authenticated roles
    - All mutations (insert, update, delete) restricted to service_role only
    - Matches the server-side API architecture where mutations happen via API routes
*/

DROP POLICY IF EXISTS "Service role can delete properties" ON properties;
DROP POLICY IF EXISTS "Service role can insert properties" ON properties;
DROP POLICY IF EXISTS "Anyone can read properties" ON properties;
DROP POLICY IF EXISTS "Service role can update properties" ON properties;

CREATE POLICY "Anon and authenticated can read properties"
  ON properties
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Service role can insert properties"
  ON properties
  FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update properties"
  ON properties
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can delete properties"
  ON properties
  FOR DELETE
  TO service_role
  USING (true);
