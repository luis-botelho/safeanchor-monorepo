import { useState} from "react";
import { createPreventiveMaintenance } from "../services/preventiveMaintenanceService";

export function usePreventiveMaintenanceViewModel() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [vesselId, setVesselId] = useState("");
  const [periodicity, setPeriodicity] = useState("");
  const [startDate, setStartDate] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function submit() {
    setError("");
    setSuccessMessage("");

    if (!title.trim()) {
      setError("Informe o título.");
      return false;
    }

    if (!description.trim()) {
      setError("Informe a descrição.");
      return false;
    }

    if (!type.trim()) {
      setError("Informe o tipo.");
      return false;
    }

    if (!status.trim()) {
      setError("Informe o status.");
      return false;
    }

    if (!vesselId) {
      setError("Informe a embarcação.");
      return false;
    }

    if (!periodicity) {
      setError("Informe a periodicidade.");
      return false;
    }

    if (!startDate) {
      setError("Informe a data inicial.");
      return false;
    }

    try {
      setIsLoading(true);

      await createPreventiveMaintenance({
        title,
        description,
        type,
        status,
        vesselId,
        periodicity,
        startDate,
      });

      setSuccessMessage(
        "Manutenção preventiva cadastrada com sucesso."
      );

      return true;
    } catch {
      setError("Não foi possível cadastrar a manutenção preventiva.");
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

    status,
    setStatus,

    vesselId,
    setVesselId,

    periodicity,
    setPeriodicity,

    startDate,
    setStartDate,

    submit,

    isLoading,
    error,
    successMessage,
  };
}