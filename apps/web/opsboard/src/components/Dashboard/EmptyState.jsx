export function EmptyState() {
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
