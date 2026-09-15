// Bulk HORROR pack (20). Compact tuples -> full objects.
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
export const BULK_HORROR = mk([
[1138194, 'The End of Oak Street', 2024, 5.8, ['Horror','Thriller'], 'A woman haunted after moving to Oak Street.', 'Becca Hirani', 'Victor Jasseron', 1, 'Rent on Prime Video, Apple TV.', []],
[1096197, 'Late Night with the Devil', 2024, 7.0, ['Horror'], 'A 1977 live TV show turns demonic.', 'David Dastmalchian', 'Cairnes Bros', 1, 'Stream on Shudder. Rent on Prime Video.', ['hulu']],
[1118032, 'Smile 2', 2024, 6.8, ['Horror','Thriller'], 'Pop star stalked by the smile curse.', 'Naomi Scott', 'Parker Finn', 1, 'Stream on Paramount+. Rent on Prime Video.', ['paramount']],
[933260, 'The Substance', 2024, 7.3, ['Horror','Drama'], 'A fading star tries a youth serum. Oscar winner.', 'Demi Moore', 'Coralie Fargeat', 1, 'Stream on Hulu. Rent on Prime Video.', ['hulu']],
[1114894, 'Nosferatu', 2024, 7.2, ['Horror','Fantasy'], 'Eggers remake of the vampire classic.', 'Bill Skarsgard', 'Robert Eggers', 1, 'Stream on Peacock. Rent on Prime Video.', ['peacock']],
[1184918, 'Heretic', 2024, 7.0, ['Horror','Thriller'], 'Missionaries trapped by a scholar.', 'Hugh Grant', 'Beck Woods', 0, 'Stream on Max. Rent on Prime Video.', ['max']],
[1034541, 'Terrifier 3', 2024, 6.9, ['Horror'], 'Art the Clown Christmas massacre.', 'David H Thornton', 'Damien Leone', 1, 'Rent on Prime Video, Apple TV.', []],
[1226578, 'Longlegs', 2024, 6.7, ['Horror','Crime'], 'FBI agent hunts an occult killer.', 'Nicolas Cage', 'Osgood Perkins', 1, 'Stream on Hulu. Rent on Prime Video.', ['hulu']],
[1054899, 'A Quiet Place: Day One', 2024, 6.3, ['Horror','Sci-Fi'], 'First invasion day in New York.', 'Lupita Nyongo', 'Michael Sarnoski', 0, 'Stream on Paramount+. Rent on Prime Video.', ['paramount']],
[1010600, 'The First Omen', 2024, 6.5, ['Horror'], 'Prequel to the Omen curse.', 'Nell Tiger Free', 'Arkasha Stevenson', 0, 'Stream on Hulu. Rent on Prime Video.', ['hulu']],
]);
