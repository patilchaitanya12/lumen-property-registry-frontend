import {
  Building2,
  ChevronRight,
  Database,
  History,
  LayoutDashboard,
  MapPin,
  Package,
  Search,
  Settings,
  Users,
} from 'lucide-react'

const navigation = [
  {
    label: 'Overview',
    icon: LayoutDashboard,
  },
  {
    label: 'Properties',
    icon: Building2,
  },
  {
    label: 'Owners',
    icon: Users,
  },
  {
    label: 'Locations',
    icon: MapPin,
  },
  {
    label: 'Orders',
    icon: Package,
  },
  {
    label: 'History',
    icon: History,
  },
]

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-[var(--border)] bg-[var(--surface)] lg:flex lg:flex-col">
      <div className="flex h-20 items-center px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--primary)] text-white">
            <Database size={18} />
          </div>

          <div>
            <div className="text-sm font-semibold tracking-tight">
              Lumen
            </div>

            <div className="text-[11px] text-[var(--muted)]">
              Property Registry
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4">
        <div className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
          Registry
        </div>

        <div className="space-y-1">
          {navigation.map(
            ({
              label,
              icon: Icon,
            }) => {
              const active =
                label === 'Overview'

              return (
                <button
                  key={label}
                  className={[
                    'group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all',
                    active
                      ? 'bg-[var(--primary-soft)] font-medium text-[var(--primary)]'
                      : 'text-[var(--muted)] hover:bg-black/[0.03] hover:text-[var(--foreground)] dark:hover:bg-white/[0.04]',
                  ].join(' ')}
                >
                  <Icon size={17} />

                  <span>{label}</span>

                  {active && (
                    <ChevronRight
                      size={14}
                      className="ml-auto opacity-60"
                    />
                  )}
                </button>
              )
            },
          )}
        </div>

        <div className="mb-3 mt-10 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
          System
        </div>

        <button className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[var(--muted)] transition-all hover:bg-black/[0.03] hover:text-[var(--foreground)] dark:hover:bg-white/[0.04]">
          <Search size={17} />
          Search
          <kbd className="ml-auto rounded-md border border-[var(--border)] px-1.5 py-0.5 text-[9px]">
            ⌘K
          </kbd>
        </button>

        <button className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[var(--muted)] transition-all hover:bg-black/[0.03] hover:text-[var(--foreground)] dark:hover:bg-white/[0.04]">
          <Settings size={17} />
          Settings
        </button>
      </nav>

      <div className="border-t border-[var(--border)] p-4">
        <div className="rounded-2xl bg-[var(--background)] p-3">
          <div className="text-xs font-medium">
            Registry status
          </div>

          <div className="mt-2 flex items-center gap-2 text-[11px] text-[var(--muted)]">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Database connected
          </div>
        </div>
      </div>
    </aside>
  )
}