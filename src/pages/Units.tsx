import {
  ArrowRight,
  Building2,
  Search,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { apiFetch } from '../lib/api'

interface Unit {
  unit_id: string
  property_id: string
  unit_code: string | null
  unit_number: string | null
  location_id: string | null
  property_type: string | null
  size: number | null
}

interface UnitResponse {
  items: Unit[]
  page: number
  page_size: number
  total: number
}

export function Units() {
  const navigate = useNavigate()

  const [units, setUnits] = useState<Unit[]>([])
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [hoveredUnit, setHoveredUnit] =
    useState<string | null>(null)

  useEffect(() => {
    setLoading(true)

    const params = new URLSearchParams({
      page: String(page),
      page_size: '25',
    })

    if (query.trim()) {
      params.set('q', query.trim())
    }

    apiFetch<UnitResponse>(
      `/api/units?${params.toString()}`,
    )
      .then((data) => {
        setUnits(data.items)
        setTotal(data.total)
      })
      .finally(() => setLoading(false))
  }, [query, page])

  const totalPages = Math.ceil(total / 25)

  return (
    <div className="space-y-8">
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--muted)]">
            Registry
          </div>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Properties
          </h1>

          <p className="mt-2 text-sm text-[var(--muted)]">
            Physical units registered in the property
            registry.
          </p>
        </div>

        <div className="text-sm text-[var(--muted)]">
          {total.toLocaleString()} properties
        </div>
      </section>

      <div className="relative">
        <Search
          size={17}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]"
        />

        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setPage(1)
          }}
          placeholder="Search Property ID or Unit Code..."
          className="h-12 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] pl-11 pr-4 text-sm outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10"
        />
      </div>

      <div className="overflow-visible rounded-3xl border border-[var(--border)] bg-[var(--surface)]">
        <div className="hidden grid-cols-[minmax(240px,1.5fr)_140px_minmax(180px,1fr)_140px_50px] gap-4 border-b border-[var(--border)] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)] md:grid">
          <span>Property ID</span>
          <span>Unit</span>
          <span>Location</span>
          <span>Type</span>
          <span />
        </div>

        {loading ? (
          <div className="space-y-1 p-3">
            {Array.from({ length: 8 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="h-16 animate-pulse rounded-2xl bg-[var(--background)]"
                />
              ),
            )}
          </div>
        ) : units.length === 0 ? (
          <div className="p-12 text-center">
            <Building2
              size={24}
              className="mx-auto text-[var(--muted)]"
            />

            <div className="mt-4 text-sm font-medium">
              No properties found
            </div>

            <div className="mt-1 text-sm text-[var(--muted)]">
              Try another property ID or unit code.
            </div>
          </div>
        ) : (
          <div>
            {units.map((unit) => (
              <div
                key={unit.unit_id}
                className="group relative grid cursor-pointer grid-cols-1 gap-3 border-b border-[var(--border)] px-5 py-4 transition last:border-0 hover:bg-[var(--background)] md:grid-cols-[minmax(240px,1.5fr)_140px_minmax(180px,1fr)_140px_50px] md:items-center md:gap-4"
                onMouseEnter={() =>
                  setHoveredUnit(unit.unit_id)
                }
                onMouseLeave={() =>
                  setHoveredUnit(null)
                }
                onClick={() =>
                  navigate(
                    `/properties/${encodeURIComponent(unit.unit_id)}`,
                  )
                }
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]">
                    <Building2 size={16} />
                  </div>

                  <div className="min-w-0">
                    <div className="truncate font-mono text-sm font-medium">
                      {unit.property_id}
                    </div>

                    <div className="mt-1 text-xs text-[var(--muted)] md:hidden">
                      Unit {unit.unit_number || '—'}
                    </div>
                  </div>
                </div>

                <div className="hidden font-mono text-xs text-[var(--muted)] md:block">
                  {unit.unit_code || 'Not available'}
                </div>

                <div className="hidden truncate text-xs text-[var(--muted)] md:block">
                  {unit.location_id || 'Not available'}
                </div>

                <div className="hidden md:block">
                  <span className="rounded-full border border-[var(--border)] px-2.5 py-1 text-[11px]">
                    {unit.property_type ||
                      'Unknown'}
                  </span>
                </div>

                <ArrowRight
                  size={16}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-[var(--muted)] transition-transform group-hover:translate-x-1 md:static md:translate-y-0"
                />

                {hoveredUnit === unit.unit_id && (
                  <div
                    className="absolute left-8 top-[calc(100%-8px)] z-30 hidden w-80 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-4 shadow-2xl md:block"
                    onClick={(event) =>
                      event.stopPropagation()
                    }
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]">
                        <Building2 size={18} />
                      </div>

                      <div className="min-w-0">
                        <div className="font-mono text-sm font-semibold">
                          {unit.property_id}
                        </div>

                        <div className="mt-1 text-[11px] text-[var(--muted)]">
                          Unit {unit.unit_number ||
                            'Not available'}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <div className="rounded-xl bg-[var(--background)] p-3">
                        <div className="text-[10px] uppercase tracking-wider text-[var(--muted)]">
                          Unit code
                        </div>

                        <div className="mt-1 truncate text-xs font-medium">
                          {unit.unit_code ||
                            'Not available'}
                        </div>
                      </div>

                      <div className="rounded-xl bg-[var(--background)] p-3">
                        <div className="text-[10px] uppercase tracking-wider text-[var(--muted)]">
                          Type
                        </div>

                        <div className="mt-1 text-xs font-medium">
                          {unit.property_type ||
                            'Not available'}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-2 text-[11px] text-[var(--muted)]">
                      <span>Location:</span>
                      <span className="truncate font-mono">
                        {unit.location_id ||
                          'Not available'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation()
                        navigate(
                          `/properties/${encodeURIComponent(unit.unit_id)}`,
                        )
                      }}
                      className="mt-3 flex w-full items-center gap-2 rounded-xl px-2 py-2 text-xs font-medium text-[var(--primary)] transition hover:bg-[var(--primary-soft)]"
                    >
                      <Building2 size={14} />
                      <span>
                        Open property
                      </span>

                      <ArrowRight
                        size={13}
                        className="ml-auto"
                      />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-xs text-[var(--muted)]">
            Page {page} of {totalPages}
          </div>

          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() =>
                setPage((value) => value - 1)
              }
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <button
              disabled={page === totalPages}
              onClick={() =>
                setPage((value) => value + 1)
              }
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}