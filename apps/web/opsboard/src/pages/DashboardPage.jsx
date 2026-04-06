import { Sidebar } from "../components/Shared/SideBar";
import { TaskStatusOverview } from "../components/Home/TaskStatusOverview";
import { useHomeSummary } from "../hooks/useHomeSummary";

export function DashboardPage() {
  const { summary, loading, error, load } = useHomeSummary();
  const infoCards = [
    {
      label: "Total de tarefas",
      value: summary?.total ?? 0,
      helper: "Volume geral registrado no sistema.",
    },
    {
      label: "Tarefas ativas",
      value: summary?.active ?? 0,
      helper: "Itens entre To Do, In Progress e Late.",
    },
    {
      label: "Concluidas",
      value: summary?.done ?? 0,
      helper: "Tarefas finalizadas fora do grafico principal.",
    },
  ];

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />

      <main className="relative flex-1 overflow-hidden px-6 py-8 md:px-10">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-linear-to-b from-cyan-500/10 to-transparent" />
        <div className="pointer-events-none absolute right-10 top-10 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />

        <section className="relative space-y-8">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.35em] text-cyan-400/80">
              Dashboard
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-5xl">
              Visao consolidada das tarefas
            </h1>
            <p className="mt-5 text-base leading-7 text-slate-300">
              Esta tela concentra os indicadores do fluxo operacional. Para
              criar, editar e filtrar tarefas, use a tela Tarefas no menu.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {infoCards.map((card) => (
              <article
                key={card.label}
                className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg shadow-black/20"
              >
                <p className="text-sm text-slate-400">{card.label}</p>
                <p className="mt-3 text-4xl font-semibold text-white">
                  {card.value}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {card.helper}
                </p>
              </article>
            ))}
          </div>

          <TaskStatusOverview
            summary={summary}
            loading={loading}
            error={error}
            onRetry={load}
          />
        </section>
      </main>
    </div>
  );
}
