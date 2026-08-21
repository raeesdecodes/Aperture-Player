import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const mediaItems = sqliteTable('media_items', {
  id: text('id').primaryKey(),
  uri: text('uri').notNull(),
  filename: text('filename').notNull(),
  title: text('title'),
  durationMs: integer('duration_ms').default(0).notNull(),
  sizeBytes: integer('size_bytes').default(0).notNull(),
  mimeType: text('mime_type'),
  thumbnailPath: text('thumbnail_path'),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

export type MediaItemSchema = typeof mediaItems.$inferSelect;
export type NewMediaItemSchema = typeof mediaItems.$inferInsert;
