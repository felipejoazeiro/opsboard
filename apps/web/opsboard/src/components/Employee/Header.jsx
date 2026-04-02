export function Header({ setIsNewEmployeeOpen, setIsNewRoleOpen }) {
  return (
    <div className="mb-8 flex flex-wrap items-start justify-between gap-3">
      <h1 className="text-2xl font-bold">Employees</h1>
      <button onClick={()=>setIsNewRoleOpen(true) } className="rounded-lg bg-slate-700 px-5 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-600">
        Adicionar cargo
      </button>
      <button
        onClick={() => setIsNewEmployeeOpen(true)}
        className="rounded-lg bg-slate-700 px-5 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-600"
      >
        Adicionar funcionário
      </button>
    </div>
  );
}
