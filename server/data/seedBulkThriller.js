import { p } from './watchProviders.js';
const BD = 'https://image.tmdb.org/t/p/original/h8gHn0OzBoaefsYseUByqsmEDMY.jpg';
const PH = (t) => 'https://placehold.co/500x750/2b0d0d/FFF?text=' + encodeURIComponent(t);
function mk(rows) {
  return rows.map((r) => ({
    tmdbId: r[0], title: r[1], year: r[2], imdb: r[3],
    duration: '2h 5m', maturity: 'R', quality: '4K',
    genres: r[4], overview: r[5], cast: [r[6]], director: r[7],
    poster: PH(r[1]), backdrop: BD, trending: !!r[8],
    language: 'en', languageLabel: 'English', mediaType: 'movie',
    streamType: 'youtube-search', source: 'youtube-legal',
    license: 'All rights reserved - trailer only',
    watchNote: r[9],
    curatedProviders: { flatrate: p(...(r[10] || [])), rent: p('prime', 'apple'), buy: p('prime', 'apple') },
  }));
}
export const BULK_THRILLER = mk([
[1100099, 'Argylle', 2024, 5.6, ['Action','Comedy','Thriller'], 'A spy novelist dragged into real espionage.', 'Bryce Dallas Howard', 'Matthew Vaughn', 0, 'Stream on Apple TV+. Rent on Prime Video.', ['apple']],
[1055401, 'Dark Harvest', 2023, 5.2, ['Horror','Thriller'], 'A town sacrifices teens to a monster.', 'Casey Likes', 'David Slade', 0, 'Stream on Prime Video.', ['prime']],
[645061, 'The Exorcist: Believer', 2023, 5.0, ['Horror'], 'Two girls possessed at once.', 'Leslie Odom Jr', 'David Gordon Green', 0, 'Stream on Peacock. Rent on Prime Video.', ['peacock']],
[961422, 'Insidious: The Red Door', 2023, 5.7, ['Horror','Thriller'], 'The Lamberts face the Further again.', 'Patrick Wilson', 'Patrick Wilson', 0, 'Stream on Netflix. Rent on Prime Video.', ['netflix']],
[1006462, 'The Iron Claw', 2023, 7.5, ['Drama','Sport'], 'The tragic Von Erich wrestling family.', 'Zac Efron', 'Sean Durkin', 0, 'Stream on Max. Rent on Prime Video.', ['max']],
[1028723, 'The Holdovers', 2023, 7.9, ['Comedy','Drama'], 'A teacher stuck with students at Christmas.', 'Paul Giamatti', 'Alexander Payne', 0, 'Stream on Prime Video.', ['prime']],
[467244, 'The Zone of Interest', 2023, 7.4, ['Drama','History'], 'A Nazi family lives beside Auschwitz. Oscar winner.', 'Sandra Huller', 'Jonathan Glazer', 0, 'Stream on Max. Rent on Prime Video.', ['max']],
[915935, 'Anatomy of a Fall', 2023, 7.7, ['Drama','Thriller'], 'A wife on trial for her husband death. Oscar winner.', 'Sandra Huller', 'Justine Triet', 0, 'Stream on Hulu. Rent on Prime Video.', ['hulu']],
]);
