/*
  # Fix RLS Policies on submissions

  Replaces overly permissive policies (USING true / WITH CHECK true targeting
  the public role) with restrictive policies scoped to proper roles.

  1. Changes
    - DROP "Service role can insert submissions" (INSERT, public, always true)
    - DROP "Anyone can read submissions" (SELECT, public, always true)
    - DROP "Service role can update submissions" (UPDATE, public, always true)
    - CREATE "Anon and authenticated can read submissions" (SELECT, anon + authenticated)
    - CREATE "Service role can insert submissions" (INSERT, service_role only)
    - CREATE "Service role can update submissions" (UPDATE, service_role only)

  2. Security
    - Read access limited to anon and authenticated roles
    - Insert and update restricted to service_role only
    - No DELETE policy: deletes remain blocked by default via RLS
*/

DROP POLICY IF EXISTS "Service role can insert submissions" ON submissions;
DROP POLICY IF EXISTS "Anyone can read submissions" ON submissions;
DROP POLICY IF EXISTS "Service role can update submissions" ON submissions;

CREATE POLICY "Anon and authenticated can read submissions"
  ON submissions
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Service role can insert submissions"
  ON submissions
  FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update submissions"
  ON submissions
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);
