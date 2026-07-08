import { useEffect, useState } from "react";
import { deleteVessel, getVesselById } from "../services/vesselService";

export function useVesselDetailsViewModel(id) {
  const [vessel, setVessel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadVessel() {
      try {
        setIsLoading(true);
        setError("");
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

  async function removeVessel() {
    try {
      await deleteVessel(id);
    } catch (error) {
      throw new Error(error.message || "Não foi possível excluir a embarcação.");
    }
  }

  return {
    vessel,
    isLoading,
    error,
    removeVessel,
  };
}
