import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Replace with a valid Neon connection string via environment variables
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
