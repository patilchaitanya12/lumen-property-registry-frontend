import {
  Command,
  Moon,
  Search,
  Sun,
} from 'lucide-react'

interface TopbarProps {
  dark: boolean
  onToggleTheme: () => void
}

export function Topbar({
  dark,
  onToggleTheme,
}: TopbarProps) {
  return (
    <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-[var(--border)] bg-[var(--background)]/90 px-5 backdrop-blur-xl sm:px-8">
      <div>
        <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--muted)]">
          Registry
        </div>

        <h1 className="mt-1 text-xl font-semibold tracking-tight">
          Overview
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <button className="hidden h-10 items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--muted)] shadow-sm transition hover:border-[var(--primary)]/30 sm:flex">
          <Search size={16} />

          <span>Search registry...</span>

          <kbd className="ml-6 flex items-center gap-0.5 rounded-md border border-[var(--border)] px-1.5 py-0.5 text-[10px]">
            <Command size={9} />
            K
          </kbd>
        </button>

        <button
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