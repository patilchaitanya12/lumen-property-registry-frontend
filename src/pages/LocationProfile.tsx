import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Home,
  MapPin,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { apiFetch } from '../lib/api'

interface LocationUnit {
  unit_id: string
  property_id: string | null
  unit_code: string | null
  unit_number: string | null
  property_type: string | null
}

interface LocationDetail {
  location_id: string
  area_name: string | null
  community: string | null
  project: string | null
  project_land: string | null
  building_no: string | null
  building_name: string | null
  unit_count: number
  units: LocationUnit[]
}

export function LocationProfile() {
  const navigate = useNavigate()
  const { locationId } = useParams()

  const [location, setLocation] =
    useState<LocationDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!locationId) return

    setLoading(true)

    apiFetch<LocationDetail>(
      `/api/locations/${encodeURIComponent(locationId)}`
    )
      .then(setLocation)
      .finally(() => setLoading(false))
  }, [locationId])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-[var(--surface)]" />
        <div className="h-40 animate-pulse rounded-3xl bg-[var(--surface)]" />
        <div className="h-80 animate-pulse rounded-3xl bg-[var(--surface)]" />
      </div>
    )
  }

  if (!location) {
    return (
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-10 text-center">
        <MapPin
          size={28}
          className="mx-auto text-[var(--muted)]"
        />

        <div className="mt-4 text-sm font-semibold">
          Location not found
        </div>

        <button
          type="button"
          onClick={() => navigate('/locations')}
          className="mt-5 rounded-xl bg-[var(--foreground)] px-4 py-2 text-sm font-medium text-[var(--background)]"
        >
          Back to locations
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Back */}
      <button
        type="button"
        onClick={() => navigate('/locations')}
        className="inline-flex min-h-10 items-center gap-2 rounded-xl px-2 py-2 text-sm font-medium text-[var(--muted)] transition hover:bg-[var(--surface)] hover:text-[var(--foreground)]"
      >
        <ArrowLeft size={16} />
        Locations
      </button>

      {/* Header */}
      <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)]">
              <Building2 size={22} />
            </div>

            <div className="min-w-0">
              <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--muted)]">
                Location
              </div>

              <h1 className="mt-1 break-words text-2xl font-semibold tracking-tight sm:text-3xl">
                {location.building_name || 'Building unavailable'}
              </h1>

              <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[var(--muted)]">
                <span>
                  {location.community || 'Community unavailable'}
                </span>

                {location.project && (
                  <>
                    <span>·</span>
                    <span>{location.project}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="shrink-0 rounded-2xl bg-[var(--background)] px-4 py-3">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
              Units
            </div>
            <div className="mt-1 text-xl font-semibold">
              {location.unit_count.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-[var(--border)] pt-5">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
            Location ID
          </div>

          <div className="mt-1 break-all font-mono text-xs text-[var(--muted)]">
            {location.location_id}
          </div>
        </div>
      </section>

      {/* Location details */}
      <section>
        <div className="mb-3">
          <div className="text-lg font-semibold">
            Location information
          </div>

          <div className="mt-1 text-sm text-[var(--muted)]">
            Registry attributes associated with this location.
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['Area', location.area_name],
            ['Community', location.community],
            ['Project', location.project],
            ['Building No.', location.building_no],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4"
            >
              <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                {label}
              </div>

              <div className="mt-2 break-words text-sm font-medium">
                {value || 'Not available'}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Units */}
      <section>
        <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-lg font-semibold">
              Registered units
            </div>

            <div className="mt-1 text-sm text-[var(--muted)]">
              Units linked directly to this location.
            </div>
          </div>

          <div className="text-xs text-[var(--muted)]">
            {location.units.length.toLocaleString()} loaded
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)]">
          {/* Desktop header */}
          <div className="hidden grid-cols-[minmax(180px,1.2fr)_minmax(180px,1fr)_minmax(140px,.8fr)_50px] gap-4 border-b border-[var(--border)] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)] md:grid">
            <span>Property ID</span>
            <span>Unit Code</span>
            <span>Type</span>
            <span />
          </div>

          {location.units.length === 0 ? (
            <div className="p-10 text-center">
              <Home
                size={25}
                className="mx-auto text-[var(--muted)]"
              />

              <div className="mt-4 text-sm font-medium">
                No units linked
              </div>
            </div>
          ) : (
            location.units.map((unit) => (
              <button
                key={unit.unit_id}
                type="button"
                onClick={() =>
                  navigate(
                    `/properties/${encodeURIComponent(unit.unit_id)}`
                  )
                }
                className="group w-full border-b border-[var(--border)] px-4 py-4 text-left transition last:border-0 hover:bg-[var(--background)] sm:px-5 md:grid md:grid-cols-[minmax(180px,1.2fr)_minmax(180px,1fr)_minmax(140px,.8fr)_50px] md:items-center md:gap-4"
              >
                {/* Property ID */}
                <div className="min-w-0">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)] md:hidden">
                    Property ID
                  </div>

                  <div className="mt-1 break-all font-mono text-xs text-[var(--foreground)] md:mt-0">
                    {unit.property_id || unit.unit_id}
                  </div>
                </div>

                {/* Unit code */}
                <div className="mt-3 min-w-0 md:mt-0">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)] md:hidden">
                    Unit Code
                  </div>

                  <div className="mt-1 break-all text-sm font-medium md:mt-0">
                    {unit.unit_code ||
                      unit.unit_number ||
                      'Not available'}
                  </div>
                </div>

                {/* Type */}
                <div className="mt-3 md:mt-0">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)] md:hidden">
                    Property Type
                  </div>

                  <div className="mt-1 text-xs text-[var(--muted)] md:mt-0">
                    {unit.property_type || 'Not available'}
                  </div>
                </div>

                <ArrowRight
                  size={16}
                  className="absolute right-5 hidden text-[var(--muted)] transition-transform group-hover:translate-x-1 md:block"
                />
              </button>
            ))
          )}
        </div>
      </section>
    </div>
  )
}
