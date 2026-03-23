export function Header({ setIsNewTeamOpen }) {
  return (
    <div className="mb-8 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Equipes</h1>
        <p className="mt-1 text-sm text-slate-500">
          Gerencie as equipes e seus membros.
        </p>
      </div>
      <button
        type="button"
        onClick={() => setIsNewTeamOpen(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Adicionar Equipe
      </button>
    </div>
  );
}
