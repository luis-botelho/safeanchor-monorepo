import { useCallback, useEffect, useState } from "react";

import {
  getDirectorActions,
  getDirectorInsights,
  getDirectorResponses,
  getDirectorUsers,
  updateDirectorResponse,
  updateDirectorUser,
} from "../services/directorService";

const EMPTY_INSIGHTS = {
  total: 0,
  withContact: 0,
  last7Days: 0,
  byStatus: {},
  byProfile: {},
  byCity: {},
  latest: [],
};

export default function useDirectorViewModel() {
  const [insights, setInsights] = useState(EMPTY_INSIGHTS);
  const [responses, setResponses] = useState([]);
  const [users, setUsers] = useState([]);
  const [actions, setActions] = useState([]);
  const [filters, setFilters] = useState({ status: "", city: "", profile: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadResponses = useCallback(async (nextFilters = filters) => {
    const data = await getDirectorResponses(nextFilters);
    setResponses(Array.isArray(data) ? data : []);
  }, [filters]);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [nextInsights, nextResponses, nextUsers, nextActions] =
        await Promise.all([
          getDirectorInsights(),
          getDirectorResponses(filters),
          getDirectorUsers(),
          getDirectorActions(),
        ]);

      setInsights(nextInsights || EMPTY_INSIGHTS);
      setResponses(Array.isArray(nextResponses) ? nextResponses : []);
      setUsers(Array.isArray(nextUsers) ? nextUsers : []);
      setActions(Array.isArray(nextActions) ? nextActions : []);
    } catch (err) {
      setError(err.message || "Não foi possível carregar os dados da diretoria.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const applyFilters = useCallback((nextFilters) => {
    setFilters(nextFilters);
    setError("");
  }, []);

  const saveResponse = useCallback(
    async (id, payload) => {
      setSaving(true);
      setError("");
      setNotice("");
      try {
        await updateDirectorResponse(id, payload);
        setNotice("Decisão registrada e auditoria atualizada.");
        await Promise.all([loadResponses(filters), getDirectorInsights(), getDirectorActions()])
          .then(([nextResponses, nextInsights, nextActions]) => {
            setResponses(Array.isArray(nextResponses) ? nextResponses : []);
            setInsights(nextInsights || EMPTY_INSIGHTS);
            setActions(Array.isArray(nextActions) ? nextActions : []);
          });
        return true;
      } catch (err) {
        setError(err.message || "Não foi possível salvar a decisão.");
        return false;
      } finally {
        setSaving(false);
      }
    },
    [filters, loadResponses]
  );

  const saveUser = useCallback(
    async (id, payload) => {
      setSaving(true);
      setError("");
      setNotice("");
      try {
        await updateDirectorUser(id, payload);
        setNotice("Alteração aplicada e auditoria atualizada.");
        const [nextUsers, nextActions] = await Promise.all([
          getDirectorUsers(),
          getDirectorActions(),
        ]);
        setUsers(Array.isArray(nextUsers) ? nextUsers : []);
        setActions(Array.isArray(nextActions) ? nextActions : []);
        return true;
      } catch (err) {
        setError(err.message || "Não foi possível alterar o usuário.");
        return false;
      } finally {
        setSaving(false);
      }
    },
    []
  );

  return {
    insights,
    responses,
    users,
    actions,
    filters,
    loading,
    saving,
    error,
    notice,
    applyFilters,
    saveResponse,
    saveUser,
    refresh: loadAll,
  };
}
