import { getDb } from './db';

export async function seedDatabase() {
  // DB auto-seeds on init via seed-data.ts, so just confirm it's ready
  await getDb();
  return { seeded: true, message: 'Database initialized with seed data' };
}
