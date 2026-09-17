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
  X,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

const navigation = [
  {
    label: 'Overview',
    path: '/',
    icon: LayoutDashboard,
  },
  {
    label: 'Properties',
    path: '/properties',
    icon: Building2,
  },
  {
    label: 'Owners',
    path: '/owners',
    icon: Users,
  },
  {
    label: 'Locations',
    path: '/locations',
    icon: MapPin,
  },
  {
    label: 'Orders',
    path: '/orders',
    icon: Package,
  },
  {
    label: 'History',
    path: '/history',
    icon: History,
  },
]

interface SidebarProps {
  collapsed: boolean
  mobileOpen: boolean
  onCloseMobile: () => void
}

export function Sidebar({
  collapsed,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={[
          // Base
          'fixed inset-y-0 left-0 z-50 flex shrink-0 flex-col border-r border-[var(--border)] bg-[var(--surface)] shadow-2xl transition-all duration-200',

          // Mobile
          mobileOpen
            ? 'w-72 translate-x-0'
            : 'w-0 -translate-x-full overflow-hidden border-r-0',

          // Desktop
          'lg:static lg:z-auto lg:translate-x-0 lg:overflow-visible lg:shadow-none',

          collapsed
            ? 'lg:w-20'
            : 'lg:w-64',
        ].join(' ')}
      >
        {/* Header */}
        <div
          className={[
            'flex h-20 shrink-0 items-center border-b border-[var(--border)]',
            collapsed
              ? 'lg:justify-center lg:px-3'
              : 'justify-between px-6',
          ].join(' ')}
        >
          <NavLink
            to="/"
            onClick={onCloseMobile}
            className="flex items-center gap-3"
            title={
              collapsed
                ? 'Lumen Property Registry'
                : undefined
            }
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)] text-white">
              <Database size={18} />
            </div>

            <div
              className={
                collapsed
                  ? 'hidden'
                  : 'min-w-0'
              }
            >
              <div className="text-sm font-semibold tracking-tight">
                Lumen
              </div>

              <div className="text-[11px] text-[var(--muted)]">
                Property Registry
              </div>
            </div>
          </NavLink>

          {/* Mobile close */}
          <button
            type="button"
            onClick={onCloseMobile}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-[var(--muted)] transition hover:bg-[var(--background)] hover:text-[var(--foreground)] lg:hidden"
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {!collapsed && (
            <div className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)] lg:block">
              Registry
            </div>
          )}

          <div className="space-y-1">
            {navigation.map(
              ({
                label,
                path,
                icon: Icon,
              }) => (
                <NavLink
                  key={label}
                  to={path}
                  onClick={onCloseMobile}
                  title={
                    collapsed
                      ? label
                      : undefined
                  }
                  className={({ isActive }) =>
                    [
                      'group flex w-full items-center gap-3 rounded-xl py-2.5 text-sm transition-all',
                      collapsed
                        ? 'lg:justify-center lg:px-0'
                        : 'px-3',
                      isActive
                        ? 'bg-[var(--primary-soft)] font-medium text-[var(--primary)]'
                        : 'text-[var(--muted)] hover:bg-black/[0.03] hover:text-[var(--foreground)] dark:hover:bg-white/[0.04]',
                    ].join(' ')
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={17}
                        className="shrink-0"
                      />

                      <span
                        className={
                          collapsed
                            ? 'lg:hidden'
                            : ''
                        }
                      >
                        {label}
                      </span>

                      {isActive && (
                        <ChevronRight
                          size={14}
                          className="ml-auto opacity-60 lg:hidden"
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ),
            )}
          </div>

          {!collapsed && (
            <div className="mb-3 mt-10 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
              System
            </div>
          )}

          <NavLink
            to="/search"
            onClick={onCloseMobile}
            title={
              collapsed
                ? 'Search'
                : undefined
            }
            className={({ isActive }) =>
              [
                'flex w-full items-center gap-3 rounded-xl py-2.5 text-sm transition-all',
                collapsed
                  ? 'lg:justify-center lg:px-0'
                  : 'px-3',
                isActive
                  ? 'bg-[var(--primary-soft)] text-[var(--primary)]'
                  : 'text-[var(--muted)] hover:bg-black/[0.03] dark:hover:bg-white/[0.04]',
              ].join(' ')
            }
          >
            <Search
              size={17}
              className="shrink-0"
            />

            <span
              className={
                collapsed
                  ? 'lg:hidden'
                  : ''
              }
            >
              Search
            </span>

            <kbd className="ml-auto rounded-md border border-[var(--border)] px-1.5 py-0.5 text-[9px] lg:hidden">
              ⌘K
            </kbd>
          </NavLink>

          <button
            type="button"
            title={
              collapsed
                ? 'Settings'
                : undefined
            }
            className={[
              'mt-1 flex w-full items-center gap-3 rounded-xl py-2.5 text-sm text-[var(--muted)] transition-all hover:bg-black/[0.03] hover:text-[var(--foreground)] dark:hover:bg-white/[0.04]',
              collapsed
                ? 'lg:justify-center lg:px-0'
                : 'px-3',
            ].join(' ')}
          >
            <Settings
              size={17}
              className="shrink-0"
            />

            <span
              className={
                collapsed
                  ? 'lg:hidden'
                  : ''
              }
            >
              Settings
            </span>
          </button>
        </nav>

        {/* Status */}
        <div
          className={[
            'border-t border-[var(--border)] p-4',
            collapsed
              ? 'lg:p-3'
              : '',
          ].join(' ')}
        >
          {collapsed ? (
            <div
              className="flex justify-center"
              title="Database connected"
            >
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </div>
          ) : (
            <div className="rounded-2xl bg-[var(--background)] p-3">
              <div className="text-xs font-medium">
                Registry status
              </div>

              <div className="mt-2 flex items-center gap-2 text-[11px] text-[var(--muted)]">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Database connected
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
