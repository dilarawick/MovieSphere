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

// CORS: single-service deploy = same origin, no CORS needed.
// If CLIENT_URL is unset/empty, allow all origins (public read-only API).
// If set, allow that list + Vercel previews + Railway domains.
const rawClientUrl = (process.env.CLIENT_URL || '').trim();
const allowedOrigins = rawClientUrl
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
function isAllowedOrigin(origin) {
  if (!origin) return true; // curl / server-to-server / same-origin GET
  if (allowedOrigins.length === 0) return true;
  if (allowedOrigins.includes('*')) return true;
  if (allowedOrigins.includes(origin)) return true;
  try {
    const host = new URL(origin).hostname || '';
    if (host.endsWith('.vercel.app')) return true;
    if (host.endsWith('.up.railway.app') || host.endsWith('.railway.app')) return true;
    // Same-origin check is covered by allowedOrigins, but also allow
    // Railway-provided domains automatically.
    if (process.env.RAILWAY_PUBLIC_DOMAIN && origin.includes(process.env.RAILWAY_PUBLIC_DOMAIN)) return true;
  } catch {
    return false;
  }
  return false;
}
app.use(
  cors({
    origin: (origin, cb) => {
      if (isAllowedOrigin(origin)) return cb(null, true);
      return cb(null, false);
    },
  })
);
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (req, res) =>
  res.json({ ok: true, time: new Date().toISOString() })
);

app.get('/api', (req, res) =>
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
const hasDist = fs.existsSync(path.join(distDir, 'index.html'));
if (hasDist) {
  app.use(express.static(distDir));
  // SPA fallback — but never swallow /api routes.
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
  });
  console.log('[static] Serving frontend from ../dist');
} else {
  console.warn('[static] ../dist/index.html NOT FOUND — API-only mode. Build must run `npm run build` from repo root.');
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
