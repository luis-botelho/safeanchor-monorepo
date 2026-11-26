-- Captura de pesquisa com consentimento e trilha de decisoes da diretoria.
CREATE TABLE "ResearchResponse" (
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
);

CREATE INDEX "ResearchResponse_status_idx" ON "ResearchResponse"("status");
CREATE INDEX "ResearchResponse_profile_idx" ON "ResearchResponse"("profile");
CREATE INDEX "ResearchResponse_city_idx" ON "ResearchResponse"("city");

CREATE TABLE "DirectorAction" (
    "id" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "details" JSONB NOT NULL,
    "createdAt" TEXT NOT NULL,

    CONSTRAINT "DirectorAction_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "DirectorAction_actorId_idx" ON "DirectorAction"("actorId");
CREATE INDEX "DirectorAction_targetType_targetId_idx" ON "DirectorAction"("targetType", "targetId");

-- Promocoes para DIRECTOR nao sao feitas por migration nem por conta publica.
-- Provisione a conta da diretoria fora do repositorio e rotacione suas credenciais.
