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

  const [locations, setLocations] = useState<Location[]>([])
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [hovered, setHovered] = useState<string | null>(
    null,
  )

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
    <div className="space-y-8">
      {/* Header */}
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--muted)]">
            Registry
          </div>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Locations
          </h1>

          <p className="mt-2 text-sm text-[var(--muted)]">
            Communities and buildings associated with registered units.
          </p>
        </div>

        <div className="text-sm text-[var(--muted)]">
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
      <div className="overflow-visible rounded-3xl border border-[var(--border)] bg-[var(--surface)]">
        <div className="hidden grid-cols-[minmax(220px,1.4fr)_minmax(160px,1fr)_minmax(180px,1fr)_120px_50px] gap-4 border-b border-[var(--border)] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)] md:grid">
          <span>Building</span>
          <span>Community</span>
          <span>Location ID</span>
          <span>Units</span>
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
        ) : locations.length === 0 ? (
          <div className="p-12 text-center">
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
          locations.map((location) => (
            <div
              key={location.location_id}
              onMouseEnter={() =>
                setHovered(location.location_id)
              }
              onMouseLeave={() =>
                setHovered(null)
              }
              className="group relative grid cursor-pointer grid-cols-1 gap-3 border-b border-[var(--border)] px-5 py-4 transition last:border-0 hover:bg-[var(--background)] md:grid-cols-[minmax(220px,1.4fr)_minmax(160px,1fr)_minmax(180px,1fr)_120px_50px] md:items-center md:gap-4"
              onClick={() =>
                navigate(
                  `/locations/${encodeURIComponent(location.location_id)}`,
                )
              }
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]">
                  <Building2 size={16} />
                </div>

                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">
                    {location.building_name ||
                      'Building unavailable'}
                  </div>

                  <div className="mt-1 text-xs text-[var(--muted)] md:hidden">
                    {location.community ||
                      'Community unavailable'}
                  </div>
                </div>
              </div>

              <div className="hidden truncate text-sm text-[var(--muted)] md:block">
                {location.community ||
                  'Not available'}
              </div>

              <div className="hidden truncate font-mono text-[10px] text-[var(--muted)] md:block">
                {location.location_id}
              </div>

              <div className="text-xs text-[var(--muted)]">
                <span className="font-medium text-[var(--foreground)]">
                  {location.unit_count.toLocaleString()}
                </span>{' '}
                units
              </div>

              <ArrowRight
                size={16}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-[var(--muted)] transition-transform group-hover:translate-x-1 md:static md:translate-y-0"
              />

              {/* Quick peek */}
              {hovered === location.location_id && (
                <div
                  className="absolute left-8 top-[calc(100%-8px)] z-30 hidden w-80 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-4 shadow-2xl md:block"
                  onClick={(event) =>
                    event.stopPropagation()
                  }
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]">
                      <MapPin size={18} />
                    </div>

                    <div className="min-w-0">
                      <div className="text-sm font-semibold">
                        {location.building_name ||
                          'Building unavailable'}
                      </div>

                      <div className="mt-1 text-xs text-[var(--muted)]">
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

                      <div className="mt-1 truncate text-xs font-medium">
                        {location.area_name ||
                          'Not available'}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 font-mono text-[10px] text-[var(--muted)]">
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
                    className="mt-3 flex w-full items-center gap-2 rounded-xl px-2 py-2 text-xs font-medium text-[var(--primary)] transition hover:bg-[var(--primary-soft)]"
                  >
                    <MapPin size={14} />
                    <span>Open location</span>

                    <ArrowRight
                      size={13}
                      className="ml-auto"
                    />
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
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
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm disabled:opacity-40"
            >
              Previous
            </button>

            <button
              disabled={page === totalPages}
              onClick={() =>
                setPage((value) => value + 1)
              }
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}