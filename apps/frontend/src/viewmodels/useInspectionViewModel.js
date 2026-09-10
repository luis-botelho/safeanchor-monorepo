import { useCallback, useEffect, useState } from "react";
import {
  getInspections,
  getInspectionById,
  createInspection,
  updateChecklistItem,
  completeInspection,
  cancelInspection,
  getInspectionTypes,
  getInspectionStatuses,
  getChecklistItemStatuses,
} from "../services/inspectionService";
import { getVessels } from "../services/vesselService";

export function useInspectionsViewModel() {
  const [inspections, setInspections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setIsLoading(true);
        const data = await getInspections();
        setInspections(data);
      } catch {
        setError("Não foi possível carregar as inspeções.");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  return { inspections, isLoading, error };
}

export function useInspectionDetailViewModel(id) {
  const [inspection, setInspection] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    async function load() {
      try {
        setIsLoading(true);
        const data = await getInspectionById(id);
        setInspection(data);
      } catch {
        setError("Não foi possível carregar a inspeção.");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [id]);

  const handleUpdateChecklist = useCallback(
    async (itemIndex, status, notes) => {
      const updated = await updateChecklistItem(id, itemIndex, status, notes);
      if (updated) setInspection({ ...updated });
      return updated;
    },
    [id],
  );

  const handleComplete = useCallback(async () => {
    const updated = await completeInspection(id);
    if (updated) setInspection({ ...updated });
    return updated;
  }, [id]);

  const handleCancel = useCallback(async () => {
    const updated = await cancelInspection(id);
    if (updated) setInspection({ ...updated });
    return updated;
  }, [id]);

  return {
    inspection,
    isLoading,
    error,
    updateChecklist: handleUpdateChecklist,
    completeInspection: handleComplete,
    cancelInspection: handleCancel,
  };
}

export function useNewInspectionViewModel() {
  const [vessels, setVessels] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getVessels().then((result) => setVessels(result.vessels || []));
  }, []);

  const handleSubmit = useCallback(async (data) => {
    try {
      setIsSubmitting(true);
      setError("");
      const result = await createInspection(data);
      return result;
    } catch {
      setError("Não foi possível criar a inspeção.");
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return {
    vessels,
    isSubmitting,
    error,
    handleSubmit,
    inspectionTypes: getInspectionTypes(),
  };
}

export function getInspectionTypeLabel(value) {
  const types = getInspectionTypes();
  const found = types.find((t) => t.value === value);
  return found ? found.label : value;
}

export function getInspectionStatusLabel(value) {
  const statuses = getInspectionStatuses();
  const found = statuses.find((s) => s.value === value);
  return found ? found.label : value;
}

export function getInspectionStatusTone(value) {
  const statuses = getInspectionStatuses();
  const found = statuses.find((s) => s.value === value);
  return found ? found.tone : "neutral";
}

export function getChecklistItemStatusLabel(value) {
  const statuses = getChecklistItemStatuses();
  const found = statuses.find((s) => s.value === value);
  return found ? found.label : value;
}

export function getChecklistItemStatusTone(value) {
  const statuses = getChecklistItemStatuses();
  const found = statuses.find((s) => s.value === value);
  return found ? found.tone : "neutral";
}
