import { defineConfig } from "drizzle-kit";
import { Resource } from "sst";

export default defineConfig({
  schema: "./src/types/db/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    host: Resource.Postgres.host,
    port: Resource.Postgres.port,
    user: Resource.Postgres.username,
    password: Resource.Postgres.password,
    database: Resource.Postgres.database,
    ssl: false,
  },
  casing: "snake_case",
});
