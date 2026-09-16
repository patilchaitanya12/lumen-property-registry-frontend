import {
  Building2,
  MapPin,
  Package,
  Users,
} from 'lucide-react'
import {
  useEffect,
  useState,
} from 'react'

import { apiFetch } from '../lib/api'

interface DashboardData {
  owners: number
  units: number
  locations: number
  orders: number
  ownership_relationships: number
  multi_owner_units: number
}

function formatNumber(
  value: number,
) {
  return new Intl.NumberFormat(
    'en-US',
    {
      notation: 'compact',
      maximumFractionDigits: 1,
    },
  ).format(value)
}

const cards = [
  {
    key: 'owners',
    label: 'Owners',
    icon: Users,
  },
  {
    key: 'units',
    label: 'Properties',
    icon: Building2,
  },
  {
    key: 'locations',
    label: 'Locations',
    icon: MapPin,
  },
  {
    key: 'orders',
    label: 'Orders',
    icon: Package,
  },
] as const

export function Dashboard() {
  const [data, setData] =
    useState<DashboardData | null>(
      null,
    )

  const [error, setError] =
    useState(false)

  useEffect(() => {
    apiFetch<DashboardData>(
      '/api/dashboard',
    )
      .then(setData)
      .catch(() => setError(true))
  }, [])

  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm text-[var(--muted)]">
          A single view of your property
          registry.
        </p>
      </section>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Unable to connect to the registry
          API.
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(
          ({
            key,
            label,
            icon: Icon,
          }) => (
            <div
              key={key}
              className="group rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]">
                  <Icon size={18} />
                </div>
              </div>

              <div className="mt-7">
                <div className="text-3xl font-semibold tracking-tight">
                  {data
                    ? formatNumber(
                        data[key],
                      )
                    : '—'}
                </div>

                <div className="mt-1 text-sm text-[var(--muted)]">
                  {label}
                </div>
              </div>
            </div>
          ),
        )}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <div className="text-sm font-semibold">
            Ownership
          </div>

          <p className="mt-1 text-sm text-[var(--muted)]">
            Relationship overview across the
            registry.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-[var(--background)] p-4">
              <div className="text-2xl font-semibold">
                {data
                  ? formatNumber(
                      data.ownership_relationships,
                    )
                  : '—'}
              </div>

              <div className="mt-1 text-xs text-[var(--muted)]">
                Ownership links
              </div>
            </div>

            <div className="rounded-2xl bg-[var(--background)] p-4">
              <div className="text-2xl font-semibold">
                {data
                  ? data.multi_owner_units
                  : '—'}
              </div>

              <div className="mt-1 text-xs text-[var(--muted)]">
                Multi-owner units
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <div className="text-sm font-semibold">
            Data model
          </div>

          <p className="mt-1 text-sm text-[var(--muted)]">
            The registry keeps physical units and
            owners as independent identities.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-2 text-xs">
            {[
              'Owner',
              'Unit',
              'Location',
              'Order',
            ].map((item) => (
              <span
                key={item}
                className="rounded-full border border-[var(--border)] px-3 py-1.5"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}