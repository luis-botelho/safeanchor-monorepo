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
      ownerPartyId: `smoke-party-${marker}`,
      vesselId: null,
      maintenanceId: null,
      preventiveMaintenanceId: null,
      checklistTemplateId: null,
      checklistExecutionId: null,
    };
    const adminScope = {
      isAdmin: true,
      partyId: createdIds.ownerPartyId,
      partyIds: null,
    };

    try {
      await prisma.party.create({
        data: {
          id: createdIds.ownerPartyId,
          type: "USER",
        },
      });

      const vessel = await createVessel(adminScope, {
        name: marker,
        type: "smoke-test",
        status: "created",
      });
      createdIds.vesselId = vessel.id;
      assert.equal(vessel.ownerPartyId, createdIds.ownerPartyId);

      const vessels = await getAllVessels(adminScope);
      assert.ok(vessels.some(({ id }) => id === vessel.id));
      assert.equal((await getVesselById(adminScope, vessel.id))?.id, vessel.id);

      const updatedVessel = await updateVessel(adminScope, vessel.id, {
        name: marker,
        type: "smoke-test",
        status: "updated",
      });
      assert.equal(updatedVessel.status, "updated");

      const maintenance = await createMaintenance(adminScope, {
        vesselId: vessel.id,
        title: marker,
        description: "Database smoke test",
        type: "Preventiva",
        date: "2026-08-12",
        status: "Pendente",
      });
      createdIds.maintenanceId = maintenance.id;

      const vesselMaintenances = await getMaintenancesByVesselId(adminScope, vessel.id);
      assert.ok(vesselMaintenances.some(({ id }) => id === maintenance.id));

      const preventiveMaintenance = await createPreventiveMaintenance(adminScope, {
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

      const execution = await createExecution(adminScope, {
        templateId: template.id,
        vesselId: vessel.id,
        responses: [{ itemId: `${marker}-item`, checked: true }],
      });
      createdIds.checklistExecutionId = execution.id;

      const vesselExecutions = await getChecklistExecutionsByVesselId(adminScope, vessel.id);
      assert.ok(vesselExecutions.some(({ id }) => id === execution.id));

      assert.equal(await deleteVessel(adminScope, vessel.id), true);
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

      await prisma.party.deleteMany({
        where: { id: createdIds.ownerPartyId },
      });

      const remainingRecords = await Promise.all([
        createdIds.ownerPartyId
          ? prisma.party.findUnique({ where: { id: createdIds.ownerPartyId } })
          : null,
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
      assert.deepEqual(remainingRecords, [null, null, null, null, null, null]);
      await prisma.$disconnect();
    }
  },
);
