import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __d = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__d, '..', 'data');
const envText = fs.readFileSync(path.join(__d, '..', '.env'), 'utf8');
const env = Object.fromEntries(envText.split(/\r?\n/).filter((l) => l.includes('=')).map((l) => {
  const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
}));
const KEY = (env.TMDB_API_KEY || '').trim();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
// Verify remaining stored tmdb ids: any ADULT or MISMATCH or NOTFOUND?
const toCheck = [
  ['movie', 402431, 'Wicked: Part One'], ['movie', 889737, 'Joker: Folie a Deux'],
  ['movie', 646683, 'The Exorcism'], ['movie', 1205229, 'Night of the Zoopocalypse'],
  ['movie', 519182, 'Despicable Me 4'], ['movie', 786892, 'Furiosa Alt'],
  ['movie', 653346, 'Apes Alt'], ['movie', 575264, 'MI Dead Reckoning'],
  ['movie', 667538, 'Transformers'], ['movie', 298618, 'The Flash'],
  ['movie', 346698, 'Barbie Alt'], ['movie', 980489, 'Gran Turismo'],
  ['movie', 678512, 'Sound of Freedom'], ['movie', 609681, 'The Marvels'],
  ['movie', 748783, 'Garfield'], ['movie', 976573, 'Elemental'],
  ['movie', 502356, 'Mario'], ['movie', 695721, 'Ballad'],
  ['movie', 901362, 'Trolls'], ['movie', 507089, 'FNAF'],
  ['movie', 884605, 'No Hard Feelings'], ['movie', 1011985, 'Kung Fu Panda 4'],
  ['movie', 746036, 'Fall Guy'], ['movie', 787699, 'Wonka'],
  ['movie', 572802, 'Aquaman 2'], ['movie', 967847, 'Ghostbusters'],
  ['movie', 937287, 'Challengers'], ['movie', 974635, 'Hit Man'],
  ['movie', 939243, 'Sonic 3'], ['movie', 558449, 'Gladiator II'],
  ['movie', 1241982, 'Moana 2'], ['movie', 1064213, 'Anora'],
  ['movie', 693134, 'Dune 2'], ['movie', 872585, 'Oppenheimer'],
  ['movie', 533535, 'Deadpool'], ['movie', 603692, 'JW4'],
  ['movie', 1022789, 'Inside Out 2'], ['movie', 361743, 'Top Gun'],
  ['movie', 414906, 'Batman'], ['movie', 569094, 'Spider-Verse'],
  ['movie', 76600, 'Avatar 2'], ['movie', 157336, 'Interstellar'],
  ['movie', 27205, 'Inception'],
  ['tv', 66732, 'Stranger Things'], ['tv', 119051, 'Wednesday'],
  ['tv', 100088, 'Last of Us'], ['tv', 94997, 'HOTD'],
  ['tv', 1396, 'Breaking Bad'],
];
for (const [kind, id, label] of toCheck) {
  const r = await fetch('https://api.themoviedb.org/3/' + kind + '/' + id + '?api_key=' + KEY);
  const j = await r.json();
  const nm = j.title || j.name || j.status_message;
  console.log((j.adult ? 'ADULT!!! ' : '') + label + ' [' + kind + ':' + id + '] => ' + nm + ' adult=' + j.adult + ' p=' + j.poster_path + ' b=' + j.backdrop_path);
  await sleep(120);
}
