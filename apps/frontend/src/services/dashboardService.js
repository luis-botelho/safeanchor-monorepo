import { getFleetVessels } from "./vesselService";
import { getUpcomingMaintenance } from "./maintenanceService";
import { getExpiringDocuments, getDocuments } from "./documentService";
import { activities, activityMeta } from "../mock/activity";

export async function getDashboard() {
  const vessels = await getFleetVessels();
  const upcoming = await getUpcomingMaintenance();
  const expiring = await getExpiringDocuments();
  const allDocuments = await getDocuments();

  const readyVessels = vessels.filter(
    (vessel) => vessel.status === "OPERACIONAL",
  );
  const attentionVessels = vessels.filter(
    (vessel) => vessel.status !== "OPERACIONAL",
  );

  const issueCount = vessels.filter((vessel) => vessel.readiness < 80).length;

  const totalReadiness = vessels.length
    ? Math.round(
        vessels.reduce((sum, vessel) => sum + vessel.readiness, 0) /
          vessels.length,
      )
    : 0;

  const factorAverages = {
    maintenance: Math.round(
      vessels.reduce((sum, vessel) => sum + vessel.readinessFactors.maintenance, 0) /
        vessels.length,
    ),
    documentation: Math.round(
      vessels.reduce((sum, vessel) => sum + vessel.readinessFactors.documentation, 0) /
        vessels.length,
    ),
    checklist: Math.round(
      vessels.reduce((sum, vessel) => sum + vessel.readinessFactors.checklist, 0) /
        vessels.length,
    ),
    safety: Math.round(
      vessels.reduce((sum, vessel) => sum + vessel.readinessFactors.safety, 0) /
        vessels.length,
    ),
  };

  const activityFeed = activities.map((activity) => ({
    ...activity,
    meta: activityMeta[activity.type],
  }));

  return {
    fleetOverview: {
      total: vessels.length,
      operational: readyVessels.length,
      attention: attentionVessels.length,
    },
    readiness: {
      total: totalReadiness,
      factors: factorAverages,
    },
    issues: {
      count: issueCount,
      maintenance: upcoming.filter((item) => item.status === "Em andamento").length,
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