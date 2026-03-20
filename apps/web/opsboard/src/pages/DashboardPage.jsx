import { useCallback, useEffect, useState } from 'react'
import { Sidebar } from '../components/sidebar'
import { fetchTasks } from '../services/tasks.service'

const STATUS_OPTIONS = ['To Do', 'In Progress', 'Done']
const PRIORITY_OPTIONS = ['Low', 'Medium', 'High']

const STATUS_COLORS = {
  'To Do':       'bg-slate-700 text-slate-200',
  'In Progress': 'bg-amber-500/20 text-amber-300',
  'Done':        'bg-emerald-500/20 text-emerald-300',
}

const PRIORITY_COLORS = {
  Low:    'bg-sky-500/20 text-sky-300',
  Medium: 'bg-amber-500/20 text-amber-300',
  High:   'bg-rose-500/20 text-rose-300',
}

// ── Empty State ──────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-24 w-24 text-slate-700"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
      <p className="text-lg font-semibold text-slate-400">Nenhuma tarefa encontrada</p>
      <p className="text-sm text-slate-600">Tente ajustar os filtros ou adicione uma nova tarefa.</p>
    </div>
  )
}

// ── Error State ──────────────────────────────────────────────
function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-20 w-20 text-rose-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
        />
      </svg>
      <p className="text-lg font-semibold text-rose-400">Erro ao carregar tarefas</p>
      <p className="text-sm text-slate-500">{message}</p>
      <button
        onClick={onRetry}
        className="mt-2 rounded-lg bg-slate-700 px-5 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-600"
      >
        Tentar novamente
      </button>
    </div>
  )
}

// ── Task Card ────────────────────────────────────────────────
function TaskCard({ task }) {
  const dueDateLabel = task.due_date
    ? new Date(task.due_date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
    : null

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 transition hover:border-slate-700">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[task.status] ?? 'bg-slate-700 text-slate-200'}`}>
          {task.status}
        </span>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${PRIORITY_COLORS[task.priority] ?? 'bg-slate-700 text-slate-200'}`}>
          {task.priority}
        </span>
      </div>
      <h3 className="mb-1 font-semibold text-slate-100">{task.title}</h3>
      {task.description && (
        <p className="mb-3 line-clamp-2 text-sm text-slate-400">{task.description}</p>
      )}
      {dueDateLabel && (
        <p className="text-xs text-slate-500">Prazo: {dueDateLabel}</p>
      )}
    </div>
  )
}

// ── Dashboard Page ───────────────────────────────────────────
export function DashboardPage() {
  const [tasks,     setTasks]     = useState([])
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState(null)
  const [search,    setSearch]    = useState('')
  const [status,    setStatus]    = useState('')
  const [priority,  setPriority]  = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  // Debounce search input by 400 ms
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400)
    return () => clearTimeout(timer)
  }, [search])

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchTasks({
        search:   debouncedSearch || undefined,
        status:   status         || undefined,
        priority: priority       || undefined,
      })
      setTasks(result.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch, status, priority])

  useEffect(() => { load() }, [load])

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />

      <main className="flex-1 px-6 py-8 md:px-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-100">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">Acompanhe e gerencie as tarefas da equipe.</p>
        </div>

        {/* Toolbar */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar tarefa pelo nome..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2.5 pl-9 pr-4 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          {/* Status filter */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-200 outline-none transition focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
          >
            <option value="">Todos os status</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* Priority filter */}
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-200 outline-none transition focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
          >
            <option value="">Todas as prioridades</option>
            {PRIORITY_OPTIONS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        {/* Content */}
        {loading && (
          <div className="flex items-center justify-center py-24">
            <svg
              className="h-8 w-8 animate-spin text-cyan-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        )}

        {!loading && error && (
          <ErrorState message={error} onRetry={load} />
        )}

        {!loading && !error && tasks.length === 0 && (
          <EmptyState />
        )}

        {!loading && !error && tasks.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

