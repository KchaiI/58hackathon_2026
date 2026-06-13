create table public.listings (
  id uuid not null default gen_random_uuid (),
  producer_id uuid null,
  title text not null,
  description text null,
  crop text not null,
  price integer not null,
  total_slots integer not null,
  available_slots integer not null,
  image_url text null,
  harvest_date date null,
  created_at timestamp with time zone null default now(),
  short_id serial not null,
  constraint listings_pkey primary key (id),
  constraint listings_producer_id_fkey foreign KEY (producer_id) references producers (user_id) on delete CASCADE
) TABLESPACE pg_default;