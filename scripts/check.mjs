import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),out=path.join(root,'dist');
const expected=['.nojekyll','404.html','app.js','assets/icon-180.png','assets/icon-64.png','index.html','privacy/index.html','styles.css','support/index.html'].sort();
function list(d,p=''){return fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?list(path.join(d,e.name),p+e.name+'/'):[p+e.name]);}
assert.deepEqual(list(out).sort(),expected,'Deployment allowlist');
const pages=['index.html','privacy/index.html','support/index.html'];
const read=file=>fs.readFileSync(path.join(out,file),'utf8');
for(const page of pages){
 const html=read(page),ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(ids.length,new Set(ids).size);assert.equal((html.match(/<h1\b/g)||[]).length,1);
 assert.ok(html.includes('lang="en"')&&html.includes('name="viewport"'));
 assert.ok(!/Prepublication|draft|placeholder|to be set|must be finalized|<!--|Beta information|Explore AIO Finance/i.test(html),'No public draft instructions or removed CTAs');
 assert.ok(!/<form\b|<iframe\b|<button\b|<script[^>]+src="https:/i.test(html));
 assert.equal((html.match(/<nav[\s\S]*?<\/nav>/)||[''])[0].match(/<a /g)?.length,2);
 assert.ok(!/gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]+|BEGIN PRIVATE KEY/.test(html));
 const base=new URL(page.includes('/')?'../':'./','https://local.invalid/'+page);
 for(const [,raw] of html.matchAll(/(?:href|src)="([^"]+)"/g)){
  if(/^(mailto:|https:)/.test(raw))continue;
  const u=new URL(raw,base);let target=path.join(out,u.pathname);
  if(fs.existsSync(target)&&fs.statSync(target).isDirectory())target=path.join(target,'index.html');
  assert.ok(fs.existsSync(target),'Existing internal destination: '+raw+' on '+page);
  if(u.hash){const targetHtml=fs.readFileSync(target,'utf8');assert.ok(targetHtml.includes('id="'+u.hash.slice(1)+'"'),'Anchor exists on correct destination: '+raw);}
 }
}
const home=read('index.html'),privacy=read('privacy/index.html'),support=read('support/index.html');
assert.ok(!home.includes('id="policy-information"'),'Homepage has no full policy');
for(const name of ['Financial Overview','Financial Planning','Opportunity Comparison','Privacy and Control'])assert.ok(home.includes(name));
assert.ok(home.includes('AIO Finance is currently preparing for beta testing.'));
assert.ok(home.includes('Fictional figures'));
assert.ok(privacy.includes('id="policy-information"')&&privacy.includes('id="policy-retention"'));
assert.ok(support.includes('aiofinancesupport@gmail.com')&&support.includes('request a feature'));
const js=read('app.js');assert.ok(!/fetch\(|XMLHttpRequest|localStorage|document.cookie|sendBeacon|WebSocket/.test(js));
const config=JSON.parse(fs.readFileSync(path.join(root,'site.config.json'),'utf8').replace(/^\uFEFF/,''));
if(config.privacyEffectiveDate===null){assert.ok(!privacy.includes('Effective date:')&&!privacy.includes('class="policy-status"'));const result=spawnSync(process.execPath,[path.join(root,'scripts/build.mjs'),'--publish'],{encoding:'utf8'});assert.notEqual(result.status,0);assert.ok(result.stderr.includes('Publication blocked'));}
const total=expected.reduce((sum,p)=>sum+fs.statSync(path.join(out,p)).size,0);assert.ok(total<200000);
console.log('PASS: build artifact allowlist, shared content, routes and fragments, navigation, privacy wording, no placeholders, assets, no trackers, and publication-date guard. '+total+' bytes total.');
