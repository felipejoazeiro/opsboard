export function Header({ setIsNewTaskOpen }) {
  return (
    <div className="mb-8 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Acompanhe e gerencie as tarefas da equipe.
        </p>
      </div>
      <button
        type="button"
        onClick={() => setIsNewTaskOpen(true)}
        className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
      >
        + Nova tarefa
      </button>
    </div>
  );
}
