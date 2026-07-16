import { useEffect, useState } from "react";
import { getPreventiveMaintenances } from "../services/preventiveMaintenanceService";

export function usePreventiveMaintenancesViewModel() {
  const [preventiveMaintenances, setPreventiveMaintenances] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPreventiveMaintenances() {
      try {
        const data = await getPreventiveMaintenances();
        setPreventiveMaintenances(data);
      } catch {
        setError("Não foi possível carregar as manutenções preventivas.");
      } finally {
        setIsLoading(false);
      }
    }

    loadPreventiveMaintenances();
  }, []);

  return {
    preventiveMaintenances,
    isLoading,
    error,
  };
}