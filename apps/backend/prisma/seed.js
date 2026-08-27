if (process.env.ALLOW_DATABASE_SEED !== "true") {
  console.error(
    "Seed bloqueado. Defina ALLOW_DATABASE_SEED=true somente após confirmar o banco de destino.",
  );
  process.exit(1);
}

const seedIds = {
  vessel: "seed-demo-vessel-safeanchor",
  maintenance: "seed-demo-maintenance-engine-inspection",
  preventiveMaintenance: "seed-demo-preventive-oil-change",
  checklistTemplate: "seed-demo-template-pre-departure",
  checklistExecution: "seed-demo-execution-pre-departure",
};

const { default: prisma } = await import("../src/lib/prisma.js");

async function seed() {
  console.log("Criando ou atualizando dados de desenvolvimento:", seedIds);

  await prisma.vessel.upsert({
    where: { id: seedIds.vessel },
    update: {
      name: "SafeAnchor Demo Vessel",
      type: "Lancha",
      status: "Ativa",
    },
    create: {
      id: seedIds.vessel,
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
