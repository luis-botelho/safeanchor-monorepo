import { useEffect, useState } from "react";
import { deleteVessel, getVesselById } from "../services/vesselService";

export function useVesselDetailsViewModel(id) {
  const [vessel, setVessel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadVessel() {
      try {
        setIsLoading(true);
        setError("");
        const loadedVessel = await getVesselById(id);

        if (!active) return;

        setVessel(loadedVessel.vessel);
      } catch (error) {
        if (!active) return;

        setError(error.message || "Não foi possível carregar a embarcação.");
      } finally {
        if (active) setIsLoading(false);
      }
    }

    loadVessel();

    return () => {
      active = false;
    };
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
