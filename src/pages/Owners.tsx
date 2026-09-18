import {
  ArrowRight,
  Building2,
  Search,
  UserRound,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { apiFetch } from '../lib/api'

interface Owner {
  owner_id: string
  record_id: string | null
  name: string
  owner_type: string | null
  country: string | null
}

interface OwnerResponse {
  items: Owner[]
  page: number
  page_size: number
  total: number
}

export function Owners() {
  const navigate = useNavigate()

  const [owners, setOwners] = useState<Owner[]>([])
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [hoveredOwner, setHoveredOwner] =
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

    apiFetch<OwnerResponse>(
      `/api/owners?${params.toString()}`,
    )
      .then((data) => {
        setOwners(data.items)
        setTotal(data.total)
      })
      .finally(() => setLoading(false))
  }, [query, page])

  const totalPages = Math.ceil(total / 25)

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-5">
        <div className="min-w-0">
          <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--muted)]">
            Registry
          </div>

          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Owners
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--muted)]">
            People and organizations connected to
            properties.
          </p>
        </div>

        <div className="shrink-0 text-sm text-[var(--muted)]">
          {total.toLocaleString()} owners
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
          placeholder="Search owner name or Owner ID..."
          className="h-12 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] pl-11 pr-4 text-sm outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10"
        />
      </div>

      {/* Owner list */}
      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] sm:rounded-3xl">
        {/* Desktop header */}
        <div className="hidden grid-cols-[minmax(220px,1.5fr)_minmax(220px,1fr)_140px_50px] gap-4 border-b border-[var(--border)] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)] md:grid">
          <span>Owner</span>
          <span>Owner ID</span>
          <span>Type</span>
          <span />
        </div>

        {loading ? (
          <div className="space-y-1 p-3">
            {Array.from({ length: 8 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="h-20 animate-pulse rounded-2xl bg-[var(--background)] sm:h-16"
                />
              ),
            )}
          </div>
        ) : owners.length === 0 ? (
          <div className="p-10 text-center sm:p-12">
            <UserRound
              size={24}
              className="mx-auto text-[var(--muted)]"
            />

            <div className="mt-4 text-sm font-medium">
              No owners found
            </div>

            <div className="mt-1 text-sm text-[var(--muted)]">
              Try another name or identifier.
            </div>
          </div>
        ) : (
          <div>
            {owners.map((owner) => (
              <div
                key={owner.owner_id}
                className="group relative cursor-pointer border-b border-[var(--border)] px-4 py-4 transition last:border-0 hover:bg-[var(--background)] sm:px-5 md:grid md:grid-cols-[minmax(220px,1.5fr)_minmax(220px,1fr)_140px_50px] md:items-center md:gap-4"
                onMouseEnter={() =>
                  setHoveredOwner(owner.owner_id)
                }
                onMouseLeave={() =>
                  setHoveredOwner(null)
                }
                onClick={() =>
                  navigate(
                    `/owners/${encodeURIComponent(owner.owner_id)}`,
                  )
                }
              >
                {/* Owner */}
                <div className="flex min-w-0 items-start gap-3 pr-8 md:items-center md:pr-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]">
                    <UserRound size={16} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">
                      {owner.name}
                    </div>

                    <div className="mt-1 text-xs text-[var(--muted)] md:hidden">
                      {owner.owner_type ||
                        'Unknown type'}
                    </div>

                    {/* Owner ID on mobile */}
                    <div className="mt-2 break-all font-mono text-[10px] leading-4 text-[var(--muted)] md:hidden">
                      {owner.owner_id}
                    </div>
                  </div>
                </div>

                {/* Owner ID desktop */}
                <div className="hidden truncate font-mono text-[11px] text-[var(--muted)] md:block">
                  {owner.owner_id}
                </div>

                {/* Type desktop */}
                <div className="hidden md:block">
                  <span className="rounded-full border border-[var(--border)] px-2.5 py-1 text-[11px]">
                    {owner.owner_type ||
                      'Unknown'}
                  </span>
                </div>

                {/* Arrow */}
                <ArrowRight
                  size={17}
                  className="absolute right-4 top-5 text-[var(--muted)] transition-transform group-hover:translate-x-1 sm:right-5 md:static md:translate-y-0"
                />

                {/* Desktop quick peek */}
                {hoveredOwner ===
                  owner.owner_id && (
                  <div
                    className="absolute left-8 bottom-[calc(100%-8px)] z-30 hidden w-80 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-4 shadow-2xl md:block"
                    onClick={(event) =>
                      event.stopPropagation()
                    }
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]">
                        <UserRound size={18} />
                      </div>

                      <div className="min-w-0">
                        <div className="text-sm font-semibold">
                          {owner.name}
                        </div>

                        <div className="mt-1 break-all font-mono text-[10px] text-[var(--muted)]">
                          {owner.owner_id}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <div className="rounded-xl bg-[var(--background)] p-3">
                        <div className="text-[10px] uppercase tracking-wider text-[var(--muted)]">
                          Type
                        </div>

                        <div className="mt-1 text-xs font-medium">
                          {owner.owner_type ||
                            'Unknown'}
                        </div>
                      </div>

                      <div className="rounded-xl bg-[var(--background)] p-3">
                        <div className="text-[10px] uppercase tracking-wider text-[var(--muted)]">
                          Country
                        </div>

                        <div className="mt-1 text-xs font-medium">
                          {owner.country ||
                            'Not available'}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation()
                        navigate(
                          `/owners/${encodeURIComponent(owner.owner_id)}`,
                        )
                      }}
                      className="mt-3 flex w-full items-center gap-2 rounded-xl px-2 py-2 text-xs font-medium text-[var(--primary)] transition hover:bg-[var(--primary-soft)]"
                    >
                      <Building2 size={14} />
                      <span>
                        Open owner profile
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
