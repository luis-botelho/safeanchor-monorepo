import { useEffect, useState } from "react";
import { getInspectionsByVessel } from "../services/inspectionService";

export function useInspectionHistoryViewModel(vesselId) {
  const [inspections, setInspections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    loadInspections();
  }, [vesselId]);

  async function loadInspections() {
    try {
      setIsLoading(true);
      setError("");

      const data = await getInspectionsByVessel(vesselId);

      setInspections(data);
    } catch {
      setError("Não foi possível carregar o histórico de inspeções.");
    } finally {
      setIsLoading(false);
    }
  }

  const orderedInspections = [...inspections].sort((a, b) => {
    if (sortOrder === "desc") {
      return new Date(b.executedAt) - new Date(a.executedAt);
    }

    return new Date(a.executedAt) - new Date(b.executedAt);
  });

  return {
    inspections,
    isLoading,
    error,
    loadInspections,
    orderedInspections,
    sortOrder,
    setSortOrder,
  };
}
