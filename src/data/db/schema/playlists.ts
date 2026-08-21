import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';
import { mediaItems } from './mediaItems';

export const playlists = sqliteTable('playlists', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

export const playlistItems = sqliteTable(
  'playlist_items',
  {
    playlistId: text('playlist_id')
      .notNull()
      .references(() => playlists.id, { onDelete: 'cascade' }),
    mediaItemId: text('media_item_id')
      .notNull()
      .references(() => mediaItems.id, { onDelete: 'cascade' }),
    orderIndex: integer('order_index').notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.playlistId, table.mediaItemId] }),
  }),
);

export type PlaylistSchema = typeof playlists.$inferSelect;
export type NewPlaylistSchema = typeof playlists.$inferInsert;
export type PlaylistItemSchema = typeof playlistItems.$inferSelect;
export type NewPlaylistItemSchema = typeof playlistItems.$inferInsert;
