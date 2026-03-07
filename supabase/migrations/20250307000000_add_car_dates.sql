-- Add insurance_expiry, maintenance_date, mileage, is_ready to cars table
-- Run this in Supabase SQL Editor: Dashboard > SQL Editor > New query
ALTER TABLE cars
ADD COLUMN IF NOT EXISTS insurance_expiry DATE,
ADD COLUMN IF NOT EXISTS maintenance_date DATE,
ADD COLUMN IF NOT EXISTS mileage INTEGER,
ADD COLUMN IF NOT EXISTS is_ready BOOLEAN DEFAULT true;
