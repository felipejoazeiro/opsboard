import { useState } from 'react'
import { NavLink } from 'react-router-dom'

const items = [
    {
        to: '/dashboard',
        label: 'Dashboard',
        icon: 'dashboard'
    },
    {
        to: '/employees',
        label: 'Funcionários',
        icon: 'users'
    },
    {
        to: '/teams',
        label: 'Equipes',
        icon: 'teams'
    },
    {
        to: '/equipaments',
        label: 'Equipamentos',
        icon: 'equipments'
    }
]
export function Sidebar({ children }) {
    const [open, setOpen] = useState(false)

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100">
      <div className="flex md:hidden items-center justify-between border-b border-slate-800 px-4 py-3">
        <h1 className="text-lg font-semibold text-cyan-400">Opsboard</h1>
        <button
          onClick={() => setOpen(true)}
          className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200"
        >
          Menu
        </button>
      </div>

      <div className="hidden md:flex">
              <nav className="flex-1 space-y-1 px-3 py-4">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              [
                'block rounded-xl px-4 py-3 text-sm font-medium transition',
                isActive
                  ? 'bg-cyan-500 text-slate-950'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white',
              ].join(' ')
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}