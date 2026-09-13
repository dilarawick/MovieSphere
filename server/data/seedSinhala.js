// Seed part 3 — Sinhala cinema metadata + LEGAL playback pointers.
//
// Honest legal position: modern Sinhala blockbusters (e.g. recent Sarasaviya /
// Hiru Golden Film winners) are under copyright and CANNOT be offered as free
// full streams. So each entry carries trailer/licensed YouTube embeds, plus a
// `license` label. Admins can later attach a rights-holder licensed MP4/HLS
// URL to `streamUrl` when distribution rights are granted.
export const SINHALA = [
  {
    title: 'Guththila (Guththila Karthu)', year: 2023, imdb: 7.2,
    duration: '2h 10m', maturity: 'PG', quality: 'HD',
    genres: ['Drama', 'History'],
    overview: 'Sinhala historical drama. Trailer / licensed stream only unless rights granted.',
    cast: [], director: '',
    poster: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/s3TBrRGB1iav7gFOCNx3H31MoES.jpg',
    tagline: 'Sinhala Cinema', trending: true, featured: true,
    language: 'si', languageLabel: 'Sinhala',
    streamType: 'youtube-search', source: 'youtube-legal',
    license: 'All rights reserved — trailer only',
  },
  {
    title: 'Nim Him (නම් හිම්)', year: 2023, imdb: 7.5,
    duration: '1h 55m', maturity: 'PG-13', quality: 'HD',
    genres: ['Drama', 'Thriller'],
    overview: 'Critically discussed Sinhala drama. Trailer / licensed stream only.',
    cast: [], director: 'Mitchell Fonseka',
    poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/xJHokMpbjvUPC9xJ5BKQcEMVBB.jpg',
    tagline: 'Sinhala Cinema', trending: true, featured: false,
    language: 'si', languageLabel: 'Sinhala',
    streamType: 'youtube-search', source: 'youtube-legal',
    license: 'All rights reserved — trailer only',
  },
  {
    title: 'Sinhala Classic Showcase', year: 1965, imdb: 8.0,
    duration: '2h 0m', maturity: 'PG', quality: 'HD',
    genres: ['Drama'],
    overview: 'Placeholder slot for a rights-cleared Sinhala classic. Replace streamUrl with a rights-holder MP4 when licensed.',
    cast: [], director: '',
    poster: 'https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/n6bUvigpRFqSwmPp1m2YADdbRBc.jpg',
    trending: false, featured: false,
    language: 'si', languageLabel: 'Sinhala',
    streamType: 'youtube-search', source: 'youtube-legal',
    license: 'All rights reserved — trailer only',
  },
];
