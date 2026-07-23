import { useState } from "react";
import {
  createChecklistExecution,
  getChecklistExecutions,
} from "../services/checklistExecutionService";

export function useChecklistExecutionViewModel() {
  const [templateId, setTemplateId] = useState("");
  const [vesselId, setVesselId] = useState("");
  const [responses, setResponses] = useState("");
  const [executedAt, setExecutedAt] = useState("");

  const [checklistExecutions, setChecklistExecutions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function submit() {
    setError("");
    setSuccessMessage("");

    if (!templateId) {
      setError("Informe o template.");
      return false;
    }

    if (!vesselId) {
      setError("Informe a embarcação.");
      return false;
    }

    if (!responses.trim()) {
      setError("Informe ao menos uma resposta.");
      return false;
    }

    if (!executedAt) {
      setError("Informe a data e hora da execução.");
      return false;
    }

    try {
      setIsLoading(true);

      await createChecklistExecution({
        templateId,
        vesselId,
        responses: responses
          .split("\n")
          .map((response) => response.trim())
          .filter(Boolean),
        executedAt,
      });

      setSuccessMessage("Execução de checklist cadastrada com sucesso.");

      return true;
    } catch {
      setError("Não foi possível cadastrar a execução de checklist.");

      return false;
    } finally {
      setIsLoading(false);
    }
  }

  async function loadChecklistExecutions() {
    setError("");

    try {
      setIsLoadingList(true);
      const data = await getChecklistExecutions();
      setChecklistExecutions(data);
    } catch {
      setError("Não foi possível carregar as execuções de checklist.");
    } finally {
      setIsLoadingList(false);
    }
  }

  return {
    templateId,
    setTemplateId,

    vesselId,
    setVesselId,

    responses,
    setResponses,

    executedAt,
    setExecutedAt,

    checklistExecutions,
    loadChecklistExecutions,

    submit,

    isLoading,
    isLoadingList,
    error,
    successMessage,
  };
}