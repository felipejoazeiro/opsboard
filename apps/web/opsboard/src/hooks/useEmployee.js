import { useState, useEffect, useCallback } from "react";
import { fetchEmployees, fetchRoles } from "../services/employees.service";

export function useEmployee() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [isNewEmployeeOpen, setIsNewEmployeeOpen] = useState(false);
    const [isNewRoleOpen, setIsNewRoleOpen] = useState(false);
    const [roles, setRoles] = useState([]);
    const [editingEmployee, setEditingEmployee] = useState(null);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 400);
        return () => clearTimeout(timer);
    }, [search]);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await fetchEmployees({ search: debouncedSearch || undefined });
            setEmployees(Array.isArray(result.data) ? result.data : []);
        } catch (err) {
            setEmployees([]);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [debouncedSearch]);

    useEffect(() => {
        load();
    }, [load]);

    const loadRoles = useCallback(async () => {
        try {
            const result = await fetchRoles();
            setRoles(Array.isArray(result.data) ? result.data : []);
        } catch {
            setRoles([]);
        }
    }, []);

    useEffect(() => {
        loadRoles();
    }, [loadRoles]);

    return {
        employees,
        loading,
        error,
        load,
        search,
        setSearch,
        isNewEmployeeOpen,
        setIsNewEmployeeOpen,
        roles,
        loadRoles,
        editingEmployee,
        setEditingEmployee,
        isNewRoleOpen,
        setIsNewRoleOpen,
    };
}