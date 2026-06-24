import { useState } from "react";
import { createVessel } from "../services/vesselCreateService";

export function useCreateVesselViewModel() {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    try {
      setIsLoading(true);
      setError("");

      await createVessel({
        name,
        type,
        status,
      });
      


    } catch {
      setError("Nao foi possivel cadastrar a embarcacao.");
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
  };
}