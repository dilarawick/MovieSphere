import { p } from './watchProviders.js';
const BD = 'https://image.tmdb.org/t/p/original/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg';
const PH = (t) => 'https://placehold.co/500x750/1a1040/FFF?text=' + encodeURIComponent(t);
function mk(rows) {
  return rows.map((r) => ({
    tmdbId: r[0], title: r[1], year: r[2], imdb: r[3],
    duration: '1h 50m', maturity: 'PG-13', quality: 'HD',
    genres: r[4], overview: r[5], cast: [r[6]], director: r[7],
    poster: PH(r[1]), backdrop: BD, trending: !!r[8],
    language: 'en', languageLabel: 'English', mediaType: 'movie',
    streamType: 'youtube-search', source: 'youtube-legal',
    license: 'All rights reserved - trailer only',
    watchNote: r[9],
    curatedProviders: { flatrate: p(...(r[10] || [])), rent: p('prime', 'apple'), buy: p('prime', 'apple') },
  }));
}
export const BULK_COMEDY = mk([
[1022789, 'IF', 2024, 6.5, ['Comedy','Family','Fantasy'], 'A girl sees abandoned imaginary friends.', 'Ryan Reynolds', 'John Krasinski', 0, 'Stream on Paramount+. Rent on Prime Video.', ['paramount']],
[748783, 'The Garfield Movie', 2024, 5.8, ['Animation','Comedy','Family'], 'Garfield reunites with his dad on a heist.', 'Chris Pratt', 'Mark Dindal', 0, 'Stream on Netflix. Rent on Prime Video.', ['netflix']],
[976573, 'Elemental', 2023, 7.0, ['Animation','Comedy'], 'Fire and water fall in love in Element City.', 'Leah Lewis', 'Peter Sohn', 0, 'Stream on Disney+. Rent on Prime Video.', ['disney']],
[502356, 'The Super Mario Bros. Movie', 2023, 7.0, ['Animation','Family','Comedy'], 'Mario and Luigi quest to save Peach.', 'Chris Pratt', 'Aaron Horvath', 0, 'Stream on Peacock. Rent on Prime Video.', ['peacock']],
[695721, 'The Hunger Games: Ballad of Songbirds', 2023, 6.9, ['Action','Drama'], 'Young Snow mentors Lucy Gray.', 'Tom Blyth', 'Francis Lawrence', 0, 'Stream on Peacock. Rent on Prime Video.', ['peacock']],
[901362, 'Trolls Band Together', 2023, 7.0, ['Animation','Comedy','Family'], 'Poppy and Branch rescue Floyd.', 'Anna Kendrick', 'Walt Dohrn', 0, 'Stream on Peacock. Rent on Prime Video.', ['peacock']],
[507089, 'Five Nights at Freddys', 2023, 5.9, ['Horror','Comedy'], 'Guard survives haunted animatronics.', 'Josh Hutcherson', 'Emma Tammi', 0, 'Stream on Peacock. Rent on Prime Video.', ['peacock']],
[884605, 'No Hard Feelings', 2023, 6.4, ['Comedy','Romance'], 'A woman hired to date a shy teen.', 'Jennifer Lawrence', 'Gene Stupnitsky', 0, 'Stream on Netflix. Rent on Prime Video.', ['netflix']],
[1061181, 'Migration', 2023, 6.4, ['Animation','Comedy','Family'], 'Duck family migrates to Jamaica.', 'Kumail Nanjiani', 'Benjamin Renner', 0, 'Stream on Peacock. Rent on Prime Video.', ['peacock']],
]);
