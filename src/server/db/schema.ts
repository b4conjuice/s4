// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from 'drizzle-orm'
import {
  index,
  pgTable,
  pgTableCreator,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator(name => `s4_${name}`)

export const posts = createTable(
  'post',
  d => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    name: d.varchar({ length: 256 }),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  t => [index('name_idx').on(t.name)]
)

export const notes = pgTable('n4_note', {
  id: serial('id').primaryKey(),
  text: varchar('text').notNull(),
  title: varchar('title', { length: 256 }).notNull(),
  body: varchar('body').notNull(),
  list: text('list').array().notNull(),
  author: varchar('author', { length: 256 }).notNull(),
  tags: text('tags').array().notNull(),
  markdown: varchar('markdown').notNull().default(''),
  createdAt: timestamp('created_at', { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdate(
    () => new Date()
  ),
})
