const assert = require('node:assert/strict');
const tracks = require('../assets/js/career-data.js');
const questions = require('../assets/js/career-questions.js');
const { scoreCareerInterests: score } = require('../assets/js/career-explorer.js');
const answers = index => Object.fromEntries(questions.map(q => [q.id, [index]]));
assert.equal(questions.length, 8);
for (const q of questions) {
  const primary = q.choices.map(c=>Object.entries(c.weights).find(([,v])=>v===2)[0]);
  assert.equal(new Set(primary).size, 6);
}
const people=score(tracks,questions,answers(0));
assert.equal(people.status,'matched');assert(people.matches.some(m=>m.id==='customer'));assert(people.matches.some(m=>m.id==='support'));
const researching=score(tracks,questions,answers(1));assert(researching.matches.some(m=>m.id==='dfir'));assert(researching.matches.some(m=>m.id==='data'));
const organizing=score(tracks,questions,answers(2));assert(organizing.matches.some(m=>m.id==='grc'));assert(organizing.matches.some(m=>m.id==='writing'));
const explaining=score(tracks,questions,answers(5));assert.equal(explaining.matches[0].id,'writing');
assert.equal(score(tracks,questions,{}).status,'uncertain');
assert.equal(score(tracks,questions,Object.fromEntries(questions.map(q=>[q.id,[]]))).status,'uncertain');
assert.equal(score(tracks,questions,{'0':[0],'1':[0],'2':[0]}).status,'uncertain');
assert.equal(score(tracks,questions,{'0':[0],'1':[0],'2':[0],'3':[0]}).status,'matched');
assert.equal(score(tracks,questions,{'0':[0,0],'1':[99],'2':[NaN],'3':[0,1,2]}).answered,0);
const two=score(tracks,questions,Object.fromEntries(questions.map(q=>[q.id,[0,5]])));assert.equal(two.answered,8);assert(two.interests.every(i=>i.value<=1));
const uniform={...tracks[0],profile:{people:1,investigate:1,organize:1,build:1,create:1,explain:1}};
const tied=score(['a','b','c','d'].map(id=>({...uniform,id})),questions,answers(0));assert.equal(tied.matches.length,4);
const equalQuestions=questions.map(q=>({...q,choices:[{text:'Varied interests',weights:{people:1,investigate:1,organize:1,build:1,create:1,explain:1}}]}));assert.equal(score(tracks,equalQuestions,answers(0)).status,'broad');
assert(people.matches.every(m=>m.reasons.every(reason=>questions.some(q=>q.choices[0].text===reason))));
console.log('Eight prompt scoring passed: interest directions, balanced exposure, ties, uncertainty, minimum evidence, two choices, invalid input and actual answer explanations.');
