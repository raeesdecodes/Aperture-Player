import { openDatabaseSync } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from './schema';

export const DATABASE_NAME = 'aperture_player.db';

export const sqliteDb = openDatabaseSync(DATABASE_NAME);
export const db = drizzle(sqliteDb, { schema });
