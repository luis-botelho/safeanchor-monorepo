import { useEffect, useState } from "react";
import { getMaintenancesByVesselId } from "../services/maintenanceService";

export function useMaintenanceHistoryViewModel(vesselId) {
  const [maintenances, setMaintenances] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  useEffect(() => {
    async function loadMaintenances() {
      try {
        setIsLoading(true);

        const data = await getMaintenancesByVesselId(vesselId);

        setMaintenances(data);
      } catch {
        setError("Não foi possível carregar o histórico.");
      } finally {
        setIsLoading(false);
      }
    }

    loadMaintenances();
  }, [vesselId]);
  const filteredMaintenances = maintenances.filter((maintenance) => {
    const matchStatus = !statusFilter || maintenance.status === statusFilter;
    const matchType = !typeFilter || maintenance.type === typeFilter;

    return matchStatus && matchType;
  });
  return {
    maintenances: filteredMaintenances,

    statusFilter,
    setStatusFilter,

    typeFilter,
    setTypeFilter,

    isLoading,
    error,
  };
}
