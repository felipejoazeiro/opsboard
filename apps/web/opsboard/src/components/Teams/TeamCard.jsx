export function TeamCard({ team, onRemove, onClick, onEdit }) {
  const isClickable = typeof onClick === "function";

  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-md bg-slate-800 p-4 transition ${
        isClickable ? "cursor-pointer hover:bg-slate-700" : ""
      }`}
      onClick={onClick}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={
        isClickable
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-slate-100">{team.name}</p>
        <p className="text-xs text-slate-500">{team.description}</p>
        <p className="text-xs text-slate-500 mt-1">{team.total_employees} {team.total_employees === 1 ? 'membro' : 'membros'}</p>
      </div>
      <div className="ml-2 flex shrink-0 items-center gap-2">
        <button
          type="button"
          className="text-blue-500 hover:text-blue-400 transition"
          onClick={(event) => {
            event.stopPropagation();
            onEdit?.(team);
          }}
          aria-label={`Editar equipe ${team.name}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onRemove?.(team.id);
          }}
          className="text-red-500 hover:text-red-400 transition"
          aria-label={`Remover equipe ${team.name}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
