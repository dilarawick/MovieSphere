import { p } from './watchProviders.js';
const BD = 'https://image.tmdb.org/t/p/original/s16H6tpK2utvwDtzZ8Qy4qm5Emw.jpg';
const PH = (t) => 'https://placehold.co/500x750/101a2e/FFF?text=' + encodeURIComponent(t);
function mk(rows) {
  return rows.map((r) => ({
    tmdbId: r[0], title: r[1], year: r[2], imdb: r[3],
    duration: '1h 55m', maturity: 'PG-13', quality: '4K',
    genres: r[4], overview: r[5], cast: [r[6]], director: r[7],
    poster: PH(r[1]), backdrop: BD, trending: !!r[8],
    language: 'en', languageLabel: 'English', mediaType: 'movie',
    streamType: 'youtube-search', source: 'youtube-legal',
    license: 'All rights reserved - trailer only',
    watchNote: r[9],
    curatedProviders: { flatrate: p(...(r[10] || [])), rent: p('prime', 'apple'), buy: p('prime', 'apple') },
  }));
}
export const BULK_FINAL = mk([
[1011985, 'Kung Fu Panda 4', 2024, 7.1, ['Animation','Action','Comedy'], 'Po trains a new Dragon Warrior.', 'Jack Black', 'Mike Mitchell', 1, 'Stream on Peacock. Rent on Prime Video.', ['peacock']],
[1094844, 'Godzilla x Kong: The New Empire', 2024, 7.1, ['Action','Sci-Fi'], 'Godzilla and Kong unite in Hollow Earth.', 'Rebecca Hall', 'Adam Wingard', 1, 'Stream on Max. Rent on Prime Video.', ['max']],
[746036, 'The Fall Guy', 2024, 7.0, ['Action','Comedy'], 'A stuntman hunts a missing star.', 'Ryan Gosling', 'David Leitch', 1, 'Stream on Peacock. Rent on Prime Video.', ['peacock']],
[787699, 'Wonka', 2023, 7.0, ['Comedy','Family'], 'Young Wonka musical origin story.', 'Timothee Chalamet', 'Paul King', 0, 'Stream on Max. Rent on Prime Video.', ['max']],
[1029576, 'Wish', 2023, 5.6, ['Animation','Family'], 'Asha wishes on a star for Rosas.', 'Ariana DeBose', 'Chris Buck', 0, 'Stream on Disney+. Rent on Prime Video.', ['disney']],
[572802, 'Aquaman and the Lost Kingdom', 2023, 5.7, ['Action','Adventure'], 'Arthur teams with Orm against Black Manta.', 'Jason Momoa', 'James Wan', 0, 'Stream on Max / Netflix. Rent on Prime Video.', ['max']],
[1211951, 'Ghostbusters: Frozen Empire', 2024, 6.1, ['Action','Comedy'], 'New and old busters freeze NYC.', 'Paul Rudd', 'Gil Kenan', 0, 'Stream on Netflix. Rent on Prime Video.', ['netflix']],
[1194915, 'Challengers', 2024, 7.2, ['Drama','Romance','Sport'], 'Tennis love triangle turns pro.', 'Zendaya', 'Luca Guadagnino', 0, 'Stream on Prime Video.', ['prime']],
[1059094, 'Hit Man', 2024, 6.8, ['Comedy','Romance','Crime'], 'A fake hitman falls for a client.', 'Glen Powell', 'Richard Linklater', 0, 'Stream on Netflix.', ['netflix']],
[1017163, 'Civil War', 2024, 7.0, ['Action','Drama'], 'War journalists cross a fractured America.', 'Kirsten Dunst', 'Alex Garland', 0, 'Stream on Peacock. Rent on Prime Video.', ['peacock']],
[1064486, 'The Watchers', 2024, 6.0, ['Horror','Fantasy'], 'Mina trapped in an Irish forest.', 'Dakota Fanning', 'Ishana Shyamalan', 0, 'Stream on Max. Rent on Prime Video.', ['max']],
[1087388, 'Sting', 2024, 6.2, ['Horror'], 'A pet spider grows giant in Brooklyn.', 'Ryan Corr', 'Kiah Roache-Turner', 0, 'Stream on Hulu. Rent on Prime Video.', ['hulu']],
[1086747, 'Cuckoo', 2024, 5.8, ['Horror','Thriller'], 'A teen uncovers resort horrors in the Alps.', 'Hunter Schafer', 'Tilman Singer', 0, 'Stream on Hulu. Rent on Prime Video.', ['hulu']],
[1115623, 'The Strangers: Chapter 1', 2024, 5.6, ['Horror'], 'A couple terrorized in the woods.', 'Madelaine Petsch', 'Renny Harlin', 0, 'Rent on Prime Video, Apple TV.', []],
[1280768, 'Night Swim', 2024, 5.0, ['Horror','Thriller'], 'A haunted pool terrorizes a family.', 'Wyatt Russell', 'Bryce McGuire', 0, 'Stream on Peacock. Rent on Prime Video.', ['peacock']],
[1055547, 'The Mouse Trap', 2024, 5.0, ['Horror','Comedy'], 'A slasher stalks an arcade birthday.', 'Simon Phillips', 'Jamie Bailey', 0, 'Stream on Peacock.', ['peacock']],
[1063879, 'The Bike Riders', 2024, 6.8, ['Drama','Crime'], 'A 60s biker club rises and falls.', 'Austin Butler', 'Jeff Nichols', 0, 'Rent on Prime Video, Apple TV.', []],
]);
