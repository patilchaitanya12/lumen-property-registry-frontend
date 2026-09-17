import {
  ArrowRight,
  Calendar,
  Clock3,
  History as HistoryIcon,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { apiFetch } from '../lib/api'

interface HistoryItem {
  history_id: number
  unit_id: string
  unit_code: string | null
  owner_id: string
  owner_name: string
  start_date: string | null
  end_date: string | null
  source_order_id: string | null
  created_at: string
}

interface HistoryResponse {
  items: HistoryItem[]
  page: number
  page_size: number
}

function formatDate(value: string | null) {
  if (!value) {
    return 'Date unavailable'
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

export function History() {
  const navigate = useNavigate()

  const [items, setItems] = useState<
    HistoryItem[]
  >([])

  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)

    apiFetch<HistoryResponse>(
      `/api/history?page=${page}&page_size=25`,
    )
      .then((data) => {
        setItems(data.items)
      })
      .finally(() => setLoading(false))
  }, [page])

  return (
    <div className="space-y-8">
      {/* Header */}
      <section>
        <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--muted)]">
          Registry
        </div>

        <div className="mt-2 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              History
            </h1>

            <p className="mt-2 text-sm text-[var(--muted)]">
              Ownership relationships and registry events recorded over time.
            </p>
          </div>

          <div className="hidden items-center gap-2 rounded-full border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--muted)] sm:flex">
            <HistoryIcon size={13} />
            Relationship log
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)]">
        <div className="border-b border-[var(--border)] px-6 py-4">
          <div className="text-sm font-semibold">
            Ownership activity
          </div>

          <div className="mt-1 text-xs text-[var(--muted)]">
            Each record represents a unit ↔ owner relationship.
          </div>
        </div>

        {loading ? (
          <div className="space-y-4 p-6">
            {Array.from({ length: 8 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="h-20 animate-pulse rounded-2xl bg-[var(--background)]"
                />
              ),
            )}
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center">
            <HistoryIcon
              size={26}
              className="mx-auto text-[var(--muted)]"
            />

            <div className="mt-4 text-sm font-medium">
              No history found
            </div>
          </div>
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {items.map((item) => (
              <div
                key={item.history_id}
                className="group p-5 transition hover:bg-[var(--background)] sm:p-6"
              >
                <div className="flex gap-4">
                  {/* Timeline dot */}
                  <div className="relative hidden shrink-0 sm:block">
                    <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]">
                      <Clock3 size={17} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-start">
                      <div className="min-w-0">
                        <div className="text-sm font-semibold">
                          Ownership relationship
                        </div>

                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[var(--muted)]">
                          <button
                            onClick={() =>
                              navigate(
                                `/properties/${encodeURIComponent(item.unit_id)}`,
                              )
                            }
                            className="font-mono text-[var(--primary)] hover:underline"
                          >
                            {item.unit_id}
                          </button>

                          <span>→</span>

                          <button
                            onClick={() =>
                              navigate(
                                `/owners/${encodeURIComponent(item.owner_id)}`,
                              )
                            }
                            className="max-w-[280px] truncate hover:text-[var(--foreground)] hover:underline"
                          >
                            {item.owner_name}
                          </button>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-1.5 text-xs text-[var(--muted)]">
                        <Calendar size={13} />

                        {item.start_date ||
                        item.end_date
                          ? `${formatDate(item.start_date)} — ${formatDate(item.end_date)}`
                          : 'Period unavailable'}
                      </div>
                    </div>

                    <div className="mt-4 grid gap-2 sm:grid-cols-3">
                      <div className="rounded-xl bg-[var(--background)] px-3 py-2.5">
                        <div className="text-[9px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                          Unit code
                        </div>

                        <div className="mt-1 truncate font-mono text-xs">
                          {item.unit_code ||
                            'Not available'}
                        </div>
                      </div>

                      <div className="rounded-xl bg-[var(--background)] px-3 py-2.5">
                        <div className="text-[9px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                          Owner ID
                        </div>

                        <div className="mt-1 truncate font-mono text-xs">
                          {item.owner_id}
                        </div>
                      </div>

                      <div className="rounded-xl bg-[var(--background)] px-3 py-2.5">
                        <div className="text-[9px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                          Source order
                        </div>

                        <div className="mt-1 truncate font-mono text-xs">
                          {item.source_order_id ||
                            'Not available'}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="text-[10px] text-[var(--muted)]">
                        Registry record #
                        {item.history_id}
                      </div>

                      <div className="flex gap-1 opacity-70 transition group-hover:opacity-100">
                        <button
                          onClick={() =>
                            navigate(
                              `/properties/${encodeURIComponent(item.unit_id)}`,
                            )
                          }
                          className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] text-[var(--primary)] hover:bg-[var(--primary-soft)]"
                        >
                          Property
                          <ArrowRight size={11} />
                        </button>

                        <button
                          onClick={() =>
                            navigate(
                              `/owners/${encodeURIComponent(item.owner_id)}`,
                            )
                          }
                          className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] text-[var(--primary)] hover:bg-[var(--primary-soft)]"
                        >
                          Owner
                          <ArrowRight size={11} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-xs text-[var(--muted)]">
          Page {page}
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
            disabled={items.length < 25}
            onClick={() =>
              setPage((value) => value + 1)
            }
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}