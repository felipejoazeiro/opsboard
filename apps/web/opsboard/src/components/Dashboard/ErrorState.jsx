export function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-20 w-20 text-rose-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
        />
      </svg>
      <p className="text-lg font-semibold text-rose-400">
        Erro ao carregar tarefas
      </p>
      <p className="text-sm text-slate-500">{message}</p>
      <button
        onClick={onRetry}
        className="mt-2 rounded-lg bg-slate-700 px-5 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-600"
      >
        Tentar novamente
      </button>
    </div>
  );
}