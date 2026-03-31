import { useState } from 'react';

export function UpdateTeamCard({ team, onUpdate, onClose }) {
    const [name, setName] = useState(team.name);
    const [description, setDescription] = useState(team.description);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function handleSubmit(event) {
        event.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await onUpdate(team.id, { name, description });
        }
        catch (err) {
            setError(err.message || 'Failed to update team.');
        }
        finally {
            setLoading(false);
        }
    }

    return(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-2xl">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-100">Editar equipe</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-slate-400 transition hover:text-slate-200"
                        aria-label="Fechar edição"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm text-slate-300">Nome</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2.5 px-4 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500" />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm text-slate-300">Descrição</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2.5 px-4 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500" />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm text-slate-300">Membros</label>
                        <p className="text-sm text-slate-500">{team.total_employees} {team.total_employees === 1 ? 'membro' : 'membros'}</p>
                    </div>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <div className="flex gap-2">
                        <button type="button" onClick={onClose} className="w-full rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-800">
                            Cancelar
                        </button>
                        <button type="submit" disabled={loading} className="w-full rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-50">
                            {loading ? 'Salvando...' : 'Salvar alterações'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}