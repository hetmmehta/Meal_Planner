import 'dotenv/config';
import mongoose from 'mongoose';
import { createApp } from './app.js';

const PORT = Number(process.env.PORT) || 4000;
const MONGO_URI = process.env.MONGODB_URI;
const CORS_ORIGINS = (process.env.CORS_ORIGIN || 'http://localhost:4200')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

async function startServer() {
  if (!MONGO_URI) {
    console.error(
      '❌ MONGODB_URI is not set. Copy server/.env.example to server/.env and add your connection string.'
    );
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const { app } = await createApp({ corsOrigins: CORS_ORIGINS });
    app.listen(PORT, () =>
      console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`)
    );
  } catch (err) {
    console.error('❌ Error starting server:', err);
    process.exit(1);
  }
}

startServer();
