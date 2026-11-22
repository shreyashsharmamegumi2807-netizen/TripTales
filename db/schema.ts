import { jsonb, pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core';

export const accountItems = pgTable('account_items', {
  userId: text('user_id').notNull(),
  kind: text('kind', { enum: ['trips', 'journal'] }).notNull(),
  id: text('id').notNull(),
  content: jsonb('content').$type<Record<string, unknown>>().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [primaryKey({ columns: [table.userId, table.kind, table.id] })]);
