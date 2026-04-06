const SEGMENT_STYLES = {
  todo: {
    label: "To Do",
    color: "#38bdf8",
    badgeClass: "bg-sky-500/15 text-sky-200 ring-1 ring-sky-400/20",
  },
  inProgress: {
    label: "In Progress",
    color: "#f59e0b",
    badgeClass: "bg-amber-500/15 text-amber-200 ring-1 ring-amber-400/20",
  },
  late: {
    label: "Late",
    color: "#f43f5e",
    badgeClass: "bg-rose-500/15 text-rose-200 ring-1 ring-rose-400/20",
  },
};

function buildChartSegments(distribution, total, radius) {
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return Object.entries(SEGMENT_STYLES).map(([key, config]) => {
    const value = distribution?.[key] ?? 0;
    const segmentLength = total > 0 ? (value / total) * circumference : 0;
    const segment = {
      key,
      ...config,
      value,
      percentage: total > 0 ? Math.round((value / total) * 100) : 0,
      dashArray: `${segmentLength} ${circumference}`,
      dashOffset: -offset,
    };

    offset += segmentLength;
    return segment;
  });
}

export function TaskStatusOverview({ summary, loading, error, onRetry }) {
  const distribution = summary?.distribution ?? {
    todo: 0,
    inProgress: 0,
    late: 0,
  };
  const totalTasks = summary?.total ?? 0;
  const activeTasks = summary?.active ?? 0;
  const doneTasks = summary?.done ?? 0;
  const radius = 54;
  const chartSegments = buildChartSegments(distribution, activeTasks, radius);

  return (
    <div className="rounded-4xl border border-slate-800 bg-slate-950/80 p-6 shadow-xl shadow-black/40">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-400/75">
            Panorama
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-white">
            Distribuicao das tarefas
          </h2>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-right">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
            Total
          </p>
          <p className="mt-2 text-3xl font-semibold text-white">{totalTasks}</p>
        </div>
      </div>

      {loading && (
        <div className="mt-8 grid gap-6 md:grid-cols-[220px_1fr] md:items-center">
          <div className="mx-auto h-44 w-44 animate-pulse rounded-full border border-slate-800 bg-slate-900" />
          <div className="space-y-3">
            <div className="h-4 w-40 animate-pulse rounded-full bg-slate-800" />
            <div className="h-16 animate-pulse rounded-3xl bg-slate-900" />
            <div className="h-16 animate-pulse rounded-3xl bg-slate-900" />
            <div className="h-16 animate-pulse rounded-3xl bg-slate-900" />
          </div>
        </div>
      )}

      {!loading && error && (
        <div className="mt-8 rounded-3xl border border-rose-500/30 bg-rose-500/10 p-5 text-sm text-rose-100">
          <p className="font-medium">Nao foi possivel carregar o grafico.</p>
          <p className="mt-2 text-rose-100/80">{error}</p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-4 inline-flex rounded-full border border-rose-400/30 px-4 py-2 text-sm font-medium text-rose-100 transition hover:border-rose-300/50 hover:bg-rose-500/10"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="mt-8 grid gap-6 md:grid-cols-[220px_1fr] md:items-center">
          <div className="mx-auto flex w-full max-w-55 flex-col items-center gap-4">
            <div className="relative flex h-44 w-44 items-center justify-center">
              <svg
                viewBox="0 0 140 140"
                className="h-44 w-44 -rotate-90"
                role="img"
                aria-label="Grafico de distribuicao de tarefas"
              >
                <circle
                  cx="70"
                  cy="70"
                  r={radius}
                  fill="transparent"
                  stroke="#1e293b"
                  strokeWidth="18"
                />
                {chartSegments.map((segment) => (
                  <circle
                    key={segment.key}
                    cx="70"
                    cy="70"
                    r={radius}
                    fill="transparent"
                    stroke={segment.color}
                    strokeWidth="18"
                    strokeLinecap={segment.value > 0 ? "round" : "butt"}
                    strokeDasharray={segment.dashArray}
                    strokeDashoffset={segment.dashOffset}
                  />
                ))}
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  Ativas
                </span>
                <span className="mt-2 text-4xl font-semibold text-white">
                  {activeTasks}
                </span>
                <span className="mt-1 text-xs text-slate-400">
                  {doneTasks} concluidas
                </span>
              </div>
            </div>

            <p className="text-center text-sm leading-6 text-slate-400">
              O grafico mostra a proporcao entre tarefas em andamento e as que
              ja passaram do prazo.
            </p>
          </div>

          <div className="space-y-4">
            {chartSegments.map((segment) => (
              <div
                key={segment.key}
                className="rounded-3xl border border-slate-800 bg-slate-900/70 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: segment.color }}
                    />
                    <span className="text-sm font-medium text-slate-100">
                      {segment.label}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${segment.badgeClass}`}
                    >
                      {segment.value} tarefas
                    </span>
                  </div>
                  <span className="text-lg font-semibold text-white">
                    {segment.percentage}%
                  </span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${segment.percentage}%`,
                      backgroundColor: segment.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}