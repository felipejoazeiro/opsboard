export function NewRoleCard({ onClose }) {
    return (
        <div className="w-full bg-slate-800 p-4 rounded shadow border border-slate-800">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-slate-100">Novo cargo</h3>
                <button
                    type="button"
                    onClick={onClose}
                    className="text-slate-400 transition hover:text-slate-200"
                    aria-label="Fechar"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <p className="text-sm text-slate-300">Funcionalidade em desenvolvimento...</p>
        </div>
    );
}