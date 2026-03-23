import { useState, useEffect, useCallback } from "react";
import { fetchTasks } from "../services/tasks.service";

export function useDashboard() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [priority, setPriority] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 400);
        return () => clearTimeout(timer);
    }, [search]);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await fetchTasks({
                search: debouncedSearch || undefined,
                status: status || undefined,
                priority: priority || undefined,
            });
            setTasks(result.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [debouncedSearch, status, priority]);

    useEffect(() => {
        load();
    }, [load]);

    return {
        tasks,
        loading,
        error,
        load,
        search,
        setSearch,
        status,
        setStatus,
        priority,
        setPriority,
        isNewTaskOpen,
        setIsNewTaskOpen,
    };
}