-- Migration: Kelas, Angkatan, class metadata
-- Run after schema.sql in Supabase SQL Editor

alter table public.profiles
  add column if not exists kelas text check (kelas in ('A', 'B', 'C', 'D', 'E', 'F')),
  add column if not exists angkatan text,
  add column if not exists setup_complete boolean not null default false,
  add column if not exists is_asprak boolean not null default false;

alter table public.classes
  add column if not exists course_type text not null default 'theory'
    check (course_type in ('theory', 'practicum')),
  add column if not exists meeting_mode text not null default 'offline'
    check (meeting_mode in ('online', 'offline')),
  add column if not exists schedule_kind text not null default 'study'
    check (schedule_kind in ('study', 'teach'));
