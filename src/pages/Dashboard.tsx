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
import { useNavigate } from 'react-router-dom'

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
    route: '/owners',
  },
  {
    key: 'units',
    label: 'Properties',
    icon: Building2,
    route: '/properties',
  },
  {
    key: 'locations',
    label: 'Locations',
    icon: MapPin,
    route: '/locations',
  },
  {
    key: 'orders',
    label: 'Orders',
    icon: Package,
    route: '/orders',
  },
] as const

export function Dashboard() {
  const navigate = useNavigate()

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
    <div className="space-y-6 sm:space-y-8">
      <section>
        <p className="text-sm leading-6 text-[var(--muted)]">
          A single view of your property
          registry.
        </p>
      </section>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700">
          Unable to connect to the registry
          API.
        </div>
      )}

      {/* Registry metrics */}
      <section className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {cards.map(
          ({
            key,
            label,
            icon: Icon,
            route,
          }) => (
            <button
              type="button"
              key={key}
              onClick={() => navigate(route)}
              className="group min-w-0 cursor-pointer rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-left shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--primary)]/30 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 sm:rounded-3xl sm:p-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)] sm:h-10 sm:w-10">
                  <Icon size={17} />
                </div>
              </div>

              <div className="mt-5 sm:mt-7">
                <div className="truncate text-2xl font-semibold tracking-tight sm:text-3xl">
                  {data
                    ? formatNumber(
                        data[key],
                      )
                    : '—'}
                </div>

                <div className="mt-1 truncate text-xs text-[var(--muted)] sm:text-sm">
                  {label}
                </div>
              </div>
            </button>
          ),
        )}
      </section>

      {/* Registry overview */}
      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:rounded-3xl sm:p-6">
          <div className="text-sm font-semibold">
            Ownership
          </div>

          <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
            Relationship overview across the
            registry.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-3 min-[400px]:grid-cols-2 sm:mt-8">
            <div className="rounded-2xl bg-[var(--background)] p-4">
              <div className="text-xl font-semibold sm:text-2xl">
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
              <div className="text-xl font-semibold sm:text-2xl">
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

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:rounded-3xl sm:p-6">
          <div className="text-sm font-semibold">
            Data model
          </div>

          <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
            The registry keeps physical units and
            owners as independent identities.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-2 sm:mt-6">
            {[
              'Owner',
              'Unit',
              'Location',
              'Order',
            ].map((item) => (
              <span
                key={item}
                className="rounded-full border border-[var(--border)] px-3 py-1.5 text-xs"
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