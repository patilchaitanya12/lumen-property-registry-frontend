import {
  ArrowRight,
  Building2,
  MapPin,
  Search,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { apiFetch } from '../lib/api'

interface Location {
  location_id: string
  area_name: string | null
  community: string | null
  project: string | null
  project_land: string | null
  building_no: string | null
  building_name: string | null
  unit_count: number
}

interface LocationResponse {
  items: Location[]
  page: number
  page_size: number
  total: number
}

export function Locations() {
  const navigate = useNavigate()

  const [locations, setLocations] =
    useState<Location[]>([])
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [hovered, setHovered] =
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

    apiFetch<LocationResponse>(
      `/api/locations?${params.toString()}`,
    )
      .then((data) => {
        setLocations(data.items)
        setTotal(data.total)
      })
      .finally(() => setLoading(false))
  }, [query, page])

  const totalPages = Math.ceil(total / 25)

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <section className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end sm:gap-5">
        <div className="min-w-0">
          <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--muted)]">
            Registry
          </div>

          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Locations
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--muted)]">
            Communities and buildings associated
            with registered units.
          </p>
        </div>

        <div className="shrink-0 text-sm text-[var(--muted)]">
          {total.toLocaleString()} locations
        </div>
      </section>

      {/* Search */}
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
          placeholder="Search community, building or location ID..."
          className="h-12 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] pl-11 pr-4 text-sm outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10"
        />
      </div>

      {/* Registry */}
      <div className="overflow-visible rounded-2xl border border-[var(--border)] bg-[var(--surface)] sm:rounded-3xl">
        {/* Desktop header */}
        <div className="hidden grid-cols-[minmax(220px,1.4fr)_minmax(160px,1fr)_minmax(180px,1fr)_120px_50px] gap-4 border-b border-[var(--border)] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)] md:grid">
          <span>Building</span>
          <span>Community</span>
          <span>Location ID</span>
          <span>Units</span>
          <span />
        </div>

        {loading ? (
          <div className="space-y-2 p-3">
            {Array.from({ length: 8 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="h-24 animate-pulse rounded-2xl bg-[var(--background)] md:h-16"
                />
              ),
            )}
          </div>
        ) : locations.length === 0 ? (
          <div className="p-10 text-center sm:p-12">
            <MapPin
              size={25}
              className="mx-auto text-[var(--muted)]"
            />

            <div className="mt-4 text-sm font-medium">
              No locations found
            </div>

            <div className="mt-1 text-sm text-[var(--muted)]">
              Try another community or building.
            </div>
          </div>
        ) : (
          <div>
            {locations.map((location) => (
              <div
                key={location.location_id}
                onMouseEnter={() =>
                  setHovered(location.location_id)
                }
                onMouseLeave={() =>
                  setHovered(null)
                }
                className="group relative cursor-pointer border-b border-[var(--border)] px-4 py-4 transition last:border-0 hover:bg-[var(--background)] sm:px-5 md:grid md:grid-cols-[minmax(220px,1.4fr)_minmax(160px,1fr)_minmax(180px,1fr)_120px_50px] md:items-center md:gap-4"
                onClick={() =>
                  navigate(
                    `/locations/${encodeURIComponent(location.location_id)}`,
                  )
                }
              >
                {/* Building */}
                <div className="flex min-w-0 items-start gap-3 pr-8">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]">
                    <Building2 size={16} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="break-words text-sm font-medium leading-5">
                      {location.building_name ||
                        'Building unavailable'}
                    </div>

                    <div className="mt-1 text-xs text-[var(--muted)] md:hidden">
                      {location.community ||
                        'Community unavailable'}
                    </div>
                  </div>
                </div>

                {/* Community desktop */}
                <div className="hidden truncate text-sm text-[var(--muted)] md:block">
                  {location.community ||
                    'Not available'}
                </div>

                {/* Location ID desktop */}
                <div className="hidden truncate font-mono text-[10px] text-[var(--muted)] md:block">
                  {location.location_id}
                </div>

                {/* Units desktop */}
                <div className="hidden text-xs text-[var(--muted)] md:block">
                  <span className="font-medium text-[var(--foreground)]">
                    {location.unit_count.toLocaleString()}
                  </span>{' '}
                  units
                </div>

                {/* Mobile details */}
                <div className="mt-4 grid grid-cols-1 gap-2 pl-[52px] min-[400px]:grid-cols-2 md:hidden">
                  <div className="min-w-0 rounded-xl bg-[var(--background)] p-3">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                      Location ID
                    </div>

                    <div className="mt-1 break-all font-mono text-[10px] leading-4 text-[var(--muted)]">
                      {location.location_id}
                    </div>
                  </div>

                  <div className="rounded-xl bg-[var(--background)] p-3">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                      Units
                    </div>

                    <div className="mt-1 text-sm font-semibold">
                      {location.unit_count.toLocaleString()}
                    </div>
                  </div>

                  <div className="min-w-0 rounded-xl bg-[var(--background)] p-3 min-[400px]:col-span-2">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                      Area
                    </div>

                    <div className="mt-1 break-words text-xs text-[var(--muted)]">
                      {location.area_name ||
                        'Not available'}
                    </div>
                  </div>
                </div>

                {/* Arrow */}
                <ArrowRight
                  size={17}
                  className="absolute right-4 top-5 text-[var(--muted)] transition-transform group-hover:translate-x-1 sm:right-5 md:static md:translate-y-0"
                />

                {/* Desktop quick peek */}
                {hovered ===
                  location.location_id && (
                  <div
                    className="absolute left-8 top-[calc(100%-8px)] z-30 hidden w-80 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-4 shadow-2xl md:block"
                    onClick={(event) =>
                      event.stopPropagation()
                    }
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]">
                        <MapPin size={18} />
                      </div>

                      <div className="min-w-0">
                        <div className="break-words text-sm font-semibold">
                          {location.building_name ||
                            'Building unavailable'}
                        </div>

                        <div className="mt-1 break-words text-xs text-[var(--muted)]">
                          {location.community ||
                            'Community unavailable'}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <div className="rounded-xl bg-[var(--background)] p-3">
                        <div className="text-[10px] uppercase tracking-wider text-[var(--muted)]">
                          Units
                        </div>

                        <div className="mt-1 text-sm font-semibold">
                          {location.unit_count.toLocaleString()}
                        </div>
                      </div>

                      <div className="rounded-xl bg-[var(--background)] p-3">
                        <div className="text-[10px] uppercase tracking-wider text-[var(--muted)]">
                          Area
                        </div>

                        <div className="mt-1 break-words text-xs font-medium">
                          {location.area_name ||
                            'Not available'}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 break-all font-mono text-[10px] leading-4 text-[var(--muted)]">
                      {location.location_id}
                    </div>

                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation()

                        navigate(
                          `/locations/${encodeURIComponent(location.location_id)}`,
                        )
                      }}
                      className="mt-3 flex min-h-10 w-full items-center gap-2 rounded-xl px-2 py-2 text-xs font-medium text-[var(--primary)] transition hover:bg-[var(--primary-soft)]"
                    >
                      <MapPin size={14} />

                      <span>
                        Open location
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-[var(--muted)]">
            Page {page} of {totalPages}
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex">
            <button
              type="button"
              disabled={page === 1}
              onClick={() =>
                setPage((value) => value - 1)
              }
              className="min-h-10 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm transition hover:bg-[var(--background)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <button
              type="button"
              disabled={page === totalPages}
              onClick={() =>
                setPage((value) => value + 1)
              }
              className="min-h-10 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm transition hover:bg-[var(--background)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
