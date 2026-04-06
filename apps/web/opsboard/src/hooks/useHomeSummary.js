import { useCallback, useEffect, useState } from "react";
import { fetchTaskSummary } from "../services/tasks.service";

export function useHomeSummary() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchTaskSummary();
      setSummary(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return {
    summary,
    loading,
    error,
    load,
  };
}