-- Migration V3: Add barangay field to addresses table
-- Run this in Supabase SQL Editor AFTER supabase-migration-v2.sql

-- ============================================================
-- 1. Add barangay column to addresses table
-- ============================================================
ALTER TABLE addresses ADD COLUMN IF NOT EXISTS barangay TEXT DEFAULT '';

-- ============================================================
-- 2. Add region column to seller_profiles (for PSGC API codes)
-- ============================================================
ALTER TABLE seller_profiles ADD COLUMN IF NOT EXISTS region TEXT DEFAULT '';
