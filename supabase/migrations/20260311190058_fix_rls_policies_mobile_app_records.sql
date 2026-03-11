/*
  # Fix RLS Policies on mobile_app_records

  Replaces overly permissive policies (USING true / WITH CHECK true targeting
  the public role) with restrictive policies scoped to the service_role.

  1. Changes
    - DROP "Anyone can insert mobile app records" (INSERT, public, always true)
    - DROP "Anyone can read mobile app records" (SELECT, public, always true)
    - DROP "Anyone can update mobile app records" (UPDATE, public, always true)
    - CREATE "Anon and authenticated can read mobile app records" (SELECT, anon + authenticated)
    - CREATE "Service role can insert mobile app records" (INSERT, service_role only)
    - CREATE "Service role can update mobile app records" (UPDATE, service_role only)

  2. Security
    - Read access limited to anon and authenticated roles (not public/unrestricted)
    - Insert and update restricted to service_role, matching the server-side API architecture
    - No DELETE policy: deletes remain blocked by default via RLS
*/

DROP POLICY IF EXISTS "Anyone can insert mobile app records" ON mobile_app_records;
DROP POLICY IF EXISTS "Anyone can read mobile app records" ON mobile_app_records;
DROP POLICY IF EXISTS "Anyone can update mobile app records" ON mobile_app_records;

CREATE POLICY "Anon and authenticated can read mobile app records"
  ON mobile_app_records
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Service role can insert mobile app records"
  ON mobile_app_records
  FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update mobile app records"
  ON mobile_app_records
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);
