import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  // Prisma 7 adapter-pg requires explicit sslmode — Supabase uses self-signed
  // certs on dev, so no-verify is safe for development. In production,
  // Supabase provides valid CA-signed certs so verify-full works.
  const connectionString =
    process.env.NODE_ENV === "development"
      ? process.env.DATABASE_URL!.replace(
          /sslmode=\w+/,
          "sslmode=no-verify",
        )
      : process.env.DATABASE_URL!;
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
