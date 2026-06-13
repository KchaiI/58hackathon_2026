create table public.profiles (
  id uuid not null,
  name text not null,
  address text null,
  email text not null default ''::text,
  constraint profiles_pkey primary key (id),
  constraint profiles_id_fkey foreign KEY (id) references auth.users (id) on delete CASCADE
) TABLESPACE pg_default;