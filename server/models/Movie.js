import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema(
  {
    tmdbId: { type: Number, index: true },
    title: { type: String, required: true, index: true },
    originalTitle: String,
    language: { type: String, enum: ['en', 'si'], default: 'en', index: true },
    languageLabel: { type: String, default: 'English' },
    year: Number,
    imdb: Number,
    duration: String,
    maturity: String,
    quality: { type: String, default: 'HD' },
    genres: [{ type: String, index: true }],
    overview: String,
    cast: [String],
    director: String,
    poster: String,
    backdrop: String,
    tagline: String,
    trending: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    trailerYouTubeKey: String,
    // ---- Legal streaming fields ----
    // streamType: 'mp4' | 'hls' | 'youtube' | 'youtube-search' | 'none'
    streamType: { type: String, default: 'youtube-search' },
    streamUrl: String,
    // source: where the stream legally comes from
    source: { type: String, default: 'youtube-legal' },
    license: { type: String, default: 'All rights reserved — trailer only' },
    licenseUrl: String,
  },
  { timestamps: true }
);

movieSchema.index({ title: 'text', overview: 'text', director: 'text' }, { language_override: 'textLang' });

export const Movie = mongoose.models.Movie || mongoose.model('Movie', movieSchema);
