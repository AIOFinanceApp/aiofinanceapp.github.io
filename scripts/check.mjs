import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),out=path.join(root,'dist');
const expected=['.nojekyll','404.html','app.js','assets/icon-180.png','assets/icon-64.png','index.html','privacy/index.html','styles.css','support/index.html','features/index.html','product.css','product.js','reports.js','themes.js','robots.txt','sitemap.xml',...["assets/product/coastal-pearl-assets.webp","assets/product/coastal-pearl-budget.webp","assets/product/coastal-pearl-home.webp","assets/product/coastal-pearl-planning.webp","assets/product/dollar-dark-assets.webp","assets/product/dollar-dark-budget.webp","assets/product/dollar-dark-home.webp","assets/product/dollar-dark-planning.webp","assets/product/dollar-light-assets.webp","assets/product/dollar-light-budget.webp","assets/product/dollar-light-home.webp","assets/product/dollar-light-planning.webp","assets/product/graphite-titanium-assets.webp","assets/product/graphite-titanium-budget.webp","assets/product/graphite-titanium-home.webp","assets/product/graphite-titanium-planning.webp","assets/product/ivory-champagne-assets.webp","assets/product/ivory-champagne-budget.webp","assets/product/ivory-champagne-home.webp","assets/product/ivory-champagne-planning.webp","assets/product/midnight-aurora-assets.webp","assets/product/midnight-aurora-budget.webp","assets/product/midnight-aurora-home.webp","assets/product/midnight-aurora-planning.webp","assets/product/report-custom-statement.webp","assets/product/report-net-worth-statement.webp","assets/product/report-opportunity-comparison.webp","assets/product/report-rental-analysis.webp","assets/product/santorini-dark-assets.webp","assets/product/santorini-dark-budget.webp","assets/product/santorini-dark-business-results.webp","assets/product/santorini-dark-business.webp","assets/product/santorini-dark-debt.webp","assets/product/santorini-dark-dollar.webp","assets/product/santorini-dark-freedom-results.webp","assets/product/santorini-dark-freedom.webp","assets/product/santorini-dark-home.webp","assets/product/santorini-dark-life.webp","assets/product/santorini-dark-opportunity.webp","assets/product/santorini-dark-planning.webp","assets/product/santorini-dark-projection-results.webp","assets/product/santorini-dark-projection.webp","assets/product/santorini-dark-rental-results.webp","assets/product/santorini-dark-rental.webp","assets/product/santorini-dark-stress.webp","assets/product/santorini-light-assets.webp","assets/product/santorini-light-budget.webp","assets/product/santorini-light-home.webp","assets/product/santorini-light-planning.webp"]].sort();
function list(d,p=''){return fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?list(path.join(d,e.name),p+e.name+'/'):[p+e.name]);}
assert.deepEqual(list(out).sort(),expected,'Deployment allowlist');
const pages=['index.html','features/index.html','privacy/index.html','support/index.html'];
const read=file=>fs.readFileSync(path.join(out,file),'utf8');
for(const page of pages){
 const html=read(page),ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(ids.length,new Set(ids).size);assert.equal((html.match(/<h1\b/g)||[]).length,1);
 assert.ok(html.includes('lang="en"')&&html.includes('name="viewport"'));
 assert.ok(!/Prepublication|draft|placeholder|to be set|must be finalized|<!--|Beta information|Beta Access/i.test(html),'No public draft instructions or removed CTAs');
 assert.ok(!/<form\b|<iframe\b|<script[^>]+src="https:/i.test(html));
 assert.equal((html.match(/<nav[\s\S]*?<\/nav>/)||[''])[0].match(/<a /g)?.length,4);
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
for(const name of ['Your Entire Financial Picture','Opportunity Comparison','App Appearance'])assert.ok(home.includes(name));
const features=read('features/index.html');
for(const name of ['Financial Planning Tools','Opportunity Comparison','Financial Reports and Statements','Local Storage and Backups'])assert.ok(features.includes(name));
assert.ok(home.includes('fictional data'));
assert.ok(privacy.includes('id="policy-information"')&&privacy.includes('id="policy-retention"'));
assert.ok(support.includes('aiofinancesupport@gmail.com')&&support.includes('request a feature'));
const js=['app.js','product.js','reports.js','themes.js'].map(read).join('\n');assert.ok(!/fetch\(|XMLHttpRequest|localStorage|document.cookie|sendBeacon|WebSocket/.test(js));
const config=JSON.parse(fs.readFileSync(path.join(root,'site.config.json'),'utf8').replace(/^\uFEFF/,''));
if(config.privacyEffectiveDate===null){assert.ok(!privacy.includes('Effective date:')&&!privacy.includes('class="policy-status"'));const result=spawnSync(process.execPath,[path.join(root,'scripts/build.mjs'),'--publish'],{encoding:'utf8'});assert.notEqual(result.status,0);assert.ok(result.stderr.includes('Publication blocked'));}
const total=expected.reduce((sum,p)=>sum+fs.statSync(path.join(out,p)).size,0);assert.ok(total<3000000);
console.log('PASS: build artifact allowlist, shared content, routes and fragments, navigation, privacy wording, no placeholders, assets, no trackers, and publication-date guard. '+total+' bytes total.');
