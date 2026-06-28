import { useState } from "react";
import { createVessel } from "../services/vesselService";

export function useCreateVesselViewModel() {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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
      setError("");

      await createVessel({
        name,
        type,
        status,
      });
      setName("");
      setType("");
      setStatus("");
      setError("");
      setSuccessMessage("Embarcação cadastrada com sucesso.");
      return true
    } catch {
      setError("Nao foi possivel cadastrar a embarcacao.");
      return false
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
