import {test, before, after} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {PGlite} from '@electric-sql/pglite';
const db = new PGlite();
let serial = 0;
before(async () => {
  await db.exec('CREATE ROLE anon; CREATE ROLE authenticated;');
  await db.exec(readFileSync(new URL('../leaderboard/supabase.sql', import.meta.url), 'utf8'));
});
after(() => db.close());
async function submit({trace, splits = [10000], legs = [1], name = 'ABC', course = 'c2'}) {
  // Every test gets an isolated gateway address; no real server or public score is touched.
  await db.query("select set_config('request.headers', $1, false)", [JSON.stringify({'cf-connecting-ip': `test-${++serial}`})]);
  return db.query('select public.submit_score($1, $2, $3::int[], $4::int[], $5::jsonb) as result', [course, name, legs, splits, JSON.stringify(trace)]);
}
const straight = () => Array.from({length:21}, (_, i) => [i*500, 101+i*45, 691-i*7]);
const bad = (label, input) => test(label, async () => {await assert.rejects(submit(input), /implausible/);});
bad('null coordinates cannot skip distance checks', {trace:[[0,null,null],[200,null,null]],splits:[200]});
bad('null timestamp', {trace:[[null,101,691],[500,1001,551]],splits:[500]});
bad('string NaN coordinates', {trace:[[0,'NaN','NaN'],[200,'NaN','NaN']],splits:[200]});
bad('numeric-looking strings', {trace:[[0,'101','691'],[200,'1001','551']],splits:[200]});
bad('negative start time', {trace:[[-100,101,691],[200,1001,551]],splits:[200]});
bad('fractional timestamp', {trace:[[0,101,691],[200.1,1001,551]],splits:[200]});
bad('unbounded coordinates', {trace:[[0,1e50,691],[200,1001,551]],splits:[200]});
bad('missing coordinate', {trace:[[0,101],[200,1001,551]],splits:[200]});
bad('object sample', {trace:[{},[200,1001,551]],splits:[200]});
bad('null split', {trace:straight(),splits:[null]});
bad('multidimensional splits', {trace:straight(),splits:[[10000]]});
bad('multidimensional legs', {trace:straight(),legs:[[1]]});
bad('duplicate boards', {trace:straight(),legs:[1,1]});
bad('total before completion', {trace:straight(),legs:[0]});
bad('teleport', {trace:[[0,101,691],[200,1001,551]],splits:[200]});
bad('oversized sample count', {trace:Array.from({length:4001},()=>[0,101,691])});
bad('nonincreasing splits', {trace:straight(),splits:[10000,9999]});
test('valid route accepted, replay rejected, public response excludes client and splits', async () => {
  const {rows} = await submit({trace:straight()});
  assert.equal(rows[0].result['1'].ms,10000);
  await assert.rejects(submit({trace:straight()}), /duplicate/);
  const r = await db.query("select public.race_boards('c2', 10) as b");
  assert.deepEqual(r.rows[0].b.legs[0],[{i:'ABC',ms:10000}]);
  const entry = await db.query('select public.race_entry($1) as e',[rows[0].result['1'].id]);
  assert.equal('client' in entry.rows[0].e,false);
  assert.equal('splits' in entry.rows[0].e,false);
});
test('all five stops, total and each leg remain supported', async () => {
  const points=[[101,691],[1001,551],[-129,471],[91,-69],[61,-249],[231,-529]], trace=[[0,...points[0]]];
  for(let k=1;k<points.length;k++) for(let j=1;j<=20;j++) trace.push([(k-1)*10000+j*500,...points[k].map((x,a)=>points[k-1][a]+(x-points[k-1][a])*j/20)]);
  const {rows}=await submit({trace,splits:[10000,20000,30000,40000,50000],legs:[0,1,2,3,4,5]});
  assert.equal(rows[0].result['0'].ms,50000);
  assert.equal(Object.keys(rows[0].result).length,6);
});
test('anonymous direct read/write/truncate privileges are absent, RPC still works', async () => {
  for (const role of ['anon','authenticated']) {
    for (const p of ['SELECT','INSERT','UPDATE','DELETE','TRUNCATE']) {
      const r=await db.query("select has_table_privilege($1,'public.race_scores',$2) as ok",[role,p]);assert.equal(r.rows[0].ok,false);
    }
    await db.exec(`SET ROLE ${role}`);
    await assert.rejects(db.query('select * from public.race_scores'), /permission denied/);
    const r=await db.query("select public.race_boards('c2',10) as b");assert.equal(r.rows[0].b.legs.length,5);
    await db.exec('RESET ROLE');
  }
});
test('setup is repeatable and keeps recorded scores', async () => {
  const before=(await db.query('select count(*)::int as n from public.race_scores')).rows[0].n;
  await db.exec(readFileSync(new URL('../leaderboard/supabase.sql', import.meta.url),'utf8'));
  assert.equal((await db.query('select count(*)::int as n from public.race_scores')).rows[0].n,before);
});
