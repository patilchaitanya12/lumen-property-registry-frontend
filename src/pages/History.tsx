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
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <section>
        <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--muted)]">
          Registry
        </div>

        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              History
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
              Ownership relationships and registry
              events recorded over time.
            </p>
          </div>

          <div className="hidden shrink-0 items-center gap-2 rounded-full border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--muted)] sm:flex">
            <HistoryIcon size={13} />
            Relationship log
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] sm:rounded-3xl">
        <div className="border-b border-[var(--border)] px-4 py-4 sm:px-6">
          <div className="text-sm font-semibold">
            Ownership activity
          </div>

          <div className="mt-1 text-xs leading-5 text-[var(--muted)]">
            Each record represents a unit ↔ owner
            relationship.
          </div>
        </div>

        {loading ? (
          <div className="space-y-4 p-4 sm:p-6">
            {Array.from({ length: 8 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="h-28 animate-pulse rounded-2xl bg-[var(--background)] sm:h-20"
                />
              ),
            )}
          </div>
        ) : items.length === 0 ? (
          <div className="p-10 text-center sm:p-12">
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
                className="group p-4 transition hover:bg-[var(--background)] sm:p-6"
              >
                <div className="flex gap-3 sm:gap-4">
                  {/* Timeline icon */}
                  <div className="hidden shrink-0 sm:block">
                    <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]">
                      <Clock3 size={17} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0">
                        <div className="text-sm font-semibold">
                          Ownership relationship
                        </div>

                        <div className="mt-2 flex min-w-0 flex-col gap-1.5 text-xs sm:flex-row sm:flex-wrap sm:items-center sm:gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/properties/${encodeURIComponent(item.unit_id)}`,
                              )
                            }
                            className="max-w-full break-all text-left font-mono leading-5 text-[var(--primary)] hover:underline"
                          >
                            {item.unit_id}
                          </button>

                          <span className="hidden text-[var(--muted)] sm:inline">
                            →
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/owners/${encodeURIComponent(item.owner_id)}`,
                              )
                            }
                            className="max-w-full break-words text-left font-medium leading-5 hover:text-[var(--foreground)] hover:underline"
                          >
                            {item.owner_name}
                          </button>
                        </div>
                      </div>

                      <div className="flex min-w-0 items-start gap-1.5 text-xs leading-5 text-[var(--muted)] lg:max-w-[320px]">
                        <Calendar
                          size={13}
                          className="mt-1 shrink-0"
                        />

                        <span className="break-words">
                          {item.start_date ||
                          item.end_date
                            ? `${formatDate(item.start_date)} — ${formatDate(item.end_date)}`
                            : 'Period unavailable'}
                        </span>
                      </div>
                    </div>

                    {/* Registry details */}
                    <div className="mt-4 grid gap-2 sm:grid-cols-3">
                      <div className="min-w-0 rounded-xl bg-[var(--background)] px-3 py-2.5">
                        <div className="text-[9px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                          Unit code
                        </div>

                        <div className="mt-1 break-all font-mono text-xs leading-5">
                          {item.unit_code ||
                            'Not available'}
                        </div>
                      </div>

                      <div className="min-w-0 rounded-xl bg-[var(--background)] px-3 py-2.5">
                        <div className="text-[9px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                          Owner ID
                        </div>

                        <div className="mt-1 break-all font-mono text-xs leading-5">
                          {item.owner_id}
                        </div>
                      </div>

                      <div className="min-w-0 rounded-xl bg-[var(--background)] px-3 py-2.5">
                        <div className="text-[9px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                          Source order
                        </div>

                        <div className="mt-1 break-all font-mono text-xs leading-5">
                          {item.source_order_id ||
                            'Not available'}
                        </div>
                      </div>
                    </div>

                    {/* Footer actions */}
                    <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="text-[10px] text-[var(--muted)]">
                        Registry record #
                        {item.history_id}
                      </div>

                      <div className="grid grid-cols-2 gap-2 sm:flex">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/properties/${encodeURIComponent(item.unit_id)}`,
                            )
                          }
                          className="flex min-h-9 items-center justify-center gap-1 rounded-lg px-2.5 py-2 text-[11px] text-[var(--primary)] transition hover:bg-[var(--primary-soft)]"
                        >
                          Property
                          <ArrowRight size={11} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/owners/${encodeURIComponent(item.owner_id)}`,
                            )
                          }
                          className="flex min-h-9 items-center justify-center gap-1 rounded-lg px-2.5 py-2 text-[11px] text-[var(--primary)] transition hover:bg-[var(--primary-soft)]"
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-xs text-[var(--muted)]">
          Page {page}
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
            disabled={items.length < 25}
            onClick={() =>
              setPage((value) => value + 1)
            }
            className="min-h-10 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm transition hover:bg-[var(--background)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
