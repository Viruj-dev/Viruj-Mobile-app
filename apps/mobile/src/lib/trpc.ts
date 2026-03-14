import { createTRPCReact } from '@trpc/react-query';

// Later, this will import the AppRouter from @viruj/api
// import type { AppRouter } from '@viruj/api/src/trpc';

export const trpc = createTRPCReact<any>();
