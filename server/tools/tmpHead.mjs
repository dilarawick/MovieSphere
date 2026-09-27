import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __d = path.dirname(fileURLToPath(import.meta.url));
const envText = fs.readFileSync(path.join(__d, '..', '.env'), 'utf8');
const env = Object.fromEntries(envText.split(/\r?\n/).filter((l) => l.includes('=')).map((l) => {
  const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
}));
const KEY = env.TMDB_API_KEY;
// Verify ALL posterFix4 art paths (HEAD check image.tmdb.org) + fetch canonical movie details for the corrected ids
const FIX = JSON.parse(fs.readFileSync(path.join(__d, 'fixPayload.json'), 'utf8'));
const urls = [...new Set(Object.values(FIX).flat())];
console.log('HEAD-checking ' + urls.length + ' urls');
for (const u of urls) {
  try {
    const h = await fetch(u, { method: 'HEAD' });
    if (h.status !== 200) console.log('BAD ' + h.status + ' ' + u);
  } catch (e) { console.log('ERR ' + u); }
}
console.log('all-200-ok (only BAD lines above = failures)');
