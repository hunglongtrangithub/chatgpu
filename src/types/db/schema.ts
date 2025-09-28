// This file should not contain any runtime logic besides defining the schema.
// See https://orm.drizzle.team/docs/migrations#quick-start
import {
  bigint,
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

const cascadingUpdateAndDelete = {
  onUpdate: "cascade",
  onDelete: "cascade",
} as const;

const updateAndCreatedAt = {
  updatedAt: timestamp().notNull().defaultNow(),
  createdAt: timestamp().notNull().defaultNow(),
};

export const user = pgTable(
  "user",
  {
    id: text().primaryKey(),
    name: text().notNull(),
    email: text().notNull().unique(),
    emailVerified: boolean().notNull().default(false),
    image: text(),
    ...updateAndCreatedAt,
  },
  (table) => [index().on(table.email)],
);

export const session = pgTable(
  "session",
  {
    id: text().primaryKey(),
    expiresAt: timestamp().notNull(),
    token: text().notNull().unique(),
    ipAddress: text(),
    userAgent: text(),
    userId: text()
      .notNull()
      .references(() => user.id, cascadingUpdateAndDelete),
    ...updateAndCreatedAt,
  },
  (table) => [index().on(table.userId), index().on(table.token)],
);

export const account = pgTable(
  "account",
  {
    id: text().primaryKey(),
    accountId: text().notNull(),
    providerId: text().notNull(),
    accessToken: text(),
    refreshToken: text(),
    idToken: text(),
    accessTokenExpiresAt: timestamp(),
    refreshTokenExpiresAt: timestamp(),
    scope: text(),
    password: text(),
    userId: text()
      .notNull()
      .references(() => user.id, cascadingUpdateAndDelete),
    ...updateAndCreatedAt,
  },
  (table) => [index().on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text().primaryKey(),
    identifier: text().notNull(),
    value: text().notNull(),
    expiresAt: timestamp().notNull(),
    ...updateAndCreatedAt,
  },
  (table) => [index().on(table.identifier)],
);

export const mimeType = pgEnum("mime_type", ["application/json", "image/png"]);

export type MimeType = (typeof mimeType.enumValues)[number];

export const asset = pgTable("asset", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: text()
    .notNull()
    .references(() => user.id, cascadingUpdateAndDelete),
  name: text().unique().notNull(), // FK to S3 object name, cannot guarantee that users will actually upload files with their presigned URLs
  mimeType: mimeType(),
  ...updateAndCreatedAt,
});

export const rate_limit = pgTable("rate_limit", {
  id: text("id").primaryKey(),
  key: text("key"),
  count: integer("count"),
  lastRequest: bigint("last_request", { mode: "number" }),
});
