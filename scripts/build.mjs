import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const out=path.join(root,'dist');
const read=name=>fs.readFileSync(path.join(root,name),'utf8').replace(/^\uFEFF/,'');
const config=JSON.parse(read('site.config.json'));
const date=config.privacyEffectiveDate;
const validDate=typeof date==='string' && /^\d{4}-\d{2}-\d{2}$/.test(date) && Number.isFinite(Date.parse(date)) && new Date(date).toISOString().slice(0,10)===date;
if(date!==null && !validDate) throw Error('privacyEffectiveDate must be null or a real YYYY-MM-DD date.');
if(process.argv.includes('--publish') && !validDate) throw Error('Publication blocked: set the actual policy effective date after owner approval.');
const effective=validDate?'<p class="policy-status">Effective '+new Intl.DateTimeFormat('en-US',{year:'numeric',month:'long',day:'numeric',timeZone:'UTC'}).format(new Date(date+'T12:00:00Z'))+'</p>':'';
const shell=read('src/index.html'), support=read('src/support.html');
const pages=[['home','',read('src/home.html').replace('<!-- SUPPORT -->',support),'AIO Finance — A clearer financial perspective'],['privacy','privacy',read('src/privacy.html').replace('<!-- EFFECTIVE_DATE -->',effective),'Privacy Policy — AIO Finance'],['support','support',support.replace('<h2 id="support-title" tabindex="-1">','<h1 id="support-title" tabindex="-1">').replace('A better perspective.</h2>','A better perspective.</h1>'),'Support — AIO Finance']];
fs.mkdirSync(path.join(out,'assets'),{recursive:true});
for(const name of ['styles.css','app.js'])fs.copyFileSync(path.join(root,'src',name),path.join(out,name));
for(const name of ['icon-64.png','icon-180.png'])fs.copyFileSync(path.join(root,'src/assets',name),path.join(out,'assets',name));
for(const [entry,folder,content,title] of pages){
  const target=path.join(out,folder);fs.mkdirSync(target,{recursive:true});
  let html=shell.replace('<!-- PAGE_BASE -->',folder?'<base href="../">':'').replace('<!-- PAGE_TITLE -->',title).replace('<!-- PAGE_ENTRY -->',entry).replace('<!-- PAGE_CONTENT -->',content);
  if(folder)html=html.replace(/href="#/g,'href="'+folder+'/#');
  if(entry!=='home')html=html.replace('href="'+entry+'/">','href="'+entry+'/" aria-current="page">');
  if(/<!--|Prepublication|Website preview|to be set when|must be finalized before publication/i.test(html))throw Error('Unresolved public content in '+entry);
  fs.writeFileSync(path.join(target,'index.html'),html);
}
fs.writeFileSync(path.join(out,'.nojekyll'),'');
fs.writeFileSync(path.join(out,'404.html'),'<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found — AIO Finance</title><h1>Page not found</h1><p><a href="/">Return to AIO Finance</a></p></html>');
console.log('Built static website locally. Effective date '+(validDate?'configured.':'omitted from local preview; publication blocked.'));
