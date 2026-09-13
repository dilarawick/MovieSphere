import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import movieRoutes, { setDbCount } from './routes/movies.js';
import { Movie } from './models/Movie.js';
import { LEGAL_SOURCES } from './services/legalSources.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: (process.env.CLIENT_URL || 'http://localhost:5173').split(',') }));
app.use(express.json());
app.use(morgan('dev'));

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
  app.listen(PORT, () => console.log(`[api] MovieSphere server on http://localhost:${PORT}`));
}

boot();
