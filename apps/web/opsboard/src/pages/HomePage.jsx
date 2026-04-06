import heroLogo from "../assets/hero.png";
import { TaskStatusOverview } from "../components/Home/TaskStatusOverview";
import { Footer } from "../components/Shared/Footer";
import { Sidebar } from "../components/Shared/SideBar";
import { useHomeSummary } from "../hooks/useHomeSummary";

export function HomePage() {
  const { summary, loading, error, load } = useHomeSummary();

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="relative flex min-h-screen flex-1 flex-col overflow-hidden">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-linear-to-b from-cyan-500/10 to-transparent" />
          <div className="pointer-events-none absolute right-10 top-10 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="pointer-events-none absolute bottom-10 left-10 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />

          <section className="relative flex flex-1 items-center justify-center px-6 py-10">
            <div className="w-full max-w-6xl rounded-4xl border border-slate-800 bg-slate-900/70 p-8 shadow-2xl shadow-black/30 backdrop-blur md:p-12">
              <div className="grid items-center gap-10 xl:grid-cols-[0.95fr_1.05fr]">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.35em] text-cyan-400/80">
                    Tela principal
                  </p>
                  <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-5xl">
                    Visao geral do painel Opsboard
                  </h1>
                  <p className="mt-5 max-w-xl text-base leading-7 text-slate-300">
                    Acompanhe o total de tarefas e a distribuicao entre itens
                    aguardando execucao, em progresso e atrasados logo na
                    entrada do sistema.
                  </p>

                  <div className="mt-8 flex flex-wrap items-center gap-4 rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
                      <img
                        src={heroLogo}
                        alt="Logo da empresa"
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-100">
                        Central de operacoes
                      </p>
                      <p className="mt-1 max-w-md text-sm leading-6 text-slate-400">
                        Use a barra lateral para detalhar tarefas, equipes e
                        colaboradores. A home agora concentra o panorama rapido
                        do fluxo atual.
                      </p>
                    </div>
                  </div>
                </div>

                <TaskStatusOverview
                  summary={summary}
                  loading={loading}
                  error={error}
                  onRetry={load}
                />
              </div>
            </div>
          </section>
          <Footer />
        </div>
      </div>
    </main>
  );
}
