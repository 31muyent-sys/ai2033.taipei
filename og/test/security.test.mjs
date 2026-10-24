import {test} from 'node:test';
import assert from 'node:assert/strict';
import {toNode} from '../lib/node.js';
import {lookup, words} from '../lib/common.js';
import {handle as share} from '../api/share.js';
function response(){return {headers:{},setHeader(k,v){this.headers[k]=v},end(b){this.body=b}};}
test('forwarded host cannot poison share metadata',async()=>{
 const r=response();await toNode(share)({method:'GET',url:'/r?n=ABC&ms=12345&k=0',headers:{host:'evil.test','x-forwarded-host':'evil.test','x-forwarded-proto':'javascript'}},r);
 assert.equal(r.statusCode,200);const html=r.body.toString();assert.match(html,/https:\/\/go.ai2033.taipei\/card/);assert.doesNotMatch(html,/evil.test/);
 assert.equal(r.headers['X-Content-Type-Options'],'nosniff');
});
test('reject unexpected methods, oversized or external request targets',async()=>{
 for(const [method,url,status] of [['POST','/r',405],['GET','//evil.test/r',400],['GET','/'+ 'x'.repeat(2049),400],['GET','/\\evil.test/r',400]]){
 const r=response();await toNode(()=>{throw Error('must not render')})({method,url,headers:{}},r);assert.equal(r.statusCode,status);
 }
});
test('HEAD emits no body',async()=>{const r=response();await toNode(share)({method:'HEAD',url:'/r',headers:{}},r);assert.equal(r.statusCode,200);assert.equal(r.body,undefined)});
test('malicious or malformed manual scores become the generic card',async()=>{
 for(const q of ['n=%3Cscript%3E&ms=200&k=0','n=ABC&ms=Infinity&k=0','n=ABC&ms=200&k=1.5','n=ABC&ms=-1&k=0']) assert.equal((await lookup(new URLSearchParams(q))).kind,'site');
});
test('valid fallback score never claims a verified rank',async()=>{const r=await lookup(new URLSearchParams('n=ABC&ms=500&k=4'));assert.equal(r.kind,'run');assert.equal(r.rank,undefined);assert.doesNotMatch(words(r).title,/第 \d+ 名/)});
test('malformed upstream entries and rows cannot enter cards',async()=>{
 const old=globalThis.fetch;
 try{
  globalThis.fetch=async()=>Response.json({course:'c2',id:1,leg:1.2,initials:'ABC',ms:500,rank:1,total:1});
  assert.equal((await lookup(new URLSearchParams('id=1'))).kind,'site');
  globalThis.fetch=async()=>Response.json({total:[{i:'<x>',ms:200},{i:'ABC',ms:-1},{i:'DEF',ms:200}]});
  assert.deepEqual((await lookup(new URLSearchParams('board=1'))).rows,[{i:'DEF',ms:200}]);
 }finally{globalThis.fetch=old}
});
test('real card endpoint renders a valid PNG for a valid score after dependency patch',async()=>{
 const {handle}=await import('../api/card.js');
 const r=await handle(new Request('https://go.ai2033.taipei/card?n=ABC&ms=83450&k=0'));
 assert.equal(r.status,200);assert.equal(r.headers.get('content-type'),'image/png');
 const b=Buffer.from(await r.arrayBuffer());assert.equal(b.subarray(1,4).toString(),'PNG');assert.equal(b.readUInt32BE(16),1200);assert.equal(b.readUInt32BE(20),630);
});
