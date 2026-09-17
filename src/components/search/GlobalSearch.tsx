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
  const inputRef =
    useRef<HTMLInputElement>(null)

  const [query, setQuery] = useState('')
  const [results, setResults] =
    useState<SearchResponse>({
      owners: [],
      units: [],
      orders: [],
    })

  const [loading, setLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] =
    useState(0)

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

    window.setTimeout(() => {
      inputRef.current?.focus()
    }, 20)
  }, [open])

  useEffect(() => {
    if (!open) return

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
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
        openResult(
          allResults[selectedIndex],
        )
      }
    }

    window.addEventListener(
      'keydown',
      handleKeyDown,
    )

    return () => {
      window.removeEventListener(
        'keydown',
        handleKeyDown,
      )
    }
  }, [
    open,
    onClose,
    allResults,
    selectedIndex,
  ])

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

    const controller =
      new AbortController()

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

  const openResult = (
    result: SearchResult,
  ) => {
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
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 px-4 pt-[12vh] backdrop-blur-sm"
      onMouseDown={onClose}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        {/* Input */}
        <div className="flex h-16 items-center gap-3 border-b border-[var(--border)] px-5">
          <Search
            size={20}
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
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--primary)]" />
          )}

          {query && !loading && (
            <button
              onClick={() => setQuery('')}
              className="rounded-lg p-1.5 text-[var(--muted)] hover:bg-[var(--background)]"
            >
              <X size={14} />
            </button>
          )}

          <kbd className="hidden items-center gap-1 rounded-lg border border-[var(--border)] px-2 py-1 text-[10px] text-[var(--muted)] sm:flex">
            <Command size={9} />
            K
          </kbd>
        </div>

        {/* Initial state */}
        {!query.trim() && (
          <div className="px-5 py-10 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)]">
              <Search size={19} />
            </div>

            <div className="mt-4 text-sm font-medium">
              Search the registry
            </div>

            <div className="mt-1 text-xs text-[var(--muted)]">
              Find an owner, property or order.
            </div>

            <div className="mt-5 flex justify-center gap-2">
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
            <div className="px-5 py-12 text-center">
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
            <div className="max-h-[60vh] overflow-y-auto">
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
        <div className="flex items-center justify-between border-t border-[var(--border)] px-5 py-3 text-[10px] text-[var(--muted)]">
          <div className="flex gap-4">
            <span>↑↓ Navigate</span>
            <span>↵ Open</span>
          </div>

          <button
            onClick={onClose}
            className="hover:text-[var(--foreground)]"
          >
            Esc to close
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
      <div className="flex items-center gap-2 border-b border-[var(--border)] px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
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
      className={`group flex w-full items-center gap-3 px-5 py-3.5 text-left transition ${
        selected
          ? 'bg-[var(--primary-soft)]'
          : 'hover:bg-[var(--background)]'
      }`}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]">
        {owner ? (
          <UserRound size={16} />
        ) : (
          <Building2 size={16} />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium">
          {result.name ||
            result.unit_code ||
            result.id}
        </div>

        <div className="mt-1 truncate font-mono text-[10px] text-[var(--muted)]">
          {result.id}
        </div>
      </div>

      <ArrowRight
        size={15}
        className="shrink-0 text-[var(--muted)] transition-transform group-hover:translate-x-1"
      />
    </button>
  )
}
