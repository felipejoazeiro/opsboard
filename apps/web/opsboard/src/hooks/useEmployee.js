import { useState, useEffect, useCallback } from "react";
import { fetchEmployees } from "../services/employees.service";

export function useEmployee() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [isNewEmployeeOpen, setIsNewEmployeeOpen] = useState(false);
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
            setEmployees(result.data);
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
        employees,
        loading,
        error,
        isAddEmployeeOpen,
        setIsAddEmployeeOpen,
        search,
        setSearch,
        isNewEmployeeOpen,
        setIsNewEmployeeOpen,
        editingEmployee,
        setEditingEmployee,
    };
}