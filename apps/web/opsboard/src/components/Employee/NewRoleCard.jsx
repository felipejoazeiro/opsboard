import { useState } from "react";

export function NewRoleCard({ onCreate, onClose }) {
    const [name, setName] = useState("");
    const [level, setLevel] = useState("staff");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function handleSubmit(event) {
        event.preventDefault();
        setError(null);

        if (!name.trim()) {
            setError("Nome do cargo é obrigatório.");
            return;
        }

        setLoading(true);
        try {
            await onCreate({ name: name.trim(), level });
            onClose();
        } catch (createError) {
            setError(createError.message || "Falha ao criar cargo.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-2xl">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-100">Novo cargo</h2>
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

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm text-slate-300">Nome do cargo</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2.5 px-4 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                            placeholder="Ex: Analista de Suporte"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm text-slate-300">Nível de acesso</label>
                        <select
                            value={level}
                            onChange={(event) => setLevel(event.target.value)}
                            className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2.5 px-4 text-sm text-slate-100 outline-none transition focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                        >
                            <option value="manager">Manager</option>
                            <option value="staff">Staff</option>
                            <option value="intern">Intern</option>
                        </select>
                    </div>

                    {error && <p className="text-sm text-red-500">{error}</p>}

                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-50"
                        >
                            {loading ? "Criando..." : "Criar cargo"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}