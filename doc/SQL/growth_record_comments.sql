CREATE TABLE growth_record_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  growth_record_id uuid NOT NULL REFERENCES growth_records(id) ON DELETE CASCADE,
  user_identifier text NOT NULL,
  user_name text NOT NULL,
  body text NOT NULL,
  created_at timestamp WITH TIME ZONE DEFAULT now()
);

ALTER TABLE growth_record_comments DISABLE ROW LEVEL SECURITY;
