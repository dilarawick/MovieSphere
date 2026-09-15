import { p } from './watchProviders.js';
const BD = 'https://image.tmdb.org/t/p/original/stKGOm8UyhuLPR9sZLjs5AkmncA.jpg';
const PH = (t) => 'https://placehold.co/500x750/0d2b1d/FFF?text=' + encodeURIComponent(t);
function mk(rows) {
  return rows.map((r) => ({
    tmdbId: r[0], title: r[1], year: r[2], imdb: r[3],
    duration: '2h 0m', maturity: 'PG-13', quality: '4K',
    genres: r[4], overview: r[5], cast: [r[6]], director: r[7],
    poster: PH(r[1]), backdrop: BD, trending: !!r[8],
    language: 'en', languageLabel: 'English', mediaType: 'movie',
    streamType: 'youtube-search', source: 'youtube-legal',
    license: 'All rights reserved - trailer only',
    watchNote: r[9],
    curatedProviders: { flatrate: p(...(r[10] || [])), rent: p('prime', 'apple'), buy: p('prime', 'apple') },
  }));
}
export const BULK_BIG = mk([
[519182, 'Despicable Me 4', 2024, 7.1, ['Animation','Family','Comedy'], 'Gru faces Maxime Le Mal with the Mega Minions.', 'Steve Carell', 'Chris Renaud', 1, 'Stream on Peacock. Rent on Prime Video.', ['peacock']],
[1212073, 'Mufasa: The Lion King', 2024, 6.6, ['Animation','Family','Adventure'], 'Young Mufasa rises to legend.', 'Aaron Pierre', 'Barry Jenkins', 1, 'Stream on Disney+. Rent on Prime Video.', ['disney']],
[402431, 'Wicked: Part One', 2024, 7.3, ['Fantasy','Romance','Drama'], 'Elphaba and Glinda before Oz.', 'Cynthia Erivo', 'Jon M Chu', 1, 'Stream on Peacock. Rent on Prime Video.', ['peacock']],
  [1061692, 'Deadpool and Wolverine (Alt Art)', 2024, 7.7, ['Action','Comedy'], 'Alt poster pack - same film as starter entry.', 'Ryan Reynolds', 'Shawn Levy', 0, 'Stream on Disney+. Rent on Prime Video.', ['disney']],
  [889737, 'Joker: Folie a Deux', 2024, 5.2, ['Crime','Drama'], 'Joker meets Harley in Arkham.', 'Joaquin Phoenix', 'Todd Phillips', 0, 'Stream on Max. Rent on Prime Video.', ['max']],
  [1087215, 'Speak No Evil', 2024, 6.7, ['Horror','Thriller'], 'A family weekend turns sinister.', 'James McAvoy', 'James Watkins', 0, 'Stream on Peacock. Rent on Prime Video.', ['peacock']],
  [646683, 'The Exorcism', 2024, 5.1, ['Horror'], 'A cursed film set possesses its star.', 'Russell Crowe', 'Joshua John Miller', 0, 'Rent on Prime Video, Apple TV.', []],
  [1134058, 'Afraid', 2024, 5.4, ['Horror','Sci-Fi'], 'An AI assistant turns on a family.', 'John Cho', 'Chris Weitz', 0, 'Rent on Prime Video, Apple TV.', []],
  [1205229, 'Night of the Zoopocalypse', 2024, 6.2, ['Animation','Family'], 'Zoo animals fight a meteor virus.', 'David Harbour', 'Ricardo Curtis', 0, 'Rent on Prime Video.', []],
]);
