const assert=require('node:assert/strict');
const tracks=require('../assets/js/career-data.js');
const {scoreCareerInterests:score}=require('../assets/js/career-explorer.js');
function answers(fn){return Object.fromEntries(tracks.flatMap(t=>t.tasks.map((_,i)=>[`${t.id}:${i}`,fn(t,i)])));}
for(const target of tracks){const r=score(tracks,answers(t=>t.id===target.id?4:0));assert.deepEqual(r.map(x=>x.id),[target.id]);assert.equal(r[0].reasons.length,3);}
assert.deepEqual(score(tracks,answers(()=>-1)),[]);
assert.deepEqual(score(tracks,answers(()=>0)),[]);
assert.deepEqual(score(tracks,answers(()=>1)),[]);
assert.equal(score(tracks,answers(()=>4)).length,12);
let a=answers(()=>0);a['grc:0']=4;assert.deepEqual(score(tracks,a).map(x=>x.id),[]);
a['grc:1']=4;a['grc:2']=-1;assert.equal(score(tracks,a)[0].mean,4);assert.equal(score(tracks,a)[0].count,2);
a=answers(()=>0);for(const t of tracks.slice(0,4))for(let i=0;i<3;i++)a[`${t.id}:${i}`]=3;assert.equal(score(tracks,a).length,4);
a=answers(t=>t.id==='architecture'?4:1);assert.deepEqual(score(tracks,a).map(x=>x.id),['architecture']);
assert.deepEqual(score(tracks,answers(()=>NaN)),[]);
console.log('Scoring passed: each career, unsure, no interest, low interest, ties, insufficient ratings, normalization, invalid input.');
