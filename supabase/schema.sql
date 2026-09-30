-- DeutschStart – Postgres / Supabase schema
-- Mirrors src/types/models.ts. Content tables are public-read; user tables use Row Level Security.

-- ---------- Content ----------
create table vocabulary_topics (
  id text primary key,
  name text not null,            -- Vietnamese
  name_de text not null,
  icon text,
  description text
);

create table audio (
  id uuid primary key default gen_random_uuid(),
  text text not null,            -- what is spoken (also the TTS input)
  lang text not null default 'de-DE',
  url text,                      -- recorded or pre-generated file
  voice text,
  slow_url text
);

create table vocabulary (
  id text primary key,
  word text not null,
  article text check (article in ('der', 'die', 'das')),
  plural text,
  word_type text not null,
  ipa text not null,
  meaning text not null,         -- Vietnamese
  image_url text,
  image_emoji text,
  image_alt text not null,
  audio_id uuid references audio(id),
  example text not null,
  example_vi text not null,
  topic_id text references vocabulary_topics(id),
  level text not null default 'A1',
  difficulty smallint not null default 1 check (difficulty between 1 and 3),
  article_hint text
);
create index vocabulary_topic_idx on vocabulary(topic_id);

create table lessons (
  id text primary key,
  level text not null,
  sort_order int not null,
  title text not null,
  title_de text not null,
  description text,
  minutes int not null default 10,
  icon text,
  steps jsonb not null           -- LessonStep[]
);

create table grammar_lessons (
  id text primary key,
  sort_order int not null,
  title text not null,
  title_de text not null,
  level text not null,
  summary text,
  icon text,
  available boolean not null default false,
  content jsonb                  -- explanation, table, structure, examples, sentenceIds, tip
);

create table exercises (         -- sentence builder, listening, fill-blank, translation items
  id text primary key,
  kind text not null check (kind in ('sentence', 'listening', 'fill-blank', 'translation')),
  payload jsonb not null
);

create table questions (         -- hand-written questions (generated ones are built client-side)
  id text primary key,
  grammar_lesson_id text references grammar_lessons(id),
  question_type text not null,
  payload jsonb not null         -- Question
);

create table conversations (
  id text primary key,
  title text not null,
  title_de text not null,
  icon text,
  level text not null,
  context text,
  roles jsonb not null,
  lines jsonb not null,          -- DialogueLine[]
  key_phrases jsonb
);

create table achievements (
  id text primary key,
  icon text,
  title text not null,
  description text,
  rule jsonb                     -- evaluated server-side or client-side
);

-- ---------- Users ----------
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create table user_progress (     -- aggregate stats, streak, daily challenge
  user_id uuid primary key references auth.users(id) on delete cascade,
  article_stats jsonb not null default '{}',
  listening jsonb not null default '{"correct":0,"total":0}',
  quiz jsonb not null default '{"correct":0,"total":0}',
  grammar jsonb not null default '{"correct":0,"total":0}',
  pronunciation jsonb not null default '{}',
  lessons jsonb not null default '{}',
  grammar_lessons jsonb not null default '{}',
  alphabet_seen text[] not null default '{}',
  current_lesson_id text,
  streak_current int not null default 0,
  streak_longest int not null default 0,
  streak_last_date date,
  daily jsonb not null default '{}',
  study_seconds int not null default 0,
  updated_at timestamptz not null default now()
);

create table user_vocabulary (
  user_id uuid references auth.users(id) on delete cascade,
  word_id text references vocabulary(id) on delete cascade,
  saved boolean not null default false,
  correct int not null default 0,
  wrong int not null default 0,
  primary key (user_id, word_id)
);

create table review_schedule (   -- spaced repetition state
  user_id uuid references auth.users(id) on delete cascade,
  word_id text references vocabulary(id) on delete cascade,
  state text not null check (state in ('new', 'learning', 'review', 'mastered')),
  step smallint not null default -1,    -- index into [1, 3, 7, 14, 30] days
  due_at date not null default current_date,
  last_reviewed_at date,
  primary key (user_id, word_id)
);
create index review_due_idx on review_schedule(user_id, due_at);

create table mistakes (
  user_id uuid references auth.users(id) on delete cascade,
  question_id text not null,
  question jsonb not null,       -- snapshot so the question can be re-asked
  user_answer text,
  count int not null default 1,
  last_at timestamptz not null default now(),
  resolved boolean not null default false,
  primary key (user_id, question_id)
);

create table user_achievements (
  user_id uuid references auth.users(id) on delete cascade,
  achievement_id text references achievements(id),
  unlocked_at timestamptz not null default now(),
  primary key (user_id, achievement_id)
);

-- ---------- Row Level Security ----------
alter table profiles enable row level security;
alter table user_progress enable row level security;
alter table user_vocabulary enable row level security;
alter table review_schedule enable row level security;
alter table mistakes enable row level security;
alter table user_achievements enable row level security;

create policy "own profile" on profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "own progress" on user_progress for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own vocabulary" on user_vocabulary for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own reviews" on review_schedule for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own mistakes" on mistakes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own achievements" on user_achievements for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
