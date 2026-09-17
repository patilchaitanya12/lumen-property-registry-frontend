import {
  ArrowRight,
  Building2,
  Search as SearchIcon,
  UserRound,
  X,
  Package,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { apiFetch } from '../lib/api'

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

export function Search() {
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

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        navigate(-1)
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault()
        setSelectedIndex((value) =>
          Math.min(value + 1, Math.max(0, allResults.length - 1)),
        )
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault()
        setSelectedIndex((value) => Math.max(0, value - 1))
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [navigate])

  useEffect(() => {
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

    return () => window.clearTimeout(timer)
  }, [query])

  const allResults = [
    ...results.owners,
    ...results.units,
    ...results.orders,
  ]

  const openResult = (result: SearchResult) => {
    if (result.type === 'owner') {
      navigate(`/owners/${encodeURIComponent(result.id)}`)
      return
    }

    if (result.type === 'unit') {
      navigate(`/properties/${encodeURIComponent(result.id)}`)
      return
    }

    if (result.type === 'order') {
      navigate(`/orders/${encodeURIComponent(result.id)}`)
    }
  }

  const handleEnter = () => {
    const result = allResults[selectedIndex]

    if (result) {
      openResult(result)
    }
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      {/* Search header */}
      <div className="sticky top-0 z-10 bg-[var(--background)] pb-4 sm:pb-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--muted)] sm:text-[11px]">
              System
            </div>

            <h1 className="mt-1.5 text-2xl font-semibold tracking-tight sm:mt-2 sm:text-3xl">
              Search
            </h1>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] transition hover:text-[var(--foreground)]"
            aria-label="Close search"
          >
            <X size={16} />
          </button>
        </div>

        <div className="relative">
          <SearchIcon
            size={18}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)] sm:left-4"
          />

          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                handleEnter()
              }
            }}
            placeholder="Search owners, properties or orders..."
            className="h-13 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] pl-11 pr-14 text-sm outline-none shadow-sm transition placeholder:text-[var(--muted)] focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 sm:h-14 sm:pl-12 sm:pr-24 sm:text-base"
          />

          <div className="absolute right-2.5 top-1/2 flex -translate-y-1/2 items-center gap-2 sm:right-3">
            {loading && (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--primary)]" />
            )}

            <kbd className="hidden rounded-lg border border-[var(--border)] px-2 py-1 text-[10px] text-[var(--muted)] sm:block">
              ESC
            </kbd>
          </div>
        </div>
      </div>

      {/* Empty state */}
      {!query.trim() && (
        <div className="rounded-2xl border border-dashed border-[var(--border)] p-8 text-center sm:rounded-3xl sm:p-16">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)] sm:h-12 sm:w-12">
            <SearchIcon size={20} />
          </div>

          <h2 className="mt-4 text-sm font-semibold sm:mt-5">
            Search the registry
          </h2>

          <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-[var(--muted)] sm:text-sm sm:leading-6">
            Find owners, properties and transaction records using IDs,
            names or unit codes.
          </p>

          <div className="mt-5 flex flex-wrap justify-center gap-2 px-2">
            <span className="rounded-full border border-[var(--border)] px-3 py-1.5 text-[11px] text-[var(--muted)]">
              Owner ID
            </span>

            <span className="rounded-full border border-[var(--border)] px-3 py-1.5 text-[11px] text-[var(--muted)]">
              Name
            </span>

            <span className="rounded-full border border-[var(--border)] px-3 py-1.5 text-[11px] text-[var(--muted)]">
              Property ID
            </span>
          </div>
        </div>
      )}

      {/* Results */}
      {query.trim() && !loading && (
        <div className="max-h-[calc(100vh-220px)] overflow-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)] sm:rounded-3xl">
          {allResults.length === 0 ? (
            <div className="p-10 text-center sm:p-14">
              <SearchIcon
                size={24}
                className="mx-auto text-[var(--muted)]"
              />

              <div className="mt-4 text-sm font-medium">
                No results found
              </div>

              <p className="mt-1 text-xs text-[var(--muted)] sm:text-sm">
                Try another name, owner ID or property ID.
              </p>
            </div>
          ) : (
            <>
              {/* Owners */}
              {results.owners.length > 0 && (
                <ResultSection
                  title="Owners"
                  icon={<UserRound size={14} />}
                >
                  {results.owners.map((result, index) => (
                    <ResultRow
                      key={result.id}
                      result={result}
                      selected={index === selectedIndex}
                      onClick={() => openResult(result)}
                    />
                  ))}
                </ResultSection>
              )}

              {/* Properties */}
              {results.units.length > 0 && (
                <ResultSection
                  title="Properties"
                  icon={<Building2 size={14} />}
                >
                  {results.units.map((result, index) => (
                    <ResultRow
                      key={result.id}
                      result={result}
                      selected={
                        index + results.owners.length === selectedIndex
                      }
                      onClick={() => openResult(result)}
                    />
                  ))}
                </ResultSection>
              )}

              {/* Orders */}
              {results.orders.length > 0 && (
                <ResultSection
                  title="Orders"
                  icon={<Package size={14} />}
                >
                  {results.orders.map((result, index) => (
                    <ResultRow
                      key={result.id}
                      result={result}
                      selected={
                        index +
                          results.owners.length +
                          results.units.length ===
                        selectedIndex
                      }
                      onClick={() => openResult(result)}
                    />
                  ))}
                </ResultSection>
              )}
            </>
          )}
        </div>
      )}

      {/* Keyboard shortcuts */}
      <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1 text-[10px] text-[var(--muted)] sm:gap-5">
        <span>↑↓ Navigate</span>
        <span>↵ Open</span>
        <span>Esc Close</span>
      </div>
    </div>
  )
}

function ResultSection({
  title,
  icon,
  children,
}: {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
  offset?: number
}) {
  return (
    <section>
      <div className="flex items-center gap-2 border-b border-[var(--border)] px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)] sm:px-5">
        {icon}
        {title}
      </div>

      <div>{children}</div>
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
  const isOwner = result.type === 'owner'

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
        {isOwner ? (
          <UserRound size={15} />
        ) : (
          <Building2 size={15} />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="break-words text-xs font-medium sm:text-sm">
          {result.name || result.unit_code || result.id}
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
