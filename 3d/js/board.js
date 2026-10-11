// Leaderboard for 2033 外送王. With a Supabase project filled in below, every run goes to one shared board
// (checked server-side by tools/leaderboard/supabase.sql); without one, scores stay on this device.
export const BOARD = {
  url: '',   // e.g. https://abcdefgh.supabase.co
  key: '',   // the project's anon (public) key — safe to ship; the database only accepts runs through submit_score()
};

// three-letter names the board refuses (also enforced in the database)
const BLOCK = new Set(('ASS CUM COK CNT DIC DIK FAG FCK FUC FUK FUQ FKU JIZ KKK KYS NGR NIG SEX SHT TIT VAG XXX ' +
  'CNM NMB TMD MLB GAN').split(' '));
export const refused = (s) => BLOCK.has(s);
export const isShared = () => !!(BOARD.url && BOARD.key);

const lsKey = (course) => `ai2033.race.${course}`;
function readLocal(course) { try { return JSON.parse(localStorage.getItem(lsKey(course)) || '[]'); } catch { return []; } }
function writeLocal(course, list) { try { localStorage.setItem(lsKey(course), JSON.stringify(list.slice(0, 50))); } catch { /* storage off */ } }
const clean = (rows) => rows.filter(r => /^[A-Z]{3}$/.test(r.i) && Number.isFinite(r.ms));

async function rpc(fn, body) {
  const res = await fetch(`${BOARD.url.replace(/\/$/, '')}/rest/v1/rpc/${fn}`, {
    method: 'POST',
    headers: { apikey: BOARD.key, Authorization: `Bearer ${BOARD.key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let data = null; try { data = JSON.parse(text); } catch { /* not json */ }
  if (!res.ok) { const e = new Error((data && data.message) || `HTTP ${res.status}`); e.reason = data && data.message; throw e; }
  return data;
}

// best times, fastest first: { shared, rows: [{ i, ms, at }] }
export async function top(course, n = 10) {
  if (isShared()) {
    try {
      const rows = await rpc('race_top', { p_course: course, p_limit: n });
      return { shared: true, rows: clean(rows.map(r => ({ i: r.initials, ms: r.ms, at: r.created_at }))) };
    } catch { /* fall back to this device */ }
  }
  return { shared: false, rows: clean(readLocal(course)).slice(0, n) };
}

// run: { initials, ms, splits: [ms at each delivery], trace: [[ms, x, z], …] } -> { shared, rank, total, reason? }
export async function submit(course, run) {
  const list = readLocal(course);
  list.push({ i: run.initials, ms: run.ms, at: new Date().toISOString() });
  list.sort((a, b) => a.ms - b.ms);
  writeLocal(course, list);
  const local = { shared: false, rank: list.findIndex(r => r.ms === run.ms && r.i === run.initials) + 1, total: list.length };
  if (!isShared()) return local;
  try {
    const r = await rpc('submit_score', { p_course: course, p_initials: run.initials, p_ms: run.ms, p_splits: run.splits, p_trace: run.trace });
    return { shared: true, rank: r.rank, total: r.total };
  } catch (e) {
    return { ...local, reason: e.reason || 'offline' };
  }
}

export function personalBest(course) { try { return +localStorage.getItem(lsKey(course) + '.pb') || null; } catch { return null; } }
export function savePersonalBest(course, ms) { try { localStorage.setItem(lsKey(course) + '.pb', String(ms)); } catch { /* storage off */ } }
export function lastInitials() { try { const s = localStorage.getItem('ai2033.initials') || ''; return /^[A-Z]{3}$/.test(s) ? s : 'AAA'; } catch { return 'AAA'; } }
export function saveInitials(s) { try { localStorage.setItem('ai2033.initials', s); } catch { /* storage off */ } }
