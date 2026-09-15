// TV + classic poster fixes (verified TMDB paths).
export const POSTER_FIX2 = {
  'Stranger Things': ['49WJfeN0moxb9IPfGn8AIqMGskD.jpg', '56v2KjBlU4XaOv9rVYEQypROD7P.jpg'],
  'Wednesday': ['9PFonBhy4cQy7Jz20NpMygczOkv.jpg', 'iHSwvRVsRyxpX7FE7GbviaDvgGZ.jpg'],
  'The Last of Us': ['uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg', 'uDgy6hyPd82kOHh6I95FLtLnj6p.jpg'],
  'House of the Dragon': ['z2yahl2uefxDCl0nogcRBstwruJ.jpg', 'etj8E2o0Bud0HkONVQPjyCkIvpv.jpg'],
  'Squid Game': ['dDlEmu3EZ0Pgg93K2SVNLCjCSvE.jpg', 'oaGvjBfhGwTtJ7kBan3qyuq9BmW.jpg'],
  'Breaking Bad': ['ggFHVNu6YYI5L9pCfOacjizRGt.jpg', 'tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg'],
  'Late Night with the Devil': ['u8kPLi8Uuf5slYPezf2QlhHxgiC.jpg', 'xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg'],
  'Barbie': ['iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg', 'nHf61UzkfFno5X1ofIhugCPus2R.jpg'],
  'Barbie Alt': ['iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg', 'nHf61UzkfFno5X1ofIhugCPus2R.jpg'],
  'Joker': ['udDclJoHjfjb8Ekgsd4FDteOkCU.jpg', 'n6bUvigpRFqSwmPp1m2YADdbRBc.jpg'],
  'Guardians of the Galaxy Vol. 3': ['r2J02Z2OpNTctfOSN1Ydgii51I3.jpg', '5YZbUmjbMa3ClvSW1Wj3D6XGolb.jpg'],
  'Furiosa: A Mad Max Saga': ['iADOJ8Zymht2JPMoy3R7xceZprc.jpg', 'wNAhuOZ3Zf84jCIlrcI6JhgmYkv.jpg'],
  'Furiosa: A Mad Max Saga Alt': ['iADOJ8Zymht2JPMoy3R7xceZprc.jpg', 'wNAhuOZ3Zf84jCIlrcI6JhgmYkv.jpg'],
  'Kingdom of the Planet of the Apes': ['gKkl37BQuKTanygYQG1pyYgLVgf.jpg', 'fypydCipcLVUDLINhvjOaHMPKP3.jpg'],
  'Kingdom of the Planet of the Apes Alt': ['gKkl37BQuKTanygYQG1pyYgLVgf.jpg', 'fypydCipcLVUDLINhvjOaHMPKP3.jpg'],
  'The Fall Guy': ['tSz1qsmSJon0rqjHBxXZmrotuse.jpg', 'H5HjE7XZKne1reKCqq7ZTP908pp.jpg'],
  'Godzilla x Kong': ['z1p34vh7dEOnLDmyCrlUVLuoDzd.jpg', 'j3J3cW9jS8WXsEMznXYqvIT5SZi.jpg'],
  'Kung Fu Panda 4': ['kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg', '1XDDXPXGiI8id7MrUxK36ke7gk.jpg'],
};
export function applyPosterFix2(list) {
  return list.map((m) => {
    const fix = POSTER_FIX2[m.title];
    if (!fix) return m;
    const out = { ...m };
    if (!out.poster || out.poster.includes('placehold.co')) out.poster = 'https://image.tmdb.org/t/p/w500/' + fix[0];
    if (!out.backdrop || out.backdrop.includes('placehold.co')) out.backdrop = 'https://image.tmdb.org/t/p/original/' + fix[1];
    return out;
  });
}
