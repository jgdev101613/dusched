import { drizzle } from "drizzle-orm/node-postgres";
import { getEnv } from "../lib/env";
import pg from "pg";

import * as schema from "./schema";

const env = getEnv();

const pool = new pg.Pool({ connectionString: env.DATABASE_URL });

export const db = drizzle(pool, { schema });
