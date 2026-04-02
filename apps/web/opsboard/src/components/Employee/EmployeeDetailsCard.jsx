function DetailRow({ label, value }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-sm text-slate-100">{value || "-"}</p>
    </div>
  );
}

export function EmployeeDetailsCard({ employee, loading, error, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-xl rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-100">Detalhes do funcionário</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 transition hover:text-slate-200"
            aria-label="Fechar detalhes do funcionário"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {loading && <p className="text-sm text-slate-300">Carregando detalhes...</p>}
        {!loading && error && <p className="text-sm text-red-400">{error}</p>}

        {!loading && !error && employee && (
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailRow label="ID" value={employee.id} />
            <DetailRow label="Nome" value={employee.name} />
            <DetailRow label="Email" value={employee.email} />
            <DetailRow label="Cargo" value={employee.role} />
            <DetailRow label="Nível de acesso" value={employee.roleLevel} />
            <DetailRow label="Status" value={employee.isActive ? "Ativo" : "Inativo"} />
            <DetailRow label="Time" value={employee.teamName || "Sem time"} />
            <DetailRow
              label="Criado em"
              value={employee.createdAt ? new Date(employee.createdAt).toLocaleString("pt-BR") : "-"}
            />
          </div>
        )}
      </div>
    </div>
  );
}
