import { useState, useEffect, useCallback } from "react";
import { fetchTeams } from "../services/teams.service";

export function useTeams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isNewTeamOpen, setIsNewTeamOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [addingMembersTeam, setAddingMembersTeam] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchTeams({ search: debouncedSearch || undefined });
      setTeams(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    teams,
    loading,
    error,
    load,
    search,
    setSearch,
    debouncedSearch,
    isNewTeamOpen,
    setIsNewTeamOpen,
    editingTeam,
    setEditingTeam,
    addingMembersTeam,
    setAddingMembersTeam,
  };
}
