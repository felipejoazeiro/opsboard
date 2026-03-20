import heroLogo from "../assets/hero.png";
import { Footer } from "../components/Shared/Footer";
import { Sidebar } from "../components/Shared/SideBar";

export function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="relative flex min-h-screen flex-1 flex-col overflow-hidden">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-linear-to-b from-cyan-500/10 to-transparent" />
          <div className="pointer-events-none absolute right-10 top-10 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="pointer-events-none absolute bottom-10 left-10 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />

          <section className="relative flex flex-1 items-center justify-center px-6 py-10">
            <div className="w-full max-w-4xl rounded-4xl border border-slate-800 bg-slate-900/70 p-8 shadow-2xl shadow-black/30 backdrop-blur md:p-12">
              <div className="grid items-center gap-10 md:grid-cols-[1.1fr_0.9fr]">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.35em] text-cyan-400/80">
                    Tela principal
                  </p>
                  <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-5xl">
                    Estrutura inicial do painel Opsboard
                  </h1>
                  <p className="mt-5 max-w-xl text-base leading-7 text-slate-300">
                    Esta tela inicial usa a barra lateral como navegacao
                    principal, uma area central para sua marca e um rodape
                    simples para informacoes institucionais.
                  </p>
                </div>

                <div className="flex justify-center md:justify-end">
                  <div className="rounded-4xl border border-slate-800 bg-slate-950/80 p-6 shadow-xl shadow-black/40">
                    <img
                      src={heroLogo}
                      alt="Logo da empresa"
                      className="h-auto w-full max-w-xs object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
          <Footer />
        </div>
      </div>
    </main>
  );
}
