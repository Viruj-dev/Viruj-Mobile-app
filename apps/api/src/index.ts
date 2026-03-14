import { Hono } from 'hono';
import { trpcServer } from '@hono/trpc-server';
import { appRouter } from './trpc';

const app = new Hono();

// Simple health check
app.get('/', (c) => {
  return c.text('VirujHealth API is running');
});

// tRPC endpoint
app.use(
  '/trpc/*',
  trpcServer({
    router: appRouter,
    createContext: (_opts, c) => ({
      // Context for tRPC resolvers (e.g. auth user, db)
    }),
  })
);

export default {
  port: 3000,
  fetch: app.fetch,
};
