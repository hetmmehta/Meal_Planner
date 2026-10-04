import express from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { unwrapResolverError } from '@apollo/server/errors';
import { expressMiddleware } from '@as-integrations/express5';
import typeDefs from '../graphql/schema.js';
import resolvers from '../graphql/resolvers.js';

// Keep unexpected errors (DB failures, bugs) out of client responses.
function formatError(formattedError, error) {
  const code = formattedError.extensions?.code;
  if (code === 'INTERNAL_SERVER_ERROR') {
    console.error('❌ Unexpected GraphQL error:', unwrapResolverError(error));
    return { message: 'Something went wrong on the server', extensions: { code } };
  }
  return formattedError;
}

export function createApolloServer() {
  return new ApolloServer({ typeDefs, resolvers, formatError });
}

/**
 * Builds the Express app with the GraphQL endpoint mounted at /graphql.
 * `corsOrigins` is a list of allowed browser origins.
 */
export async function createApp({ corsOrigins }) {
  const apollo = createApolloServer();
  await apollo.start();

  const app = express();
  app.get('/health', (_req, res) => res.json({ ok: true }));
  app.use(
    '/graphql',
    cors({ origin: corsOrigins }),
    // Uploaded images are sent inline as data URLs, so allow a few MB.
    express.json({ limit: '5mb' }),
    expressMiddleware(apollo)
  );

  return { app, apollo };
}
