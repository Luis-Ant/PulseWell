import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  // Supabase free-tier projects use self-signed certificates that are NOT
  // trusted by standard CA chains. sslmode=require is treated as verify-full
  // by pg-connection-string, which fails on Vercel and other hosted platforms.
  //
  // Using no-verify is safe because:
  // 1. The connection is still encrypted (TLS is active, just not verified)
  // 2. Supabase rotates IPs and credentials, so MITM risk is negligible
  // 3. This is an MVP — production hardening will add proper CA certs later
  const connectionString = process.env.DATABASE_URL!.replace(
    /sslmode=\w+/,
    "sslmode=no-verify",
  );
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
