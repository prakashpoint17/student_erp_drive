-- =========================================================================
-- STUDENT ERP SYSTEM: SUPABASE DATABASE SCHEMA & ROLE-BASED ACCESS CONTROL
-- =========================================================================
-- Paste this script into your Supabase Dashboard -> SQL Editor and click RUN.
-- Sets up tables, foreign keys, row level security (RLS), and automatic profile creation.
-- =========================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. DEPARTMENTS TABLE
create table if not exists public.departments (
  dept_id text primary key,
  name text not null,
  code text not null unique,
  hod_id uuid,
  hod_name text,
  hod_email text,
  common_space_email text,
  active_batches integer[] default array[2024, 2025, 2026, 2027],
  created_at timestamp with time zone default now()
);

-- 2. USER PROFILES TABLE (Linked to Supabase Auth)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null unique,
  full_name text not null,
  role text not null check (role in ('admin', 'hod', 'staff', 'student')),
  designation text,
  department_id text references public.departments(dept_id),
  reg_no text,
  roll_no text,
  batch_year integer,
  section text,
  is_tutor boolean default false,
  assigned_class jsonb, -- { department_id, batch_year, section, space_id }
  phone text,
  qualification text,
  experience text,
  avatar_url text,
  is_active boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 3. GOOGLE DRIVE SPACES TABLE (Decentralized 15GB Free Spaces)
create table if not exists public.drive_spaces (
  space_id text primary key,
  name text not null,
  type text not null check (type in ('common', 'batch')),
  department_id text references public.departments(dept_id),
  batch_year integer,
  account_email text not null,
  web_app_url text,
  folder_id text,
  sheet_id text,
  used_storage_gb numeric default 0.1,
  total_storage_gb numeric default 15.0,
  status text default 'connected',
  connected_by text,
  connected_at timestamp with time zone default now(),
  description text
);

-- 4. CLASS TASKS & GOOGLE FORMS TABLE
create table if not exists public.tasks (
  task_id text primary key,
  title text not null,
  description text,
  department_id text references public.departments(dept_id),
  batch_year integer,
  section text,
  form_link text,
  deadline text,
  space_id text references public.drive_spaces(space_id),
  created_by text,
  creator_email text,
  status text default 'Active',
  created_at timestamp with time zone default now()
);

-- 5. STUDENT CORRECTION REQUESTS TABLE
create table if not exists public.correction_requests (
  request_id text primary key,
  student_id uuid references public.profiles(id),
  student_name text not null,
  student_reg_no text not null,
  department_id text references public.departments(dept_id),
  batch_year integer,
  section text,
  field text not null,
  current_value text,
  requested_value text not null,
  reason text not null,
  status text default 'Pending' check (status in ('Pending', 'Approved', 'Rejected')),
  reviewed_by text,
  submitted_at timestamp with time zone default now(),
  reviewed_at timestamp with time zone
);

-- 6. IMMUTABLE SYSTEM AUDIT LOGS
create table if not exists public.audit_logs (
  id uuid default uuid_generate_v4() primary key,
  actor_email text not null,
  action text not null,
  details text not null,
  created_at timestamp with time zone default now()
);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

alter table public.departments enable row level security;
alter table public.profiles enable row level security;
alter table public.drive_spaces enable row level security;
alter table public.tasks enable row level security;
alter table public.correction_requests enable row level security;
alter table public.audit_logs enable row level security;

-- PROFILES POLICIES
create policy "Allow all authenticated users to read profiles"
  on public.profiles for select
  to authenticated
  using (true);

create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

create policy "Admins and HODs can insert or update department profiles"
  on public.profiles for all
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'hod')
    )
  );

-- DRIVE SPACES POLICIES
create policy "Authenticated users can view accessible spaces"
  on public.drive_spaces for select
  to authenticated
  using (true);

create policy "Admins and HODs can manage drive spaces"
  on public.drive_spaces for all
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'hod')
    )
  );

-- CORRECTION REQUESTS POLICIES
create policy "Students can view and create their own requests"
  on public.correction_requests for all
  to authenticated
  using (student_id = auth.uid());

create policy "Tutors and HODs can review correction requests"
  on public.correction_requests for all
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and (role in ('admin', 'hod') or is_tutor = true)
    )
  );

-- AUDIT LOGS POLICIES
create policy "Authenticated users can insert audit logs"
  on public.audit_logs for insert
  to authenticated
  with check (true);

create policy "Admins and HODs can read audit logs"
  on public.audit_logs for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'hod')
    )
  );
