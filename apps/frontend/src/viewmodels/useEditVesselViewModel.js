import { useEffect, useState } from "react";
import { updateVessel, getVesselById } from "../services/vesselService";

export function useEditVesselViewModel(id) {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadVessel() {
      try {
        const loadedVessel = await getVesselById(id);
        setName(loadedVessel.vessel.name);
        setType(loadedVessel.vessel.type);
        setStatus(loadedVessel.vessel.status);
      } catch {
        setError("Não foi possível carregar a embarcação")
      } finally {
        setIsLoading(false)
      }
    }
    loadVessel();
  }, [id]);

  async function submit() {
    setError("");
    setSuccessMessage("");
    if (!name.trim()) {
      setError("Informe o nome da embarcação.");
      return;
    }

    if (!type.trim()) {
      setError("Informe o tipo da embarcação.");
      return;
    }

    if (!status.trim()) {
      setError("Informe o status da embarcação.");
      return;
    }
    try {
      setIsLoading(true);

      await updateVessel(id, {
        name,
        type,
        status,
      });
      setError("");
      setSuccessMessage("Embarcação atualizada com sucesso.");
      return true;
    } catch {
      setError("Nao foi possivel atualizar a embarcacao.");
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  return {
    name,
    setName,

    type,
    setType,

    status,
    setStatus,

    isLoading,
    error,

    submit,
    successMessage,
  };
}
