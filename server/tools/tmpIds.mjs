import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __d = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__d, '..', 'data');
const read = (f) => fs.readFileSync(path.join(dataDir, f), 'utf8');
const files = ['seedBulkBig.js','seedBulkBig2.js','seedBulkFinal.js','seedBulkComedy.js','seedBulkThriller.js','seed2026b.js','seedEnglish.js'];
let ids = [];
for (const f of files) {
  const t = read(f);
  for (const m of t.matchAll(/\[(\d{4,8}),\s*'([^']+)'/g)) ids.push({ id: m[1], title: m[2], file: f });
  for (const m of t.matchAll(/\btmdbId:\s*(\d+)[\s\S]{0,140}?title:\s*'([^']+)'/g)) ids.push({ id: m[1], title: m[2], file: f });
}
let out = 'id | file | seed-title\n';
for (const r of ids) out += r.id + ' | ' + r.file + ' | ' + r.title + '\n';
fs.writeFileSync(path.join(__d, 'ids.txt'), out);
console.log('wrote ids.txt with ' + ids.length);
