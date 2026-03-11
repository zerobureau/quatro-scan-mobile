/*
  # Drop Unused Indexes

  Removes 7 indexes that have never been used, reducing storage overhead
  and write amplification.

  1. Dropped Indexes
    - `idx_properties_company` on `properties(company)`
    - `idx_mobile_app_records_entity` on `mobile_app_records(entity)`
    - `idx_mobile_app_records_status` on `mobile_app_records(status)`
    - `idx_mobile_app_records_airtable_id` on `mobile_app_records(airtable_record_id)`
    - `idx_submissions_entity` on `submissions(entity)`
    - `idx_submissions_sent_at` on `submissions(sent_at DESC)`
    - `idx_submissions_status` on `submissions(status)`

  2. Notes
    - These indexes can be re-created later if query patterns change
    - Primary key indexes are preserved
    - `idx_properties_address` is preserved (still in use)
*/

DROP INDEX IF EXISTS idx_properties_company;
DROP INDEX IF EXISTS idx_mobile_app_records_entity;
DROP INDEX IF EXISTS idx_mobile_app_records_status;
DROP INDEX IF EXISTS idx_mobile_app_records_airtable_id;
DROP INDEX IF EXISTS idx_submissions_entity;
DROP INDEX IF EXISTS idx_submissions_sent_at;
DROP INDEX IF EXISTS idx_submissions_status;
