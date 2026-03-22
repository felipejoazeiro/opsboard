import { useChangePassword } from '../../hooks/useChangePassword.js'

export function ChangePasswordCard({ pendingCredentials, onSuccess }) {
  const {
    newPassword, setNewPassword,
    confirmPassword, setConfirmPassword,
    isLoading,
    errorMessage,
    handleSubmit
  } = useChangePassword({ pendingCredentials, onSuccess })

  return (
    <section className="relative w-full max-w-sm rounded-2xl border border-amber-700/50 bg-slate-900/80 p-8 shadow-2xl shadow-black/40 backdrop-blur">
      <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-400 ring-1 ring-amber-500/30">
        Primeiro acesso
      </div>

      <h1 className="text-2xl font-semibold text-slate-100">Crie sua senha</h1>
      <p className="mt-2 text-sm text-slate-400">
        Você está usando a senha padrão. Defina uma nova senha pessoal para continuar.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="newPassword" className="mb-1 block text-sm text-slate-300">
            Nova senha
          </label>
          <input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
            placeholder="Mínimo 8 caracteres"
            required
            minLength={8}
            autoFocus
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="mb-1 block text-sm text-slate-300">
            Confirmar nova senha
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
            placeholder="Repita a nova senha"
            required
          />
        </div>

        {errorMessage ? <p className="text-sm text-red-400">{errorMessage}</p> : null}

        <button
          type="submit"
          className="w-full rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={isLoading}
        >
          {isLoading ? 'Salvando...' : 'Salvar nova senha'}
        </button>

        <p className="pt-1 text-center text-xs text-slate-500">
          Após alterar a senha, faça login novamente.
        </p>
      </form>
    </section>
  )
}
