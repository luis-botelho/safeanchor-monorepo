import assert from "node:assert/strict";
import test from "node:test";
import prisma from "../src/lib/prisma.js";
import {
  createExecution,
  getChecklistExecutionsByVesselId,
} from "../src/services/checklistExecutionService.js";
import { createTemplate } from "../src/services/checklistTemplateService.js";
import {
  createMaintenance,
  getMaintenancesByVesselId,
} from "../src/services/maintenanceService.js";
import { createPreventiveMaintenance } from "../src/services/preventiveMaintenanceService.js";
import {
  createVessel,
  deleteVessel,
  getAllVessels,
  getVesselById,
  updateVessel,
} from "../src/services/vesselService.js";

const smokeEnabled = process.env.ALLOW_DATABASE_SMOKE === "true";

test(
  "Supabase persistence and cascades",
  { skip: !smokeEnabled },
  async () => {
    const marker = `codex-smoke-${Date.now()}`;
    const createdIds = {
      vesselId: null,
      maintenanceId: null,
      preventiveMaintenanceId: null,
      checklistTemplateId: null,
      checklistExecutionId: null,
    };

    try {
      const vessel = await createVessel({
        name: marker,
        type: "smoke-test",
        status: "created",
      });
      createdIds.vesselId = vessel.id;

      const vessels = await getAllVessels();
      assert.ok(vessels.some(({ id }) => id === vessel.id));
      assert.equal((await getVesselById(vessel.id))?.id, vessel.id);

      const updatedVessel = await updateVessel(vessel.id, {
        name: marker,
        type: "smoke-test",
        status: "updated",
      });
      assert.equal(updatedVessel.status, "updated");

      const maintenance = await createMaintenance({
        vesselId: vessel.id,
        title: marker,
        description: "Database smoke test",
        type: "Preventiva",
        date: "2026-08-12",
        status: "Pendente",
      });
      createdIds.maintenanceId = maintenance.id;

      const vesselMaintenances = await getMaintenancesByVesselId(vessel.id);
      assert.ok(vesselMaintenances.some(({ id }) => id === maintenance.id));

      const preventiveMaintenance = await createPreventiveMaintenance({
        title: marker,
        description: "Database smoke test",
        type: "Preventiva",
        status: "Pendente",
        vesselId: vessel.id,
        periodicity: "monthly",
        startDate: "2026-08-12",
      });
      createdIds.preventiveMaintenanceId = preventiveMaintenance.id;

      const template = await createTemplate({
        title: marker,
        vesselType: "smoke-test",
        items: [{ id: `${marker}-item`, label: "Smoke item" }],
      });
      createdIds.checklistTemplateId = template.id;

      const execution = await createExecution({
        templateId: template.id,
        vesselId: vessel.id,
        responses: [{ itemId: `${marker}-item`, checked: true }],
      });
      createdIds.checklistExecutionId = execution.id;

      const vesselExecutions = await getChecklistExecutionsByVesselId(vessel.id);
      assert.ok(vesselExecutions.some(({ id }) => id === execution.id));

      assert.equal(await deleteVessel(vessel.id), true);
      assert.equal(await prisma.vessel.findUnique({ where: { id: vessel.id } }), null);
      assert.equal(
        await prisma.maintenance.findUnique({ where: { id: maintenance.id } }),
        null,
      );
      assert.equal(
        await prisma.preventiveMaintenance.findUnique({
          where: { id: preventiveMaintenance.id },
        }),
        null,
      );
      assert.equal(
        await prisma.checklistExecution.findUnique({
          where: { id: execution.id },
        }),
        null,
      );

      await prisma.checklistTemplate.delete({ where: { id: template.id } });
      assert.equal(
        await prisma.checklistTemplate.findUnique({ where: { id: template.id } }),
        null,
      );
    } finally {
      if (createdIds.checklistExecutionId) {
        await prisma.checklistExecution.deleteMany({
          where: { id: createdIds.checklistExecutionId },
        });
      }

      if (createdIds.maintenanceId) {
        await prisma.maintenance.deleteMany({
          where: { id: createdIds.maintenanceId },
        });
      }

      if (createdIds.preventiveMaintenanceId) {
        await prisma.preventiveMaintenance.deleteMany({
          where: { id: createdIds.preventiveMaintenanceId },
        });
      }

      if (createdIds.checklistTemplateId) {
        await prisma.checklistTemplate.deleteMany({
          where: { id: createdIds.checklistTemplateId },
        });
      }

      if (createdIds.vesselId) {
        await prisma.vessel.deleteMany({ where: { id: createdIds.vesselId } });
      }

      const remainingRecords = await Promise.all([
        createdIds.vesselId
          ? prisma.vessel.findUnique({ where: { id: createdIds.vesselId } })
          : null,
        createdIds.maintenanceId
          ? prisma.maintenance.findUnique({
              where: { id: createdIds.maintenanceId },
            })
          : null,
        createdIds.preventiveMaintenanceId
          ? prisma.preventiveMaintenance.findUnique({
              where: { id: createdIds.preventiveMaintenanceId },
            })
          : null,
        createdIds.checklistTemplateId
          ? prisma.checklistTemplate.findUnique({
              where: { id: createdIds.checklistTemplateId },
            })
          : null,
        createdIds.checklistExecutionId
          ? prisma.checklistExecution.findUnique({
              where: { id: createdIds.checklistExecutionId },
            })
          : null,
      ]);

      console.log(
        "Smoke IDs:",
        JSON.stringify(
          Object.fromEntries(
            Object.entries(createdIds).filter(([, id]) => id !== null),
          ),
        ),
      );
      assert.deepEqual(remainingRecords, [null, null, null, null, null]);
      await prisma.$disconnect();
    }
  },
);
