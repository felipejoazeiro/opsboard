export function TaskCard({ task }) {
  const dueDateLabel = task.due_date
    ? new Date(task.due_date).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : null;

  const STATUS_COLORS = {
    "To Do": "bg-slate-700 text-slate-200",
    "In Progress": "bg-amber-500/20 text-amber-300",
    Done: "bg-emerald-500/20 text-emerald-300",
  };

  const PRIORITY_COLORS = {
    Low: "bg-sky-500/20 text-sky-300",
    Medium: "bg-amber-500/20 text-amber-300",
    High: "bg-rose-500/20 text-rose-300",
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 transition hover:border-slate-700">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[task.status] ?? "bg-slate-700 text-slate-200"}`}
        >
          {task.status}
        </span>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${PRIORITY_COLORS[task.priority] ?? "bg-slate-700 text-slate-200"}`}
        >
          {task.priority}
        </span>
      </div>
      <h3 className="mb-1 font-semibold text-slate-100">{task.title}</h3>
      {task.description && (
        <p className="mb-3 line-clamp-2 text-sm text-slate-400">
          {task.description}
        </p>
      )}
      {dueDateLabel && (
        <p className="text-xs text-slate-500">Prazo: {dueDateLabel}</p>
      )}

      <button
        className="mt-4 text-sm text-cyan-500 hover:underline"
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onEdit(task);
        }}
      >
        Edit Task
      </button>
    </div>
  );
}
