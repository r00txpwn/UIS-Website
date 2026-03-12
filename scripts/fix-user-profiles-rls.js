/**
 * Run user_profiles RLS fix against the Supabase DB.
 * Uses POSTGRES_URL_NON_POOLING or POSTGRES_URL from .env / .env.local.
 *
 * Run from project root: npm run db:fix-user-profiles-rls
 */
import pg from 'pg';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';

// Supabase pooler SSL often causes certificate chain issues in Node; allow for this script only
if (process.env.NODE_TLS_REJECT_UNAUTHORIZED === undefined) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

// Load env ( .env then .env.local so local overrides )
dotenv.config({ path: join(root, '.env') });
dotenv.config({ path: join(root, '.env.local') });

const connectionString =
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.POSTGRES_URL;

if (!connectionString) {
  console.error(
    'Missing POSTGRES_URL_NON_POOLING or POSTGRES_URL in .env or .env.local.\n' +
    'Add one of them (from Supabase → Project Settings → Database → Connection string, direct).'
  );
  process.exit(1);
}

const sqlPath = join(root, 'supabase', 'fix_user_profiles_rls.sql');
let sql;
try {
  sql = readFileSync(sqlPath, 'utf8');
} catch (err) {
  console.error('Could not read', sqlPath, err.message);
  process.exit(1);
}

const client = new pg.Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

async function run() {
  try {
    await client.connect();
    await client.query(sql);
    console.log('user_profiles RLS fix applied successfully.');
  } catch (err) {
    console.error('Error running fix:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
