import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import movieRoutes, { setDbCount } from './routes/movies.js';
import { Movie } from './models/Movie.js';
import { LEGAL_SOURCES } from './services/legalSources.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// CORS: allow one or many comma-separated client URLs + Vercel previews
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
app.use(
  cors({
    origin: (origin, cb) => {
      // Allow server-to-server / curl (no Origin header) and any allowed origin.
      // Also allow *.vercel.app previews so preview deploys just work.
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      if (/\.vercel\.app$/.test(new URL(origin).hostname || '')) return cb(null, true);
      return cb(null, false);
    },
  })
);
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (req, res) =>
  res.json({ ok: true, time: new Date().toISOString() })
);

app.get('/', (req, res) =>
  res.json({
    name: 'MovieSphere API',
    stack: 'React -> Node.js + Express -> MongoDB -> Movie API -> legal video sources',
    endpoints: [
      'GET /api/movies?lang=en|si|all&q=&genre=&sort=latest|imdb|az',
      'GET /api/movies/featured | /trending | /top-rated | /free-legal | /genres',
      'GET /api/movies/:id',
      'GET /api/movies/:id/stream',
      'GET /api/movies/external/tmdb/trending',
      'GET /api/legal-sources',
    ],
  })
);

app.get('/api/legal-sources', (req, res) => res.json(LEGAL_SOURCES));
app.use('/api/movies', movieRoutes);

// ---- Single-service deploy: serve Vite `dist/` if it exists ----
// On Render you can build the frontend and run this same server, so one
// URL serves both API + site (no CORS setup needed).
const distDir = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  // SPA fallback — but never swallow /api routes.
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
  });
  console.log('[static] Serving frontend from ../dist');
}

async function boot() {
  await connectDB(process.env.MONGO_URI);
  try {
    if (mongoose.connection.readyState === 1) {
      setDbCount(await Movie.countDocuments());
    } else {
      setDbCount(0);
    }
  } catch {
    setDbCount(0);
  }
  app.listen(PORT, '0.0.0.0', () => console.log(`[api] MovieSphere server on port ${PORT}`));
}

boot();
