import { useEffect, useState } from "react";
import { getMaintenancesByVesselId } from "../services/maintenanceService";

export function useMaintenanceHistoryViewModel(vesselId) {
  const [maintenances, setMaintenances] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

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

  return {
    maintenances,
    isLoading,
    error,
  };
}