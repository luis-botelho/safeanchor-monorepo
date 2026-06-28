import { useEffect, useState } from "react";
import { getVesselById } from "../services/vesselService";

export function useVesselDetailsViewModel(id) {
  const [vessel, setVessel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadVessel() {
      try {
        const loadedVessel = await getVesselById(id);
        setVessel(loadedVessel.vessel);
      } catch (error) {
        setError("Não foi possível carregar a embarcação.");
      } finally {
        setIsLoading(false);
      }

    }

    loadVessel();
  }, [id]);

  return {
    vessel,
    isLoading,
    error,
  };
}
