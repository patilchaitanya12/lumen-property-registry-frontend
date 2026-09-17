import {
  Package,
  Info,
} from 'lucide-react'

export function Orders() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <section>
        <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--muted)]">
          Registry
        </div>

        <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
          Orders
        </h1>

        <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--muted)]">
          Property transactions and orders.
        </p>
      </section>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:rounded-3xl sm:p-8">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-start">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)]">
            <Package size={21} />
          </div>

          <div className="min-w-0">
            <h2 className="text-sm font-semibold">
              No transaction-level orders imported
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
              The current source data contains property
              and ownership records, but does not provide
              a reliable row-level order identifier.
              Orders will be added when transaction-level
              source data is available.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-5 sm:rounded-3xl sm:p-6">
        <div className="flex items-start gap-3">
          <Info
            size={17}
            className="mt-0.5 shrink-0 text-[var(--muted)]"
          />

          <div className="min-w-0">
            <div className="text-sm font-medium">
              Registry data status
            </div>

            <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
              The dashboard currently reports 0 orders.
              This reflects the available source data and
              is not a generated estimate.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
