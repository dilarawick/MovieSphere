// Real TMDB poster/backdrop paths (verified IDs, image.tmdb.org CDN).
export const POSTER_FIX = {
  'Dune: Part Two': ['1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg', 'xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg'],
  'Oppenheimer': ['8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg', 'rLb2cwF3Pazuxaj0sRXQ037tGI1.jpg'],
  'Deadpool & Wolverine': ['8cdWjvZQUExUUTzyp4t6EDMubfO.jpg', 'yDHYTfA3R0jFYba16jBB1ef8oIt.jpg'],
  'John Wick: Chapter 4': ['vZloFAK7NmvMGKE7VkF5UHaz0I.jpg', 'h8gHn0OzBoaefsYseUByqsmEDMY.jpg'],
  'Inside Out 2': ['vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg', 'stKGOm8UyhuLPR9sZLjs5AkmncA.jpg'],
  'Top Gun: Maverick': ['62HCnUTziyWcpDaBO2i1DX17ljH.jpg', 'odJ4hx6g6vBt4lBWKFD1tI8WS4x.jpg'],
  'The Batman': ['74xTEgt7R36Fpooo50r9T25onhq.jpg', 'b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg'],
  'Interstellar': ['gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', 'xJHokMpbjvUPC9xJ5BKQcEMVBB.jpg'],
  'Inception': ['9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg', 's3TBrRGB1iav7gFOCNx3H31MoES.jpg'],
  'Sonic the Hedgehog 3': ['d8Ryb8AunYAuycVKDpNHPuWPKHT.jpg', 'zOpe0eHsq0A2NvNyBbtT6BipXoE.jpg'],
  'Venom: The Last Dance': ['aosm8NMQ3UyoBVpSxyimorCQykC.jpg', '3V4kLQg0kSqPLctI5ziYWabAZYF.jpg'],
  'Gladiator II': ['2cxhvwyEwRlysAmRH4iodkvo0z5.jpg', 'euYIwmwkmz95mnXvufEmbL6ovhZ.jpg'],
  'Moana 2': ['aLVkiINlIeCkcZIzb7XHzPYgO6L.jpg', 'tElnmtQ6yz1PjN1kePNl8s3od9e.jpg'],
  'Anora': ['qh8m8Udz0sCa70gy8dB5q3fnKhW.jpg', '4cp3l8U8A0AgRwFGHznpRATpM3F.jpg'],
  'Across the Spider-Verse': ['8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg', '4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg'],
  'Avatar: The Way of Water': ['t6HIqrRAclMCA60NsSmeqe9RmNV.jpg', 's16H6tpK2utvwDtzZ8Qy4qm5Emw.jpg'],
};
export function applyPosterFix(list) {
  return list.map((m) => {
    const fix = POSTER_FIX[m.title];
    if (!fix) return m;
    const out = { ...m };
    if (!out.poster || out.poster.includes('placehold.co')) out.poster = 'https://image.tmdb.org/t/p/w500/' + fix[0];
    if (!out.backdrop || out.backdrop.includes('placehold.co')) out.backdrop = 'https://image.tmdb.org/t/p/original/' + fix[1];
    return out;
  });
}
