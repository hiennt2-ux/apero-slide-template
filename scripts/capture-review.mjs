import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
const session = process.argv[2] ?? 'stress-fixed';
const width = Number(process.argv[3] ?? 1920), height = Number(process.argv[4] ?? 1080);
const dir = width === 1920 ? 'review/after' : `review/${width}x${height}`;
mkdirSync(dir, { recursive: true });
const run = (...args) => execFileSync('agent-browser', ['--session',session,...args], { encoding:'utf8' });
run('set','viewport',String(width),String(height));
run('press','Home');
const audits = [];
const total = Number(run('eval', 'document.querySelector(".counter").textContent.split("/")[1].trim()').replace(/"/g,''));
for (let i=1;i<=total;i++) {
  await new Promise(resolve => setTimeout(resolve, 650));
  run('screenshot',`${process.cwd()}/${dir}/${String(i).padStart(2,'0')}.png`);
  let audit = JSON.parse(execFileSync('agent-browser', ['--session',session,'eval','--stdin'], { input:readFileSync('scripts/audit-slide.js','utf8'), encoding:'utf8' }));
  if (typeof audit === 'string') audit = JSON.parse(audit);
  audits.push({ page:i,...audit });
  if (i<total) run('press','ArrowRight');
}
writeFileSync(`${dir}/audit.json`, JSON.stringify(audits,null,2));
console.log(JSON.stringify({ width,height,pages:total,issues:audits.flatMap(a => a.issues.map(issue => ({page:a.page,...issue}))) },null,2));
