CREATE TABLE growth_record_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  growth_record_id uuid NOT NULL REFERENCES growth_records(id) ON DELETE CASCADE,
  user_identifier text NOT NULL,
  created_at timestamp WITH TIME ZONE DEFAULT now(),
  UNIQUE (growth_record_id, user_identifier)
);

ALTER TABLE growth_record_likes DISABLE ROW LEVEL SECURITY;
