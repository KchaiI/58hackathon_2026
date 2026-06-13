create table public.ownerships (
  id uuid not null default gen_random_uuid (),
  listing_id uuid null,
  slots integer not null default 1,
  created_at timestamp with time zone null default now(),
  user_id uuid null,
  constraint ownerships_pkey primary key (id),
  constraint ownerships_listing_id_fkey foreign KEY (listing_id) references listings (id) on delete CASCADE,
  constraint ownerships_owner_id_fkey foreign KEY (user_id) references profiles (id)
) TABLESPACE pg_default;