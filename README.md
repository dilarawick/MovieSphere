# MovieSphere — React → Node.js + Express → MongoDB → Movie API → Legal streams

Free & legal streaming catalogue for **English + Sinhala** movies.

## Architecture

```
React (Vite + Tailwind, `src/`)
  ↓  fetch(VITE_API_URL)
Node.js + Express (`server/server.js`, `server/routes/movies.js`)
  ↓  Mongoose (falls back to in-memory seeds if Mongo is offline)
MongoDB (`Movie` model, `npm run seed`)
  ↓  enrichment (metadata/posters only)
Movie API (TMDB — needs TMDB_API_KEY)
  ↓
Legal / public-domain video sources
  - Internet Archive public-domain .mp4 (full films, e.g. Night of the Living Dead)
  - Rights-holder YouTube embeds (trailers + licensed Sinhala shares)
  - Admin-attached licensed MP4/HLS URLs
```

Copyrighted English + Sinhala blockbusters are **metadata + trailer only** — never
full free streams. Only `streamType: mp4|hls` entries (public domain / licensed)
play as full films via `<video>`, flagged `FREE & LEGAL` in the UI.

## Run

Backend:
```
cd server
npm install
copy .env.example .env
npm run dev      # http://localhost:5000
npm run seed     # optional — needs local MongoDB
```

Frontend:
```
npm install
npm run dev      # http://localhost:5173 (VITE_API_URL=http://localhost:5000)
npm run build
```

## Endpoints

- GET /api/movies?lang=en|si|all&q=&genre=&sort=latest|imdb|az
- GET /api/movies/featured | /trending | /top-rated | /free-legal | /genres
- GET /api/movies/:id
- GET /api/movies/:id/stream
- GET /api/movies/external/tmdb/trending (needs TMDB_API_KEY)
- GET /api/legal-sources

