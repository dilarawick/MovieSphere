import { p } from './watchProviders.js';
const BD = 'https://image.tmdb.org/t/p/original/rLb2cwF3Pazuxaj0sRXQ037tGI1.jpg';
const PH = (t) => 'https://placehold.co/500x750/241a08/FFF?text=' + encodeURIComponent(t);
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
export const BULK_FAMILY = mk([
[1079091, 'It Ends with Us', 2024, 6.5, ['Drama','Romance'], 'Lily torn between Ryle and Atlas.', 'Blake Lively', 'Justin Baldoni', 1, 'Stream on Netflix. Rent on Prime Video.', ['netflix']],
[365177, 'Borderlands', 2024, 5.7, ['Action','Sci-Fi','Comedy'], 'Vault hunters on Pandora.', 'Cate Blanchett', 'Eli Roth', 0, 'Rent on Prime Video, Apple TV.', []],
[974453, 'Alien: Romulus', 2024, 7.1, ['Horror','Sci-Fi'], 'Young scavengers face the xenomorph.', 'Cailee Spaeny', 'Fede Alvarez', 1, 'Stream on Hulu. Rent on Prime Video.', ['hulu']],
[940139, 'House of Spoils', 2024, 5.4, ['Horror','Thriller'], 'A chef battles a haunted estate.', 'Ariana DeBose', 'Bridget Cole', 0, 'Stream on Prime Video.', ['prime']],
[1124641, 'The Deliverance', 2024, 5.5, ['Horror','Drama'], 'Family faces evil in their home.', 'Andra Day', 'Lee Daniels', 0, 'Stream on Netflix.', ['netflix']],
[1114738, 'Boneyard', 2024, 5.3, ['Thriller','Crime'], 'FBI hunts the Bone Collector killer.', 'Mel Gibson', 'Asif Akbar', 0, 'Rent on Prime Video, Apple TV.', []],
[987686, 'A Family Affair', 2024, 5.4, ['Comedy','Romance'], 'A assistant falls for a movie star.', 'Nicole Kidman', 'Richard LaGravenese', 0, 'Stream on Netflix.', ['netflix']],
[1104845, 'The Long Game', 2024, 7.0, ['Drama','Sport'], 'Mexican-American caddies win golf glory.', 'Jay Hernandez', 'Julio Quintana', 0, 'Stream on Netflix.', ['netflix']],
[805509, 'Back to Black', 2024, 6.3, ['Drama','Music'], 'Amy Winehouse rise and fall.', 'Marisa Abela', 'Sam Taylor-Johnson', 0, 'Stream on Peacock. Rent on Prime Video.', ['peacock']],
[1041619, 'Thelma', 2024, 7.0, ['Comedy','Action'], 'A 93-year-old hunts phone scammers.', 'June Squibb', 'Josh Margolin', 0, 'Stream on Hulu. Rent on Prime Video.', ['hulu']],
]);
