import { useCallback, useEffect, useState } from "react";
import { Sidebar } from "../components/Shared/SideBar";
import { createTask, fetchTasks } from "../services/tasks.service";
import { Header } from "../components/Dashboard/Header";
import { EmptyState } from "../components/Dashboard/EmptyState";
import { NewTaskCard } from "../components/Dashboard/NewTaskCard";
import { ErrorState } from "../components/Dashboard/ErrorState";
import { SearchInput } from "../components/Dashboard/SearchInput";

const STATUS_OPTIONS = ["To Do", "In Progress", "Done"];
const PRIORITY_OPTIONS = ["Low", "Medium", "High"];

export function DashboardPage() {
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

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />

      <main className="flex-1 px-6 py-8 md:px-10">
        <Header setIsNewTaskOpen={setIsNewTaskOpen} />
        <SearchInput
          value={search}
          onChange={setSearch}
          status={status}
          setStatus={setStatus}
          priority={priority}
          setPriority={setPriority}
          STATUS_OPTIONS={STATUS_OPTIONS}
          PRIORITY_OPTIONS={PRIORITY_OPTIONS}
        />

        {loading && (
          <div className="flex items-center justify-center py-24">
            <svg
              className="h-8 w-8 animate-spin text-cyan-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          </div>
        )}

        {!loading && error && <ErrorState message={error} onRetry={load} />}

        {!loading && !error && tasks.length === 0 && <EmptyState />}

        {!loading && !error && tasks.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}
      </main>

      {isNewTaskOpen && (
        <NewTaskCard
          onClose={() => setIsNewTaskOpen(false)}
          onCreated={load}
          createTask={createTask}
          STATUS_OPTIONS={STATUS_OPTIONS}
          PRIORITY_OPTIONS={PRIORITY_OPTIONS}
        />
      )}
    </div>
  );
}
