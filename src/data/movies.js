export const IMG = {
  poster: (p) => `https://image.tmdb.org/t/p/w500${p}`,
  backdrop: (p) => `https://image.tmdb.org/t/p/original${p}`,
};

export const GENRES = ['All','Action','Sci-Fi','Adventure','Drama','Thriller','Crime','Comedy','Animation'];

export const MOVIES = [
  {
    id: 1, title: 'Dune: Part Two', year: 2024, imdb: 8.5, duration: '2h 46m',
    maturity: 'PG-13', quality: '4K', genres: ['Sci-Fi','Adventure','Action'],
    overview: 'Paul Atreides unites with the Fremen to avenge his family and control the spice.',
    cast: ['Timothee Chalamet','Zendaya','Rebecca Ferguson'], director: 'Denis Villeneuve',
    poster: IMG.poster('/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg'),
    backdrop: IMG.backdrop('/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg'),
    trending: true, featured: true, tagline: '#1 Most Watched This Week',
  },
  {
    id: 2, title: 'Oppenheimer', year: 2023, imdb: 8.3, duration: '3h 0m',
    maturity: 'R', quality: '4K', genres: ['Drama','Thriller'],
    overview: 'J. Robert Oppenheimer leads the Manhattan Project, changing history forever.',
    cast: ['Cillian Murphy','Emily Blunt','Matt Damon'], director: 'Christopher Nolan',
    poster: IMG.poster('/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg'),
    backdrop: IMG.backdrop('/rLb2cwF3Pazuxaj0sRXQ037tGI1.jpg'),
    trending: true, featured: true, tagline: 'Oscar Winner - Best Picture',
  },
  {
    id: 3, title: 'Deadpool & Wolverine', year: 2024, imdb: 7.7, duration: '2h 8m',
    maturity: 'R', quality: '4K', genres: ['Action','Comedy','Sci-Fi'],
    overview: 'Deadpool drags a reluctant Wolverine into a multiverse-saving mission.',
    cast: ['Ryan Reynolds','Hugh Jackman','Emma Corrin'], director: 'Shawn Levy',
    poster: IMG.poster('/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg'),
    backdrop: IMG.backdrop('/cOoVcVQ3i1m5b2xtqKBtoTSbxC1.jpg'),
    trending: true, featured: true, tagline: 'Marvels Biggest Comeback',
  },
  {
    id: 4, title: 'John Wick: Chapter 4', year: 2023, imdb: 7.7, duration: '2h 49m',
    maturity: 'R', quality: '4K', genres: ['Action','Thriller','Crime'],
    overview: 'John Wick battles the High Table in a globe-spanning fight for freedom.',
    cast: ['Keanu Reeves','Donnie Yen','Bill Skarsgard'], director: 'Chad Stahelski',
    poster: IMG.poster('/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg'),
    backdrop: IMG.backdrop('/h8gHn0OzBoaefsYseUByqsmEDMY.jpg'),
    trending: true, featured: true, tagline: 'No Way Back. One Way Out.',
  },
  {
    id: 5, title: 'Inside Out 2', year: 2024, imdb: 7.6, duration: '1h 37m',
    maturity: 'PG', quality: 'HD', genres: ['Animation','Comedy','Adventure'],
    overview: 'Teen Riley faces new emotions - Anxiety, Envy, and Embarrassment.',
    cast: ['Amy Poehler','Maya Hawke'], director: 'Kelsey Mann',
    poster: IMG.poster('/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg'),
    backdrop: IMG.backdrop('/stKGOm8UyhuLPR9sZLjs5AkmncA.jpg'),
    trending: true, featured: true, tagline: 'The Feel-Good Hit of the Year',
  },
];