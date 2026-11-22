import { drizzle } from 'drizzle-orm/netlify-db';

const connect = () => drizzle();
let database: ReturnType<typeof connect> | undefined;

export function getDatabase() {
  return database ??= connect();
}
