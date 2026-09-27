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
const ids = [
  [519182,'Despicable Me 4'],[762509,'Mufasa'],[402431,'Wicked'],[533535,'Deadpool&Wolverine'],
  [889737,'Joker2'],[1114513,'SpeakNoEvil24'],[646683,'The Exorcism'],[1062215,'Afraid'],
  [1205229,'Zoopocalypse'],[786892,'Furiosa'],[653346,'Apes'],[575264,'MI7'],[667538,'Transformers'],
  [298618,'Flash'],[346698,'Barbie'],[980489,'GranTurismo'],[678512,'SoundFreedom'],[609681,'Marvels'],
  [1011985,'KFP4'],[746036,'FallGuy'],[787699,'Wonka'],[572802,'Aquaman2'],[967847,'Ghostbusters'],
  [937287,'Challengers'],[974635,'HitMan'],[929590,'CivilWar'],[1086747,'Watchers'],[1087388,'Sting'],
  [869291,'Cuckoo'],[1010600,'Strangers1'],[1072342,'NightSwim'],[1225377,'MouseTrap'],[1008409,'BikeRiders'],
  [639720,'IF'],[940551,'Migration'],[848538,'Argylle'],[675531,'DarkHarvest'],[807172,'ExorcistBeliever'],
  [614479,'InsidiousRedDoor'],[850165,'IronClaw'],[840430,'Holdovers'],[467244,'Zone'],[915935,'Anatomy'],
  [912649,'Venom3'],[1022796,'Wish'],[603692,'JW4'],[823464,'InsideOut2-fix-check'],
];
let payload = {};
for (const [id, t] of ids) {
  try {
    const r = await fetch('https://api.themoviedb.org/3/movie/' + id + '?api_key=' + KEY);
    const j = await r.json();
    if (!j.title) { console.log(id + ' [' + t + '] NOTFOUND'); await sleep(100); continue; }
    payload[t] = { id, title: j.title, adult: j.adult, p: j.poster_path, b: j.backdrop_path };
    console.log(id + ' [' + t + '] => ' + j.title + ' adult=' + j.adult + ' p=' + j.poster_path + ' b=' + j.backdrop_path);
  } catch (e) { console.log(id + ' [' + t + '] ERR'); }
  await sleep(100);
}
fs.writeFileSync(path.join(__d, 'fixPayload.json'), JSON.stringify(payload, null, 1));
console.log('wrote fixPayload.json');
