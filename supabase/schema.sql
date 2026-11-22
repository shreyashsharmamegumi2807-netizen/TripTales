-- ========================================================
-- TRIPTALES — SUPABASE DATABASE SCHEMA & RLS POLICIES
-- ========================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Profiles
alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Trigger to create profile when auth.user is created
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2. SAVED TRIPS & ITINERARIES TABLE
create table if not exists public.saved_trips (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  destination text not null,
  starting_location text not null,
  travellers integer not null default 1,
  days integer not null default 3,
  budget numeric not null default 0,
  travel_date text,
  trip_type text not null,
  preferences text,
  itinerary jsonb not null,
  budget_breakdown jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Saved Trips
alter table public.saved_trips enable row level security;

create policy "Users can view only their own saved trips"
  on public.saved_trips for select
  using (auth.uid() = user_id);

create policy "Users can insert their own saved trips"
  on public.saved_trips for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own saved trips"
  on public.saved_trips for update
  using (auth.uid() = user_id);

create policy "Users can delete their own saved trips"
  on public.saved_trips for delete
  using (auth.uid() = user_id);


-- 3. TRAVEL JOURNAL TABLE
create table if not exists public.travel_journal (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  trip_title text not null,
  destination text not null,
  travel_date text,
  memories text not null,
  highlights text,
  rating integer default 5,
  photo_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Travel Journal
alter table public.travel_journal enable row level security;

create policy "Users can view only their own journal entries"
  on public.travel_journal for select
  using (auth.uid() = user_id);

create policy "Users can insert their own journal entries"
  on public.travel_journal for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own journal entries"
  on public.travel_journal for update
  using (auth.uid() = user_id);

create policy "Users can delete their own journal entries"
  on public.travel_journal for delete
  using (auth.uid() = user_id);


-- 4. CHAT HISTORY (OPTIONAL PERSISTENCE)
create table if not exists public.chat_conversations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null default 'New Conversation',
  messages jsonb not null default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.chat_conversations enable row level security;

create policy "Users can view only their own chat conversations"
  on public.chat_conversations for select
  using (auth.uid() = user_id);

create policy "Users can insert their own chat conversations"
  on public.chat_conversations for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own chat conversations"
  on public.chat_conversations for update
  using (auth.uid() = user_id);

create policy "Users can delete their own chat conversations"
  on public.chat_conversations for delete
  using (auth.uid() = user_id);
