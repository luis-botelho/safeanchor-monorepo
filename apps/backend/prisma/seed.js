if (process.env.ALLOW_DATABASE_SEED !== "true") {
  console.error(
    "Seed bloqueado. Defina ALLOW_DATABASE_SEED=true somente após confirmar o banco de destino.",
  );
  process.exit(1);
}

const seedIds = {
  organizationParty: "seed-demo-party-organization",
  organization: "seed-demo-organization-safeanchor",
  userParty: "seed-demo-party-user",
  user: "seed-demo-user-demo",
  membership: "seed-demo-membership-demo",
  vessel: "seed-demo-vessel-safeanchor",
  maintenance: "seed-demo-maintenance-engine-inspection",
  preventiveMaintenance: "seed-demo-preventive-oil-change",
  checklistTemplate: "seed-demo-template-pre-departure",
  checklistExecution: "seed-demo-execution-pre-departure",
  document: "seed-demo-document-insurance",
  inspection: "seed-demo-inspection-safety",
};

const { default: prisma } = await import("../src/lib/prisma.js");
const { hashSync } = await import("bcrypt");

async function seed() {
  console.log("Criando ou atualizando dados de desenvolvimento:", seedIds);

  await prisma.party.upsert({
    where: { id: seedIds.organizationParty },
    update: {},
    create: {
      id: seedIds.organizationParty,
      type: "ORGANIZATION",
    },
  });

  await prisma.organization.upsert({
    where: { id: seedIds.organization },
    update: { name: "SafeAnchor Demo" },
    create: {
      id: seedIds.organization,
      partyId: seedIds.organizationParty,
      name: "SafeAnchor Demo",
    },
  });

  await prisma.party.upsert({
    where: { id: seedIds.userParty },
    update: {},
    create: {
      id: seedIds.userParty,
      type: "USER",
    },
  });

  const demoUser = {
    partyId: seedIds.userParty,
    name: "Usuário Demo",
    email: "demo@safeanchor.test",
    passwordHash: hashSync("demo123456", 10),
    role: "MANAGER",
  };

  await prisma.user.upsert({
    where: { id: seedIds.user },
    update: {
      passwordHash: demoUser.passwordHash,
    },
    create: {
      id: seedIds.user,
      ...demoUser,
    },
  });

  await prisma.membership.upsert({
    where: {
      userId_organizationId: {
        userId: seedIds.user,
        organizationId: seedIds.organization,
      },
    },
    update: {},
    create: {
      id: seedIds.membership,
      userId: seedIds.user,
      organizationId: seedIds.organization,
    },
  });

  await prisma.vessel.upsert({
    where: { id: seedIds.vessel },
    update: {
      ownerPartyId: seedIds.organizationParty,
      name: "SafeAnchor Demo Vessel",
      type: "Lancha",
      status: "Ativa",
    },
    create: {
      id: seedIds.vessel,
      ownerPartyId: seedIds.organizationParty,
      name: "SafeAnchor Demo Vessel",
      type: "Lancha",
      status: "Ativa",
    },
  });

  const templateData = {
    title: "Checklist pré-saída SafeAnchor Demo",
    vesselType: "Lancha",
    items: [
      { id: "life-jackets", label: "Verificar coletes salva-vidas" },
      { id: "navigation-lights", label: "Verificar luzes de navegação" },
    ],
  };

  await prisma.checklistTemplate.upsert({
    where: { id: seedIds.checklistTemplate },
    update: templateData,
    create: { id: seedIds.checklistTemplate, ...templateData },
  });

  const maintenanceData = {
    vesselId: seedIds.vessel,
    title: "Inspeção do motor",
    description: "Registro de manutenção para demonstração local.",
    type: "Preventiva",
    date: "2026-08-27",
    status: "Pendente",
  };

  await prisma.maintenance.upsert({
    where: { id: seedIds.maintenance },
    update: maintenanceData,
    create: { id: seedIds.maintenance, ...maintenanceData },
  });

  const preventiveMaintenanceData = {
    vesselId: seedIds.vessel,
    title: "Troca de óleo programada",
    description: "Agenda preventiva para demonstração local.",
    type: "Preventiva",
    status: "Pendente",
    periodicity: "quarterly",
    startDate: "2026-08-27",
    nextExecution: "2026-11-27",
  };

  await prisma.preventiveMaintenance.upsert({
    where: { id: seedIds.preventiveMaintenance },
    update: preventiveMaintenanceData,
    create: {
      id: seedIds.preventiveMaintenance,
      ...preventiveMaintenanceData,
    },
  });

  const executionData = {
    templateId: seedIds.checklistTemplate,
    vesselId: seedIds.vessel,
    responses: [
      { itemId: "life-jackets", checked: true },
      { itemId: "navigation-lights", checked: true },
    ],
    executedAt: "2026-08-27T12:00:00.000Z",
  };

  await prisma.checklistExecution.upsert({
    where: { id: seedIds.checklistExecution },
    update: executionData,
    create: { id: seedIds.checklistExecution, ...executionData },
  });

  const documentData = {
    vesselId: seedIds.vessel,
    name: "Seguro obrigatório",
    category: "Seguro",
    number: "SAFE-2026-001",
    validFrom: "2026-01-01",
    expiresAt: "2027-01-01",
    provider: "SafeAnchor Demo",
  };

  await prisma.document.upsert({
    where: { id: seedIds.document },
    update: documentData,
    create: { id: seedIds.document, ...documentData },
  });

  const inspectionData = {
    vesselId: seedIds.vessel,
    type: "safety",
    status: "SCHEDULED",
    scheduledAt: "2026-12-10T10:00:00.000Z",
    completedAt: null,
    inspector: "Carlos Mendes",
    notes: "Inspeção de segurança de demonstração.",
    checklist: [
      { item: "Casco e tubulação", status: "pending", notes: "" },
      { item: "Motor e propulsão", status: "pending", notes: "" },
    ],
    certificate: null,
    createdAt: "2026-09-01T12:00:00.000Z",
  };

  await prisma.inspection.upsert({
    where: { id: seedIds.inspection },
    update: inspectionData,
    create: { id: seedIds.inspection, ...inspectionData },
  });

  console.log("Seed de desenvolvimento concluído sem remover outros dados.");
}

try {
  await seed();
} catch (error) {
  console.error("Falha ao executar o seed de desenvolvimento:", error);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
