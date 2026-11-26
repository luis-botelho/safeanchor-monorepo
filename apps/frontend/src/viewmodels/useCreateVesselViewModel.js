import { useState } from "react";
import { createVessel } from "../services/vesselService";

export function useCreateVesselViewModel() {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [length, setLength] = useState("");
  const [year, setYear] = useState("");
  const [engine, setEngine] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    setError("");
    setSuccessMessage("");

    if (!name.trim()) {
      setError("Informe o nome da embarcação.");
      return false;
    }

    if (!type.trim()) {
      setError("Informe o tipo da embarcação.");
      return false;
    }

    if (!status.trim()) {
      setError("Informe o status da embarcação.");
      return false;
    }

    const profile = {
      category: category.trim() || null,
      length: length.trim() || null,
      year: year.trim() || null,
      engine: engine.trim() || null,
    };

    try {
      setIsLoading(true);

      await createVessel({
        name,
        type,
        status,
        ...profile,
      });

      setName("");
      setType("");
      setStatus("");
      setCategory("");
      setLength("");
      setYear("");
      setEngine("");
      setSuccessMessage("Embarcação cadastrada com sucesso.");

      return true;
    } catch (error) {
      setError(error.message || "Não foi possível cadastrar a embarcação.");

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
    category,
    setCategory,
    length,
    setLength,
    year,
    setYear,
    engine,
    setEngine,
    isLoading,
    error,
    submit,
    successMessage,
  };
}
