/**
 * Insert dummy accreditations into the Supabase DB.
 * Uses POSTGRES_URL_NON_POOLING or POSTGRES_URL from .env / .env.local.
 *
 * Run: npm run db:seed-dummy-accreditations
 */
import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';

if (process.env.NODE_TLS_REJECT_UNAUTHORIZED === undefined) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

dotenv.config({ path: join(root, '.env') });
dotenv.config({ path: join(root, '.env.local') });

const connectionString =
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.POSTGRES_URL;

if (!connectionString) {
  console.error('Missing POSTGRES_URL_NON_POOLING or POSTGRES_URL in .env or .env.local.');
  process.exit(1);
}

const dummyAccreditations = [
  {
    name: 'Dummy ISO 9001',
    description: 'Quality Management System - dummy entry for testing',
    logo_url: 'https://placehold.co/120x120/2563eb/white?text=ISO',
    display_order: 100,
  },
  {
    name: 'Dummy Safety Certified',
    description: 'Occupational Health & Safety - test accreditation',
    logo_url: 'https://placehold.co/120x120/1e40af/white?text=SAFE',
    display_order: 101,
  },
  {
    name: 'Test Environmental Badge',
    description: 'Environmental Management - dummy certification',
    logo_url: 'https://placehold.co/120x120/059669/white?text=ENV',
    display_order: 102,
  },
];

const client = new pg.Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

async function run() {
  try {
    await client.connect();
    for (const row of dummyAccreditations) {
      await client.query(
        `INSERT INTO accreditations (name, description, logo_url, display_order)
         VALUES ($1, $2, $3, $4)`,
        [row.name, row.description, row.logo_url, row.display_order]
      );
    }
    console.log('Dummy accreditations inserted:', dummyAccreditations.length);
    console.log('Check the /accreditations page on your site.');
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
