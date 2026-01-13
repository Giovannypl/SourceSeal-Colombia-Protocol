// Bóveda de Integridad SourceSeal - Ley 1978 COL
export const MASTER_COMMITMENT = 238;
export const MASTER_HASH = "2b829b821e23d1de4a60cd102017022792da581b5571db941d9ba281465577fc";

import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });
