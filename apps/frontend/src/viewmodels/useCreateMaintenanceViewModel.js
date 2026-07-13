import { useState } from "react";
import { createMaintenance } from "../services/maintenanceService";

export function useCreateMaintenanceViewModel() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    setError("");
    setSuccessMessage("");
    if (!title.trim()) {
      setError("Informe o título da manutenção.");
      return;
    }

    if (!description.trim()) {
      setError("Informe a descrição da manutenção.");
      return;
    }

    if (!type.trim()) {
      setError("Informe o tipo da manutenção.");
      return;
    }

    if (!date) {
      setError("Informe a data da manutenção.");
      return;
    }

    if (!status.trim()) {
      setError("Informe o status da manutenção.");
      return;
    }
    try {
      setIsLoading(true);
      await createMaintenance({
        title,
        description,
        type,
        date,
        status,
      });
      setSuccessMessage("Manutenção cadastrada com sucesso.");

      return true;
    } catch {
      setError("Não foi possível cadastrar a manutenção.");

      return false;
    } finally {
      setIsLoading(false);
    }
  }
  return {
    title,
    setTitle,

    description,
    setDescription,

    type,
    setType,

    date,
    setDate,

    status,
    setStatus,

    submit,

    isLoading,
    error,
    successMessage,
  };
}
