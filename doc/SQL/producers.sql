create table public.producers (
  name text not null,
  location text null,
  description text null,
  image_url text null,
  created_at timestamp with time zone null default now(),
  user_id uuid not null,
  constraint producers_pkey primary key (user_id),
  constraint producers_user_id_fkey foreign KEY (user_id) references profiles (id)
) TABLESPACE pg_default;