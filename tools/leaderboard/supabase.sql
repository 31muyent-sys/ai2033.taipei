-- 臺北 2033 外送王 — shared leaderboard on Supabase (Postgres).
-- Run this once in the Supabase SQL editor, then put the project URL and anon key in 3d/js/board.js.
-- Browsers can only call race_top() and submit_score(); the table itself stays closed to the public.
-- submit_score() replays the run's route samples: every stop visited in order at its split time, never
-- faster than the taxi can go, starting from the start line. Remove a bad entry with:
--   delete from public.race_scores where id = …;

create table if not exists public.race_scores (
  id bigint generated always as identity primary key,
  course text not null,
  initials text not null check (initials ~ '^[A-Z]{3}$'),
  ms integer not null check (ms between 1000 and 900000),
  splits integer[] not null,
  created_at timestamptz not null default now(),
  client text   -- hashed client address, used only for the rate limit
);
create index if not exists race_scores_rank on public.race_scores (course, ms);
create index if not exists race_scores_client on public.race_scores (client, created_at desc);
alter table public.race_scores enable row level security;   -- no policies: no direct reads or writes
revoke all on public.race_scores from public;

-- courses the game ships (3d/js/content.js RACE): start, delivery radius and stops in world metres
create or replace function public.race_course(p_course text)
returns jsonb language sql immutable set search_path = public as $$
  select case p_course
    when 'c1' then '{"start":[101,691],"radius":30,"stops":[[1001,551],[-129,471],[91,-69],[61,-249],[231,-529]]}'::jsonb
  end
$$;

create or replace function public.race_top(p_course text, p_limit int default 10)
returns table (initials text, ms int, created_at timestamptz)
language sql stable security definer set search_path = public as $$
  select s.initials, s.ms, s.created_at
  from public.race_scores s
  where s.course = p_course
  order by s.ms, s.created_at
  limit least(greatest(coalesce(p_limit, 10), 1), 100)
$$;

create or replace function public.submit_score(p_course text, p_initials text, p_ms int, p_splits int[], p_trace jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  c jsonb := public.race_course(p_course);
  vmax constant numeric := 52.5;   -- the taxi's top speed with boost is 52 m/s
  nstops int; n int; k int := 0; i int;
  prev jsonb; cur jsonb; st jsonb; dt numeric; d numeric; rad numeric; who text;
  r int; tot int;
begin
  if c is null then raise exception 'bad_course'; end if;
  if p_initials is null or p_initials !~ '^[A-Z]{3}$' then raise exception 'bad_initials'; end if;
  if p_initials = any (string_to_array('ASS CUM COK CNT DIC DIK FAG FCK FUC FUK FUQ FKU JIZ KKK KYS NGR NIG SEX SHT TIT VAG XXX CNM NMB TMD MLB GAN', ' ')) then
    raise exception 'blocked_initials';
  end if;
  -- one run per client every 15 seconds
  who := md5(coalesce(current_setting('request.headers', true)::json->>'x-forwarded-for', '') || '|' || p_course);
  if exists (select 1 from public.race_scores where client = who and created_at > now() - interval '15 seconds') then
    raise exception 'rate_limited';
  end if;

  nstops := jsonb_array_length(c->'stops');
  if p_ms is null or p_splits is null or p_trace is null or jsonb_typeof(p_trace) <> 'array' then raise exception 'implausible'; end if;
  n := jsonb_array_length(p_trace);
  if n < 10 or n > 4000 or coalesce(array_length(p_splits, 1), 0) <> nstops or p_splits[nstops] <> p_ms then
    raise exception 'implausible';
  end if;
  rad := (c->>'radius')::numeric + 2;

  -- the first sample is on the start line within the first second
  cur := p_trace->0;
  if jsonb_array_length(cur) <> 3 or (cur->>0)::numeric > 1000
     or sqrt(((cur->>1)::numeric - (c->'start'->>0)::numeric) ^ 2 + ((cur->>2)::numeric - (c->'start'->>1)::numeric) ^ 2) > 60 then
    raise exception 'implausible';
  end if;
  -- walk the route: time only moves forward, no sample faster than the taxi, each stop reached in order at its split
  for i in 1 .. n - 1 loop
    prev := cur; cur := p_trace->i;
    if jsonb_array_length(cur) <> 3 then raise exception 'implausible'; end if;
    dt := ((cur->>0)::numeric - (prev->>0)::numeric) / 1000;
    if dt < 0 or dt > 1.5 then raise exception 'implausible'; end if;
    d := sqrt(((cur->>1)::numeric - (prev->>1)::numeric) ^ 2 + ((cur->>2)::numeric - (prev->>2)::numeric) ^ 2);
    if d > vmax * dt + 3 then raise exception 'implausible'; end if;   -- +3 m for positions rounded to the metre
    if k < nstops and (cur->>0)::int = p_splits[k + 1] then
      st := c->'stops'->k;
      if sqrt(((cur->>1)::numeric - (st->>0)::numeric) ^ 2 + ((cur->>2)::numeric - (st->>1)::numeric) ^ 2) > rad then
        raise exception 'implausible';
      end if;
      k := k + 1;
    end if;
  end loop;
  if k <> nstops or (cur->>0)::int <> p_ms then raise exception 'implausible'; end if;

  insert into public.race_scores (course, initials, ms, splits, client) values (p_course, p_initials, p_ms, p_splits, who);
  select count(*) + 1 into r from public.race_scores where course = p_course and ms < p_ms;
  select count(*) into tot from public.race_scores where course = p_course;
  return jsonb_build_object('rank', r, 'total', tot);
end
$$;

revoke all on function public.submit_score(text, text, int, int[], jsonb) from public;
revoke all on function public.race_top(text, int) from public;
grant execute on function public.race_top(text, int) to anon, authenticated;
grant execute on function public.submit_score(text, text, int, int[], jsonb) to anon, authenticated;
