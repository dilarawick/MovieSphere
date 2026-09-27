import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __d = path.dirname(fileURLToPath(import.meta.url));
const envText = fs.readFileSync(path.join(__d, '..', '.env'), 'utf8');
const env = Object.fromEntries(envText.split(/\r?\n/).filter((l) => l.includes('=')).map((l) => {
  const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
}));
const KEY = env.TMDB_API_KEY;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
// Part A: audit ids NOT checked yet
const rest = [
  [1094844,'Godzilla x Kong'],[746036,'The Fall Guy'],[787699,'Wonka'],[1194915,'Challengers'],
  [1096197,'Late Night with the Devil'],[1118032,'Smile 2'],[933260,'The Substance'],[1114894,'Nosferatu'],
  [1184918,'Heretic'],[1034541,'Terrifier 3'],[1226578,'Longlegs'],[1054899,'A Quiet Place: Day One'],
  [1010600,'The First Omen (seed)'],[1138194,'The End of Oak Street'],[694,'The Shining'],[423108,'Get Out'],
  [496243,'Parasite'],[381288,'Split'],[493922,'Hereditary'],[1085453,'Evil Dead Rise'],[1008042,'Talk to Me'],
  [1049817,'M3GAN'],[1029575,'The Nun II'],[762441,'A Quiet Place Part II'],[1079091,'It Ends with Us'],
  [365177,'Borderlands'],[974453,'Alien: Romulus'],[940139,'House of Spoils'],[1124641,'The Deliverance'],
  [1114738,'Boneyard'],[987686,'A Family Affair'],[1104845,'The Long Game'],[805509,'Back to Black'],
  [1051891,'Thelma'],[1100099,'Argylle'],[1055401,'Dark Harvest'],[645061,'The Exorcist: Believer'],
  [961422,'Insidious: The Red Door'],[1006462,'The Iron Claw'],[1028723,'The Holdovers'],[467244,'Zone of Interest'],
  [915935,'Anatomy of a Fall'],[603692,'John Wick 4'],[519182,'Despicable Me 4'],[748783,'Garfield'],
  [976573,'Elemental'],[502356,'Mario Bros'],[695721,'Ballad of Songbirds'],[901362,'Trolls 3'],
  [507089,'Five Nights at Freddys'],[884605,'No Hard Feelings'],[786892,'Furiosa'],[653346,'Apes Kingdom'],
  [575264,'MI Dead Reckoning'],[667538,'Transformers ROTB'],[298618,'The Flash'],[346698,'Barbie'],
  [980489,'Gran Turismo'],[678512,'Sound of Freedom'],[609681,'The Marvels'],[889737,'Joker 2'],
  [646683,'The Exorcism'],[1205229,'Zoopocalypse'],[939243,'Sonic 3'],[558449,'Gladiator II'],
  [1241982,'Moana 2'],[1064213,'Anora'],[402431,'Wicked'],
];
for (const [id, t] of rest) {
  try {
    const r = await fetch('https://api.themoviedb.org/3/movie/'+id+'?api_key='+KEY+'&language=en-US');
    const j = await r.json();
    const norm = (s) => (s||'').toLowerCase().replace(/[^a-z0-9]/g,'');
    const ok = j.title && (norm(j.title).includes(norm(t).slice(0,6)) || norm(t).includes(norm(j.title).slice(0,6)));
    const flag = (!j.title) ? 'NOTFOUND' : (j.adult ? 'ADULT!!!' : (ok ? 'ok' : 'MISMATCH'));
    console.log(flag+' | '+t+' id='+id+' => '+(j.title||j.status_message)+' p='+j.poster_path+' b='+j.backdrop_path);
  } catch(e) { console.log('ERR '+id); }
  await sleep(110);
}
// Part B: Bike Riders search variants
for (const q of ['Bike Riders', 'The Bikeriders']) {
  const u = 'https://api.themoviedb.org/3/search/movie?api_key='+KEY+'&query='+encodeURIComponent(q)+'&include_adult=false';
  const r = await fetch(u); const j = await r.json();
  console.log('SEARCH '+q+' total='+j.total_results);
  (j.results||[]).slice(0,4).forEach((x)=>console.log('   '+x.id+' | '+x.title+' | '+x.release_date+' | p='+x.poster_path+' | b='+x.backdrop_path));
  await sleep(120);
}
