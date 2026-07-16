import { useEffect, useState } from "react";
import { getMaintenanceDashboard } from "../services/maintenanceDashboardService";

export function useMaintenanceDashboardViewModel() {
  const [dashboard, setDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const data = await getMaintenanceDashboard();
        setDashboard(data);
      } catch {
        setError("Não foi possível carregar o dashboard.");
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboard();
  }, []);

  return {
    dashboard,
    isLoading,
    error,
  };
}