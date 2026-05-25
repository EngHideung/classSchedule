-- ClassFlow Supabase Schema
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

-- Profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text not null default '',
  role text not null default 'student' check (role in ('student', 'teacher', 'admin')),
  institution text,
  avatar_url text,
  language text not null default 'en' check (language in ('en', 'id')),
  kelas text check (kelas in ('A', 'B', 'C', 'D', 'E', 'F')),
  angkatan text,
  setup_complete boolean not null default false,
  is_asprak boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Classes / schedule sessions
create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  lecturer text not null default '',
  room text not null default '',
  color text not null default '#6366f1',
  day_of_week int not null check (day_of_week >= 0 and day_of_week <= 6),
  start_time text not null,
  end_time text not null,
  notes text,
  recurrence text not null default 'weekly' check (recurrence in ('none', 'daily', 'weekly', 'biweekly')),
  course_type text not null default 'theory' check (course_type in ('theory', 'practicum')),
  meeting_mode text not null default 'offline' check (meeting_mode in ('online', 'offline')),
  schedule_kind text not null default 'study' check (schedule_kind in ('study', 'teach')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Assignments
create table if not exists public.assignments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  class_id uuid references public.classes(id) on delete set null,
  title text not null,
  due_date timestamptz not null,
  completed boolean not null default false,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  created_at timestamptz not null default now()
);

-- Notifications
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  message text not null,
  read boolean not null default false,
  type text not null default 'info' check (type in ('info', 'warning', 'success', 'reminder')),
  created_at timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'student')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists classes_updated_at on public.classes;
create trigger classes_updated_at before update on public.classes
  for each row execute function public.set_updated_at();

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.classes enable row level security;
alter table public.assignments enable row level security;
alter table public.notifications enable row level security;

-- Profiles policies
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Classes policies
create policy "Users can view own classes" on public.classes for select using (auth.uid() = user_id);
create policy "Users can insert own classes" on public.classes for insert with check (auth.uid() = user_id);
create policy "Users can update own classes" on public.classes for update using (auth.uid() = user_id);
create policy "Users can delete own classes" on public.classes for delete using (auth.uid() = user_id);

-- Assignments policies
create policy "Users can view own assignments" on public.assignments for select using (auth.uid() = user_id);
create policy "Users can insert own assignments" on public.assignments for insert with check (auth.uid() = user_id);
create policy "Users can update own assignments" on public.assignments for update using (auth.uid() = user_id);
create policy "Users can delete own assignments" on public.assignments for delete using (auth.uid() = user_id);

-- Notifications policies
create policy "Users can view own notifications" on public.notifications for select using (auth.uid() = user_id);
create policy "Users can insert own notifications" on public.notifications for insert with check (auth.uid() = user_id);
create policy "Users can update own notifications" on public.notifications for update using (auth.uid() = user_id);
create policy "Users can delete own notifications" on public.notifications for delete using (auth.uid() = user_id);

-- Indexes
create index if not exists classes_user_id_idx on public.classes(user_id);
create index if not exists assignments_user_id_idx on public.assignments(user_id);
create index if not exists notifications_user_id_idx on public.notifications(user_id);
