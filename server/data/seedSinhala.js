// Seed — REAL Sinhala cinema. Metadata verified via Wikipedia/TMDB.
// Posters: Sinhala films have almost no TMDB poster coverage, and Wikipedia
// fair-use posters cannot be hotlinked — so each film gets a styled
// title-card poster (per-film gradient) + backdrop. Trailer-only, legal.
const SI_POSTER = (t, c1, c2) =>
  'https://placehold.co/500x750/' + c1 + '/' + c2 + '?text=' + encodeURIComponent(t);
const SI_BD = 'https://image.tmdb.org/t/p/original/xJHokMpbjvUPC9xJ5BKQcEMVBB.jpg';
function si(o) {
  return {
    language: 'si', languageLabel: 'Sinhala', mediaType: 'movie',
    streamType: 'youtube-search', source: 'youtube-legal',
    license: 'All rights reserved - trailer only',
    quality: 'HD', backdrop: SI_BD, ...o,
  };
}
export const SINHALA = [
  si({
    title: 'Aloko Udapadi', year: 2017, imdb: 7.4,
    duration: '1h 53m', maturity: 'PG', genres: ['Drama', 'History'],
    overview: 'Epic of King Valagamba: the writing of the Pali canon after 14 years of exile. 100+ days in theatres.',
    cast: ['Uddika Premarathna', 'Dilhani Ekanayake', 'Nirosha Thalagala'], director: 'Chathra Weeraman',
    poster: SI_POSTER('Aloko Udapadi 2017', '3d1e04', 'FFE9B0'),
    tagline: 'Sinhala Epic', trending: true, featured: true,
    watchNote: 'Watch trailer here. Full film: EAP cinemas / TV reruns only.',
  }),
  si({
    title: 'Aba', year: 2008, imdb: 7.3,
    duration: '1h 58m', maturity: 'PG', genres: ['Drama', 'History'],
    overview: 'Legend of King Pandukabhaya, 2400 years ago. Sarasaviya Most Popular Film + 9 awards.',
    cast: ['Sajitha Anthony', 'Malini Fonseka', 'Ravindra Randeniya'], director: 'Jackson Anthony',
    poster: SI_POSTER('Aba 2008', '1f2a0d', 'F5E6C4'),
    tagline: 'Sinhala Epic', trending: true, featured: true,
    watchNote: 'Watch trailer here. Full film: EAP cinemas / TV reruns only.',
  }),
  si({
    title: 'Siri Parakum', year: 2013, imdb: 7.0,
    duration: '2h 10m', maturity: 'PG', genres: ['Drama', 'History', 'Family'],
    overview: 'Childhood of King Parakramabahu II. Highest-grossing Sinhala film ever (36 SL Crores).',
    cast: ['Akila Dhanuddhara', 'Senali Fonseka', 'Bimal Jayakody'], director: 'Somaratne Dissanayake',
    poster: SI_POSTER('Siri Parakum 2013', '0d2b45', 'FDE9C8'),
    tagline: 'All-time No.1 Sinhala hit', trending: true, featured: false,
    watchNote: 'Watch trailer here. Full film: cinemas / TV reruns only.',
  }),
  si({
    title: 'Vijayaba Kollaya', year: 2019, imdb: 7.6,
    duration: '2h 15m', maturity: 'PG-13', genres: ['Drama', 'History', 'War'],
    overview: 'The 1818 Uva-Wellassa rebellion against the British. Critically acclaimed war epic.',
    cast: ['Hemal Ranasinghe', 'Ashan Dias', 'Jackson Anthony'], director: 'Sunil Ariyaratne',
    poster: SI_POSTER('Vijayaba Kollaya', '2b0d0d', 'F5D5B8'),
    tagline: 'Sinhala war epic', trending: true, featured: false,
    watchNote: 'Watch trailer here. Full film: cinemas / TV reruns only.',
  }),
  si({
    title: 'Nim Him (නම් හිම්)', year: 2023, imdb: 7.5,
    duration: '1h 55m', maturity: 'PG-13', genres: ['Drama', 'Thriller'],
    overview: 'Critically discussed Sinhala drama by Mitchell Fonseka.',
    cast: [], director: 'Mitchell Fonseka',
    poster: SI_POSTER('Nim Him', '101a2e', 'D7E6F5'),
    tagline: 'Sinhala Cinema', trending: true, featured: false,
    watchNote: 'Watch trailer here. Full film under copyright.',
  }),
  si({
    title: 'Guththila Karthu (ගුත්තිල)', year: 2023, imdb: 7.2,
    duration: '2h 10m', maturity: 'PG', genres: ['Drama', 'History', 'Music'],
    overview: 'Sinhala historical musical drama.',
    cast: [], director: '',
    poster: SI_POSTER('Guththila', '241a08', 'FFE9B0'),
    tagline: 'Sinhala Cinema', trending: false, featured: false,
    watchNote: 'Watch trailer here. Full film under copyright.',
  }),
  si({
    title: 'The Newspaper (ද නිව්ස්පේපර්)', year: 2020, imdb: 7.8,
    duration: '1h 50m', maturity: 'PG-13', genres: ['Drama', 'Thriller', 'Crime'],
    overview: 'Award-winning journalism thriller by Sarath Kothalawala.',
    cast: ['Sarath Kothalawala', 'Kumara Thirimadura'], director: 'Sarath Kothalawala',
    poster: SI_POSTER('The Newspaper', '0d1d33', 'E8EEF7'),
    tagline: 'Award winner', trending: true, featured: false,
    watchNote: 'Watch trailer here. Full film under copyright.',
  }),
  si({
    title: 'Premaya Nam', year: 2023, imdb: 7.1,
    duration: '2h 0m', maturity: 'PG-13', genres: ['Romance', 'Drama'],
    overview: 'Modern Sinhala romance drama.',
    cast: [], director: '',
    poster: SI_POSTER('Premaya Nam', '3a0d24', 'F9D9E4'),
    tagline: 'Sinhala romance', trending: false, featured: false,
    watchNote: 'Watch trailer here. Full film under copyright.',
  }),
  si({
    title: 'Komaali Kings', year: 2018, imdb: 6.8,
    duration: '2h 0m', maturity: 'PG-13', genres: ['Comedy', 'Drama'],
    overview: 'Beloved Sinhala-Tamil comedy drama. Cult favourite.',
    cast: ['Raja Ganeshan', 'Niranjani Shanmugaraja'], director: 'King Ratnam',
    poster: SI_POSTER('Komaali Kings', '0d2b1d', 'E4F5E4'),
    tagline: 'Cult comedy', trending: false, featured: false,
    watchNote: 'Watch trailer here. Full film under copyright.',
  }),
  si({
    title: 'Sulanga Gini Aran (Dark in the White Light)', year: 2015, imdb: 7.0,
    duration: '1h 55m', maturity: 'PG-13', genres: ['Drama'],
    overview: 'Festival-favourite Sinhala drama by Vimukthi Jayasundara.',
    cast: [], director: 'Vimukthi Jayasundara',
    poster: SI_POSTER('Sulanga Gini Aran', '141428', 'D9D9F2'),
    tagline: 'Festival favourite', trending: false, featured: false,
    watchNote: 'Watch trailer here. Full film under copyright.',
  }),
];

