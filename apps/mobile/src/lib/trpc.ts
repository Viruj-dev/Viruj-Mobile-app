import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '../../../../../viruj-backend/mobile/src/trpc';

export const trpc = createTRPCReact<AppRouter>();
