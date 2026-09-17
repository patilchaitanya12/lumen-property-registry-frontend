import {
  ChevronLeft,
  ChevronRight,
  Command,
  Menu,
  Moon,
  Search,
  Sun,
} from 'lucide-react'
import { useEffect } from 'react'

interface TopbarProps {
  dark: boolean
  sidebarCollapsed: boolean
  onToggleTheme: () => void
  onOpenSearch: () => void
  onToggleSidebar: () => void
  onOpenMobileSidebar: () => void
}

export function Topbar({
  dark,
  sidebarCollapsed,
  onToggleTheme,
  onOpenSearch,
  onToggleSidebar,
  onOpenMobileSidebar,
}: TopbarProps) {
  useEffect(() => {
    const handleShortcut = (
      event: KeyboardEvent,
    ) => {
      if (
        (event.metaKey || event.ctrlKey) &&
        event.key.toLowerCase() === 'k'
      ) {
        event.preventDefault()
        onOpenSearch()
      }
    }

    window.addEventListener(
      'keydown',
      handleShortcut,
    )

    return () => {
      window.removeEventListener(
        'keydown',
        handleShortcut,
      )
    }
  }, [onOpenSearch])

  return (
    <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-[var(--border)] bg-[var(--background)]/90 px-4 backdrop-blur-xl sm:px-8">
      <div className="flex min-w-0 items-center gap-3">
        {/* Mobile menu */}
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] transition hover:text-[var(--foreground)] lg:hidden"
          aria-label="Open navigation"
        >
          <Menu size={18} />
        </button>

        {/* Desktop sidebar toggle */}
        <button
          type="button"
          onClick={onToggleSidebar}
          className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] transition hover:text-[var(--foreground)] lg:flex"
          aria-label={
            sidebarCollapsed
              ? 'Expand sidebar'
              : 'Collapse sidebar'
          }
          title={
            sidebarCollapsed
              ? 'Expand sidebar'
              : 'Collapse sidebar'
          }
        >
          {sidebarCollapsed ? (
            <ChevronRight size={18} />
          ) : (
            <ChevronLeft size={18} />
          )}
        </button>

        <div className="min-w-0">
          <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--muted)]">
            Registry
          </div>

          <h1 className="mt-1 truncate text-lg font-semibold tracking-tight sm:text-xl">
            Overview
          </h1>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {/* Desktop search */}
        <button
          type="button"
          onClick={onOpenSearch}
          className="hidden h-10 items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--muted)] shadow-sm transition hover:border-[var(--primary)]/30 hover:text-[var(--foreground)] sm:flex"
        >
          <Search size={16} />

          <span>Search registry...</span>

          <kbd className="ml-6 flex items-center gap-0.5 rounded-md border border-[var(--border)] px-1.5 py-0.5 text-[10px]">
            <Command size={9} />
            K
          </kbd>
        </button>

        {/* Mobile search */}
        <button
          type="button"
          onClick={onOpenSearch}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] transition hover:text-[var(--foreground)] sm:hidden"
          aria-label="Search registry"
        >
          <Search size={17} />
        </button>

        {/* Theme */}
        <button
          type="button"
          onClick={onToggleTheme}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] transition hover:text-[var(--foreground)]"
          aria-label="Toggle theme"
        >
          {dark ? (
            <Sun size={17} />
          ) : (
            <Moon size={17} />
          )}
        </button>
      </div>
    </header>
  )
}
