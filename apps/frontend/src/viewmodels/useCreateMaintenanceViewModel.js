import { useEffect, useState } from "react";
import { createMaintenance } from "../services/maintenanceService";
import { getFleetVessels } from "../services/vesselService";

export function useCreateMaintenanceViewModel() {
  const [vessels, setVessels] = useState([]);
  const [vesselId, setVesselId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getFleetVessels()
      .then((list) => {
        if (!active) return;

        setVessels(list);
        setVesselId(list[0]?.id || "");
      })
      .catch((error) => {
        if (active) setError(error.message || "Não foi possível carregar a frota.");
      });

    return () => {
      active = false;
    };
  }, []);

  async function submit() {
    setError("");
    setSuccessMessage("");

    if (!vesselId) {
      setError("Selecione uma embarcação.");
      return;
    }

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
        vesselId,
        title,
        description,
        type,
        date,
        status,
      });

      setSuccessMessage("Manutenção cadastrada com sucesso.");

      return true;
    } catch (error) {
      setError(error.message || "Não foi possível cadastrar a manutenção.");

      return false;
    } finally {
      setIsLoading(false);
    }
  }

  return {
    vessels,
    vesselId,
    setVesselId,
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
