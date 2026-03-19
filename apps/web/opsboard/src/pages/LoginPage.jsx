import { useState } from 'react'

export function LoginPage() {
  const title = 'Bem-vindo de volta!'
  const description = 'Faca login para acessar o painel de controle e gerenciar suas operacoes de forma eficiente.'

  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')
    setIsLoading(true)

    try {
      const response = await fetch('http://localhost:3333/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ login, password })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Falha ao realizar login.')
      }

      setSuccessMessage(`Login realizado com sucesso. Bem-vindo, ${result.name}!`)
      console.log('Usuario autenticado:', result)
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-10">
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-cyan-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />

      <section className="relative w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-black/40 backdrop-blur">
        <h1 className="text-2xl font-semibold text-slate-100">{title}</h1>
        <p className="mt-2 text-sm text-slate-400">{description}</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="login" className="mb-1 block text-sm text-slate-300">
              Login
            </label>
            <input
              id="login"
              type="text"
              value={login}
              onChange={(event) => setLogin(event.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              placeholder="voce@empresa.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm text-slate-300">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              placeholder="********"
              required
            />
          </div>

          {errorMessage ? <p className="text-sm text-red-400">{errorMessage}</p> : null}
          {successMessage ? <p className="text-sm text-emerald-400">{successMessage}</p> : null}

          <button
            type="submit"
            className="w-full rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isLoading}
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>

          <p className="pt-1 text-center text-xs text-slate-500">
            Ambiente seguro. Seu acesso e dados estao protegidos.
          </p>
        </form>
      </section>
    </main>
  )
}
