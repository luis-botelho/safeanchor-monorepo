-- CreateEnum
CREATE TYPE "Persona" AS ENUM ('OWNER', 'SERVICE_PROVIDER', 'MARINA');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "persona" "Persona" NOT NULL DEFAULT 'OWNER';
