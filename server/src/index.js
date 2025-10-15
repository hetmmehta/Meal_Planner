import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { graphqlHTTP } from 'express-graphql';
import schema from '../graphql/schema.js';
import resolvers from '../graphql/resolvers.js';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGODB_URI;

async function startServer() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    app.use(
      '/graphql',
      graphqlHTTP({
        schema,
        rootValue: resolvers,
        graphiql: { headerEditorEnabled: true },
      })
    );

    app.listen(PORT, () =>
      console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`)
    );
  } catch (err) {
    console.error('❌ Error starting server:', err);
  }
}

startServer();
