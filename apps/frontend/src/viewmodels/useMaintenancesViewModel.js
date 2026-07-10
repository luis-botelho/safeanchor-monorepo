import { useEffect, useState } from "react";
import { getMaintenances } from "../services/maintenanceService";

export function useMaintenancesViewModel() {
  const [maintenances, setMaintenances] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMaintenances() {
      try {
        setIsLoading(true); // Garante o loading se o hook reexecutar
        const data = await getMaintenances();
        setMaintenances(data);
      } catch (err) {
        setError("Não foi possível carregar as manutenções.");
      } finally {
        setIsLoading(false);
      }
    }

    loadMaintenances();
  }, []); // <--- Array de dependências vazio para rodar apenas uma vez no mount

  return {
    maintenances,
    isLoading,
    error,
  };
}