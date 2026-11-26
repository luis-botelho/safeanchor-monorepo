import { getFleetVessels } from "./vesselService";
import { getUpcomingMaintenance } from "./maintenanceService";
import { getDocuments } from "./documentService";
import { getInspections } from "./inspectionService";
import { activities, activityMeta } from "../mock/activity";

function clampScore(value) {
  return Math.max(0, Math.min(100, value));
}

function average(values) {
  if (values.length === 0) return 0;

  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function buildReadiness(vessels, upcoming, documents, inspections) {
  return vessels.map((vessel) => {
    const openMaintenances = upcoming.filter(
      (item) => item.vesselId === vessel.id,
    ).length;
    const vesselDocuments = documents.filter(
      (item) => item.vesselId === vessel.id,
    );
    const expiring = vesselDocuments.filter(
      (item) => item.status.key === "proximo",
    ).length;
    const expired = vesselDocuments.filter(
      (item) => item.status.key === "vencido",
    ).length;
    const activeInspections = inspections.filter(
      (item) =>
        item.vesselId === vessel.id &&
        (item.status === "scheduled" || item.status === "in_progress"),
    ).length;

    const readinessFactors = {
      maintenance: clampScore(100 - openMaintenances * 20),
      documentation: clampScore(100 - expired * 30 - expiring * 10),
      checklist: clampScore(100 - activeInspections * 15),
      safety: vessel.status === "OPERACIONAL" ? 100 : 70,
    };

    return {
      ...vessel,
      readinessFactors,
      readiness: average(Object.values(readinessFactors)),
    };
  });
}

export async function getDashboard() {
  const [loadedVessels, upcoming, allDocuments, inspections] = await Promise.all([
    getFleetVessels(),
    getUpcomingMaintenance(),
    getDocuments(),
    getInspections(),
  ]);

  const vessels = buildReadiness(
    loadedVessels,
    upcoming,
    allDocuments,
    inspections,
  );

  const expiring = allDocuments.filter(
    (document) =>
      document.status.key === "vencido" || document.status.key === "proximo",
  );

  const activityFeed = activities.map((activity) => ({
    ...activity,
    meta: activityMeta[activity.type],
  }));

  return {
    fleetOverview: {
      total: vessels.length,
      operational: vessels.filter((vessel) => vessel.status === "OPERACIONAL").length,
      attention: vessels.filter((vessel) => vessel.status !== "OPERACIONAL").length,
    },
    readiness: {
      total: average(vessels.map((vessel) => vessel.readiness)),
      factors: {
        maintenance: average(
          vessels.map((vessel) => vessel.readinessFactors.maintenance),
        ),
        documentation: average(
          vessels.map((vessel) => vessel.readinessFactors.documentation),
        ),
        checklist: average(
          vessels.map((vessel) => vessel.readinessFactors.checklist),
        ),
        safety: average(vessels.map((vessel) => vessel.readinessFactors.safety)),
      },
    },
    issues: {
      count: vessels.filter((vessel) => vessel.readiness < 80).length,
      maintenance: upcoming.length,
      documents: expiring.length,
    },
    upcomingMaintenance: upcoming.slice(0, 4),
    expiringDocuments: expiring.slice(0, 4),
    recentActivity: activityFeed,
    documentsSummary: {
      valid: allDocuments.filter((doc) => doc.status.key === "valido").length,
      expiring: allDocuments.filter((doc) => doc.status.key === "proximo").length,
      expired: allDocuments.filter((doc) => doc.status.key === "vencido").length,
    },
    vessels,
  };
}
