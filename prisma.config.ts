import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
    // Direct connection for migrations — Supabase pgBouncer can't run migrations
    // @ts-expect-error directUrl is supported at runtime by Prisma 7 but not in types
    directUrl: env("DIRECT_URL"),
  },
});
