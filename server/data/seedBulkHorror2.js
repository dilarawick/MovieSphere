import { p } from './watchProviders.js';
const BD = 'https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg';
const PH = (t) => 'https://placehold.co/500x750/141428/FFF?text=' + encodeURIComponent(t);
function mk(rows) {
  return rows.map((r) => ({
    tmdbId: r[0], title: r[1], year: r[2], imdb: r[3],
    duration: '1h 45m', maturity: 'R', quality: 'HD',
    genres: r[4], overview: r[5], cast: [r[6]], director: r[7],
    poster: PH(r[1]), backdrop: BD, trending: !!r[8],
    language: 'en', languageLabel: 'English', mediaType: 'movie',
    streamType: 'youtube-search', source: 'youtube-legal',
    license: 'All rights reserved - trailer only',
    watchNote: r[9],
    curatedProviders: { flatrate: p(...(r[10] || [])), rent: p('prime', 'apple'), buy: p('prime', 'apple') },
  }));
}
export const BULK_HORROR2 = mk([
[694, 'The Shining', 1980, 8.4, ['Horror'], 'Jack Torrance descends at the Overlook. Kubrick classic.', 'Jack Nicholson', 'Stanley Kubrick', 0, 'Stream on Max. Rent on Prime Video.', ['max']],
[423108, 'Get Out', 2017, 7.8, ['Horror','Thriller'], 'A weekend trip turns sinister. Peele Oscar winner.', 'Daniel Kaluuya', 'Jordan Peele', 0, 'Rent on Prime Video, Apple TV.', []],
[496243, 'Parasite', 2019, 8.5, ['Thriller','Drama'], 'A poor family cons a rich household. Best Picture.', 'Song Kang-ho', 'Bong Joon Ho', 1, 'Stream on Max / Hulu. Rent on Prime Video.', ['max']],
[381288, 'Split', 2016, 7.3, ['Horror','Thriller'], 'A man with 23 personalities holds three girls.', 'James McAvoy', 'M Night Shyamalan', 0, 'Rent on Prime Video, Apple TV.', []],
[493922, 'Hereditary', 2018, 7.3, ['Horror','Drama'], 'A grieving family unravels a sinister fate.', 'Toni Collette', 'Ari Aster', 0, 'Stream on Max. Rent on Prime Video.', ['max']],
[1085453, 'Evil Dead Rise', 2023, 6.5, ['Horror'], 'Deadites terrorize a city apartment.', 'Lily Sullivan', 'Lee Cronin', 0, 'Stream on Max. Rent on Prime Video.', ['max']],
[1008042, 'Talk to Me', 2023, 7.1, ['Horror'], 'Teens conjure spirits with a hand.', 'Sophie Wilde', 'Danny Philippou', 0, 'Stream on Paramount+. Rent on Prime Video.', ['paramount']],
[1049817, 'M3GAN', 2023, 6.4, ['Horror','Sci-Fi'], 'A killer AI doll bonds with a girl.', 'Allison Williams', 'Gerard Johnstone', 0, 'Stream on Peacock. Rent on Prime Video.', ['peacock']],
[1029575, 'The Nun II', 2023, 6.7, ['Horror'], 'Sister Irene faces Valak in France.', 'Taissa Farmiga', 'Michael Chaves', 0, 'Stream on Max. Rent on Prime Video.', ['max']],
[762441, 'A Quiet Place Part II', 2021, 7.2, ['Horror','Thriller'], 'Abbott family faces new terrors.', 'Emily Blunt', 'John Krasinski', 0, 'Stream on Paramount+. Rent on Prime Video.', ['paramount']],
]);
