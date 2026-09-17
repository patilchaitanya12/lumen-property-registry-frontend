import {
  ArrowRight,
  Building2,
  Command,
  Package,
  Search,
  UserRound,
  X,
} from 'lucide-react'
import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useNavigate } from 'react-router-dom'

import { apiFetch } from '../../lib/api'

interface SearchResult {
  id: string
  name?: string
  unit_code?: string
  type: 'owner' | 'unit' | 'order'
}

interface SearchResponse {
  owners: SearchResult[]
  units: SearchResult[]
  orders: SearchResult[]
}

interface GlobalSearchProps {
  open: boolean
  onClose: () => void
}

export function GlobalSearch({
  open,
  onClose,
}: GlobalSearchProps) {
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)

  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResponse>({
    owners: [],
    units: [],
    orders: [],
  })

  const [loading, setLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const allResults = [
    ...results.owners,
    ...results.units,
    ...results.orders,
  ]

  useEffect(() => {
    if (!open) return

    setQuery('')
    setResults({
      owners: [],
      units: [],
      orders: [],
    })
    setSelectedIndex(0)

    const timer = window.setTimeout(() => {
      inputRef.current?.focus()
    }, 20)

    return () => window.clearTimeout(timer)
  }, [open])

  useEffect(() => {
    if (!open) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault()

        setSelectedIndex((current) =>
          Math.min(
            current + 1,
            Math.max(0, allResults.length - 1),
          ),
        )
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault()

        setSelectedIndex((current) =>
          Math.max(0, current - 1),
        )
      }

      if (
        event.key === 'Enter' &&
        allResults[selectedIndex]
      ) {
        event.preventDefault()
        openResult(allResults[selectedIndex])
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose, allResults, selectedIndex])

  useEffect(() => {
    if (!open) return

    const trimmed = query.trim()

    if (!trimmed) {
      setResults({
        owners: [],
        units: [],
        orders: [],
      })
      setLoading(false)
      return
    }

    const controller = new AbortController()

    const timer = window.setTimeout(() => {
      setLoading(true)

      apiFetch<SearchResponse>(
        `/api/search?q=${encodeURIComponent(trimmed)}`,
      )
        .then((data) => {
          setResults(data)
          setSelectedIndex(0)
        })
        .catch(() => {
          setResults({
            owners: [],
            units: [],
            orders: [],
          })
        })
        .finally(() => {
          setLoading(false)
        })
    }, 250)

    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [query, open])

  const openResult = (result: SearchResult) => {
    onClose()

    if (result.type === 'owner') {
      navigate(
        `/owners/${encodeURIComponent(result.id)}`,
      )
      return
    }

    if (result.type === 'unit') {
      navigate(
        `/properties/${encodeURIComponent(result.id)}`,
      )
      return
    }

    navigate(
      `/orders/${encodeURIComponent(result.id)}`,
    )
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 px-2.5 pt-[7vh] backdrop-blur-sm sm:px-4 sm:pt-[12vh]"
      onMouseDown={onClose}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl sm:rounded-3xl"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        {/* Input */}
        <div className="flex min-h-15 items-center gap-2.5 border-b border-[var(--border)] px-3.5 sm:h-16 sm:gap-3 sm:px-5">
          <Search
            size={19}
            className="shrink-0 text-[var(--muted)]"
          />

          <input
            ref={inputRef}
            value={query}
            onChange={(event) =>
              setQuery(event.target.value)
            }
            placeholder="Search owners, properties or orders..."
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--muted)]"
          />

          {loading && (
            <div className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--primary)]" />
          )}

          {query && !loading && (
            <button
              onClick={() => setQuery('')}
              className="shrink-0 rounded-lg p-1.5 text-[var(--muted)] hover:bg-[var(--background)]"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}

          <kbd className="hidden shrink-0 items-center gap-1 rounded-lg border border-[var(--border)] px-2 py-1 text-[10px] text-[var(--muted)] sm:flex">
            <Command size={9} />
            K
          </kbd>

          <button
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[var(--muted)] hover:bg-[var(--background)] sm:hidden"
            aria-label="Close search"
          >
            <X size={16} />
          </button>
        </div>

        {/* Initial state */}
        {!query.trim() && (
          <div className="px-4 py-8 text-center sm:px-5 sm:py-10">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)] sm:h-11 sm:w-11">
              <Search size={18} />
            </div>

            <div className="mt-4 text-sm font-medium">
              Search the registry
            </div>

            <div className="mt-1 text-xs text-[var(--muted)]">
              Find an owner, property or order.
            </div>

            <div className="mt-5 flex flex-wrap justify-center gap-2 px-2">
              <Hint label="Owner ID" />
              <Hint label="Property ID" />
              <Hint label="Name" />
            </div>
          </div>
        )}

        {/* No results */}
        {query.trim() &&
          !loading &&
          allResults.length === 0 && (
            <div className="px-4 py-10 text-center sm:px-5 sm:py-12">
              <div className="text-sm font-medium">
                No results found
              </div>

              <div className="mt-1 text-xs text-[var(--muted)]">
                Try another name or identifier.
              </div>
            </div>
          )}

        {/* Results */}
        {query.trim() &&
          allResults.length > 0 && (
            <div className="max-h-[60vh] overflow-y-auto sm:max-h-[65vh]">
              {results.owners.length > 0 && (
                <ResultGroup
                  title="Owners"
                  icon={<UserRound size={13} />}
                >
                  {results.owners.map(
                    (result, index) => (
                      <ResultRow
                        key={result.id}
                        result={result}
                        selected={
                          index === selectedIndex
                        }
                        onClick={() =>
                          openResult(result)
                        }
                      />
                    ),
                  )}
                </ResultGroup>
              )}

              {results.units.length > 0 && (
                <ResultGroup
                  title="Properties"
                  icon={<Building2 size={13} />}
                >
                  {results.units.map(
                    (result, index) => (
                      <ResultRow
                        key={result.id}
                        result={result}
                        selected={
                          results.owners.length +
                            index ===
                          selectedIndex
                        }
                        onClick={() =>
                          openResult(result)
                        }
                      />
                    ),
                  )}
                </ResultGroup>
              )}

              {results.orders.length > 0 && (
                <ResultGroup
                  title="Orders"
                  icon={<Package size={13} />}
                >
                  {results.orders.map(
                    (result, index) => (
                      <ResultRow
                        key={result.id}
                        result={result}
                        selected={
                          results.owners.length +
                            results.units.length +
                            index ===
                          selectedIndex
                        }
                        onClick={() =>
                          openResult(result)
                        }
                      />
                    ),
                  )}
                </ResultGroup>
              )}
            </div>
          )}

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border)] px-3.5 py-2.5 text-[9px] text-[var(--muted)] sm:px-5 sm:py-3 sm:text-[10px]">
          <div className="flex gap-3 sm:gap-4">
            <span>↑↓ Navigate</span>
            <span>↵ Open</span>
          </div>

          <button
            onClick={onClose}
            className="hidden hover:text-[var(--foreground)] sm:block"
          >
            Esc to close
          </button>

          <button
            onClick={onClose}
            className="sm:hidden"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

function Hint({
  label,
}: {
  label: string
}) {
  return (
    <span className="rounded-full border border-[var(--border)] px-2.5 py-1 text-[10px] text-[var(--muted)]">
      {label}
    </span>
  )
}

function ResultGroup({
  title,
  icon,
  children,
}: {
  title: string
  icon: ReactNode
  children: ReactNode
}) {
  return (
    <section>
      <div className="flex items-center gap-2 border-b border-[var(--border)] px-3.5 py-3 text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)] sm:px-5">
        {icon}
        {title}
      </div>

      {children}
    </section>
  )
}

function ResultRow({
  result,
  selected,
  onClick,
}: {
  result: SearchResult
  selected: boolean
  onClick: () => void
}) {
  const owner = result.type === 'owner'

  return (
    <button
      onClick={onClick}
      className={`group flex w-full min-w-0 items-center gap-2.5 px-3.5 py-3 text-left transition sm:gap-3 sm:px-5 sm:py-3.5 ${
        selected
          ? 'bg-[var(--primary-soft)]'
          : 'hover:bg-[var(--background)]'
      }`}
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)] sm:h-9 sm:w-9">
        {owner ? (
          <UserRound size={15} />
        ) : (
          <Building2 size={15} />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="break-words text-xs font-medium sm:text-sm">
          {result.name ||
            result.unit_code ||
            result.id}
        </div>

        <div className="mt-1 break-all font-mono text-[9px] leading-4 text-[var(--muted)] sm:text-[10px]">
          {result.id}
        </div>
      </div>

      <ArrowRight
        size={14}
        className="shrink-0 text-[var(--muted)] transition-transform group-hover:translate-x-1 sm:h-[15px] sm:w-[15px]"
      />
    </button>
  )
}
