// Debug probe 2 — find poster/backdrop img patterns on movie pages.
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126.0 Safari/537.36';
const get = (u) => fetch(u, { headers: { 'User-Agent': UA } }).then((r) => r.text());

for (const id of [1084244, 694, 1176142]) {
  const html = await get(`https://www.themoviedb.org/movie/${id}`);
  console.log(`\n===== movie ${id} =====`);
  console.log('title tag:', html.match(/<title>([^<]*)</)?.[1]);
  const imgs = [...html.matchAll(/<img[^>]+>/g)].map((m) => m[0]).filter((t) => /\/t\/p\//.test(t));
  console.log('img tags with /t/p/ (first 4):');
  imgs.slice(0, 4).forEach((t) => console.log('  ', t.replace(/\s+/g, ' ').slice(0, 220)));
  console.log('h450 paths:', [...new Set([...html.matchAll(/\/t\/p\/([a-z0-9_]*h450[a-z0-9_]*)\/([A-Za-z0-9]+\.(?:jpg|png))/g)].map((m) => m[1] + '/' + m[2]))].slice(0, 3));
  console.log('h800 paths:', [...new Set([...html.matchAll(/\/t\/p\/([a-z0-9_]*h800[a-z0-9_]*)\/([A-Za-z0-9]+\.(?:jpg|png))/g)].map((m) => m[1] + '/' + m[2]))].slice(0, 3));
  console.log('og: meta tags:', [...html.matchAll(/<meta (?:property|name)="og:[^"]*"[^>]*>/g)].map((m) => m[0].replace(/\s+/g, ' ').slice(0, 160)));
}

