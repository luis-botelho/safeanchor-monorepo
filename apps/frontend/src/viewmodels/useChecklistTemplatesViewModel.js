import { useState } from "react";
import { createChecklistTemplate } from "../services/checklistTemplateService";

export function useChecklistTemplatesViewModel() {
  const [title, setTitle] = useState("");
  const [vesselType, setVesselType] = useState("");
  const [items, setItems] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function submit() {
    setError("");
    setSuccessMessage("");

    if (!title.trim()) {
      setError("Informe o título do checklist.");
      return false;
    }

    if (!vesselType.trim()) {
      setError("Informe o tipo da embarcação.");
      return false;
    }

    if (!items.trim()) {
      setError("Informe ao menos um item.");
      return false;
    }

    try {
      setIsLoading(true);

      await createChecklistTemplate({
        title,
        vesselType,
        items: items
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
      });

      setSuccessMessage("Template criado com sucesso.");

      return true;
    } catch {
      setError("Não foi possível criar o template.");

      return false;
    } finally {
      setIsLoading(false);
    }
  }

  return {
    title,
    setTitle,

    vesselType,
    setVesselType,

    items,
    setItems,

    submit,

    isLoading,
    error,
    successMessage,
  };
}