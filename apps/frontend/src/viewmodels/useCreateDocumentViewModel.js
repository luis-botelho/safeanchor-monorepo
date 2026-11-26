import { useEffect, useState } from "react";

import { createDocument } from "../services/documentService";
import { getFleetVessels } from "../services/vesselService";

export function useCreateDocumentViewModel() {
  const [vessels, setVessels] = useState([]);
  const [vesselId, setVesselId] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [number, setNumber] = useState("");
  const [validFrom, setValidFrom] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [provider, setProvider] = useState("");

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
      return false;
    }

    if (!name.trim()) {
      setError("Informe o nome do documento.");
      return false;
    }

    if (!category.trim()) {
      setError("Informe a categoria do documento.");
      return false;
    }

    if (!number.trim()) {
      setError("Informe o número do documento.");
      return false;
    }

    if (!validFrom) {
      setError("Informe a data de início da validade.");
      return false;
    }

    if (!expiresAt) {
      setError("Informe a data de vencimento.");
      return false;
    }

    if (expiresAt < validFrom) {
      setError("A data de vencimento deve ser posterior ao início da validade.");
      return false;
    }

    try {
      setIsLoading(true);

      await createDocument({
        vesselId,
        name: name.trim(),
        category,
        number: number.trim(),
        validFrom,
        expiresAt,
        provider: provider.trim() || null,
      });

      setName("");
      setCategory("");
      setNumber("");
      setValidFrom("");
      setExpiresAt("");
      setProvider("");
      setSuccessMessage("Documento cadastrado com sucesso.");

      return true;
    } catch (error) {
      setError(error.message || "Não foi possível cadastrar o documento.");

      return false;
    } finally {
      setIsLoading(false);
    }
  }

  return {
    vessels,
    vesselId,
    setVesselId,
    name,
    setName,
    category,
    setCategory,
    number,
    setNumber,
    validFrom,
    setValidFrom,
    expiresAt,
    setExpiresAt,
    provider,
    setProvider,
    submit,
    isLoading,
    error,
    successMessage,
  };
}
