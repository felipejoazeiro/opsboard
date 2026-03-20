import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Layers3,
  MonitorCog,
  Menu,
  X,
  LogOut,
} from 'lucide-react'

const items = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    to: '/employees',
    label: 'Funcionários',
    icon: Users,
  },
  {
    to: '/teams',
    label: 'Equipes',
    icon: Layers3,
  },
  {
    to: '/equipments',
    label: 'Equipamentos',
    icon: MonitorCog,
  },
]

function Sidebar({ children }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3 md:hidden">
        <div>
          <h1 className="text-lg font-bold text-cyan-400">OpsBoard</h1>
          <p className="text-xs text-slate-400">Team Operations</p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="rounded-lg border border-slate-700 p-2 text-slate-200 transition hover:bg-slate-800"
        >
          <Menu size={20} />
        </button>
      </div>

      <div className="hidden md:flex">
        <aside className="sticky top-0 flex h-screen w-72 flex-col border-r border-slate-800 bg-slate-950 px-4 py-5">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-cyan-400">OpsBoard</h1>
            <p className="mt-1 text-sm text-slate-400">
              Gerencie sua operação
            </p>
          </div>

          <div className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Menu
          </div>

          <nav className="flex-1 space-y-2">
            {items.map((item) => {
              const Icon = item.icon

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    [
                      'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-cyan-500 text-slate-950 shadow-md'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white',
                    ].join(' ')
                  }
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              )
            })}
          </nav>

          <button className="mt-4 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-red-500/10 hover:text-red-400">
            <LogOut size={18} />
            Sair
          </button>
        </aside>

        <main className="flex-1 bg-slate-900 p-6">{children}</main>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />

          <aside className="absolute left-0 top-0 flex h-full w-72 flex-col bg-slate-950 px-4 py-5 shadow-xl">
            <div className="mb-8 flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-cyan-400">OpsBoard</h1>
                <p className="mt-1 text-sm text-slate-400">
                  Gerencie sua operação
                </p>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 text-slate-300 transition hover:bg-slate-800"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Menu
            </div>

            <nav className="flex-1 space-y-2">
              {items.map((item) => {
                const Icon = item.icon

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      [
                        'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200',
                        isActive
                          ? 'bg-cyan-500 text-slate-950 shadow-md'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white',
                      ].join(' ')
                    }
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </NavLink>
                )
              })}
            </nav>

            <button className="mt-4 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-red-500/10 hover:text-red-400">
              <LogOut size={18} />
              Sair
            </button>
          </aside>
        </div>
      )}
    </div>
  )
}

export { Sidebar, Sidebar as SideBar }