-- Run this in your Supabase dashboard → SQL Editor

-- Create the survey_responses table
CREATE TABLE IF NOT EXISTS survey_responses (
  id SERIAL PRIMARY KEY,
  after_class_activity TEXT NOT NULL,
  state TEXT NOT NULL,
  year_in_college TEXT NOT NULL,
  activities TEXT[] NOT NULL,
  other_activity TEXT,
  study_hours TEXT NOT NULL,
  study_preference TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

-- Allow anyone to INSERT (submit a survey)
CREATE POLICY "allow_public_insert"
  ON survey_responses
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anyone to SELECT (view aggregated results)
CREATE POLICY "allow_public_select"
  ON survey_responses
  FOR SELECT
  TO anon
  USING (true);
