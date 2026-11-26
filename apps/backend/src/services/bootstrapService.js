// Bootstrap temporário de schema para a rodada da diretoria.
// Só executa quando BOOTSTRAP_DIRECTOR_SCHEMA=true no ambiente.
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const STATEMENTS = [
  `ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'DIRECTOR'`,
  `CREATE TABLE IF NOT EXISTS "ResearchResponse" (
    "id" TEXT NOT NULL,
    "consentVersion" TEXT NOT NULL,
    "acceptedAt" TEXT NOT NULL,
    "name" TEXT,
    "contact" TEXT,
    "city" TEXT,
    "profile" TEXT,
    "answers" JSONB NOT NULL,
    "summary" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "decision" TEXT,
    "createdAt" TEXT NOT NULL,
    CONSTRAINT "ResearchResponse_pkey" PRIMARY KEY ("id")
  )`,
  `CREATE INDEX IF NOT EXISTS "ResearchResponse_status_idx" ON "ResearchResponse"("status")`,
  `CREATE INDEX IF NOT EXISTS "ResearchResponse_profile_idx" ON "ResearchResponse"("profile")`,
  `CREATE INDEX IF NOT EXISTS "ResearchResponse_city_idx" ON "ResearchResponse"("city")`,
  `CREATE TABLE IF NOT EXISTS "DirectorAction" (
    "id" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "details" JSONB NOT NULL,
    "createdAt" TEXT NOT NULL,
    CONSTRAINT "DirectorAction_pkey" PRIMARY KEY ("id")
  )`,
  `CREATE INDEX IF NOT EXISTS "DirectorAction_actorId_idx" ON "DirectorAction"("actorId")`,
  `CREATE INDEX IF NOT EXISTS "DirectorAction_targetType_targetId_idx" ON "DirectorAction"("targetType", "targetId")`,
  `UPDATE "User" SET "role" = 'DIRECTOR' WHERE "email" = 'diretoria@safeanchor.app'`,
];

export async function applyBootstrapMigrations() {
  if (process.env.BOOTSTRAP_DIRECTOR_SCHEMA !== "true") {
    return { applied: false };
  }

  const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DIRECT_URL indisponível para o bootstrap da diretoria.");
  }

  const adapter = new PrismaPg({ connectionString });
  const prisma = new PrismaClient({ adapter });

  try {
    for (const statement of STATEMENTS) {
      await prisma.$executeRawUnsafe(statement);
    }
    return { applied: true, statements: STATEMENTS.length };
  } finally {
    await prisma.$disconnect();
  }
}
