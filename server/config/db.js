import mongoose from 'mongoose';

export async function connectDB(uri) {
  if (!uri) {
    console.log('[db] No MONGO_URI set — running in memory-only mode (seed fallback).');
    return null;
  }
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('[db] Connected to MongoDB');
    return mongoose.connection;
  } catch (err) {
    console.warn('[db] MongoDB unavailable, falling back to in-memory catalogue:', err.message);
    return null;
  }
}
