import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { mediaItems } from './mediaItems';

export const watchProgress = sqliteTable('watch_progress', {
  mediaItemId: text('media_item_id')
    .primaryKey()
    .references(() => mediaItems.id, { onDelete: 'cascade' }),
  positionMs: integer('position_ms').default(0).notNull(),
  durationMs: integer('duration_ms').default(0).notNull(),
  lastWatchedAt: integer('last_watched_at').notNull(),
  isCompleted: integer('is_completed', { mode: 'boolean' }).default(false).notNull(),
});

export type WatchProgressSchema = typeof watchProgress.$inferSelect;
export type NewWatchProgressSchema = typeof watchProgress.$inferInsert;
