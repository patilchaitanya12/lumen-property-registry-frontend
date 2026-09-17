import {
  ArrowLeft,
  ArrowUpRight,
  Building2,
  Calendar,
  MapPin,
  UserRound,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { apiFetch } from '../lib/api'

interface Owner {
  owner_id: string
  name: string
  owner_type: string | null
  start_date: string | null
  end_date: string | null
}

interface Location {
  location_id: string
  community: string | null
  building_name: string | null
}

interface UnitDetail {
  unit_id: string
  property_id: string
  unit_code: string | null
  unit_number: string | null
  property_type: string | null
  size: number | null
  dm_no: string | null
  dm_sub_no: string | null
  land_sub_number: string | null
  location: Location | null
  owners: Owner[]
}

function value(
  item: string | number | null,
) {
  return item === null ||
    item === undefined ||
    item === ''
    ? 'Not available'
    : String(item)
}

function dateRange(
  start: string | null,
  end: string | null,
) {
  if (!start && !end) {
    return 'Period unavailable'
  }

  return `${value(start)} — ${value(end)}`
}

export function UnitProfile() {
  const navigate = useNavigate()
  const { unitId } = useParams()

  const decodedUnitId = unitId
    ? decodeURIComponent(unitId)
    : ''

  const [unit, setUnit] =
    useState<UnitDetail | null>(null)

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {
    if (!decodedUnitId) return

    setLoading(true)

    apiFetch<UnitDetail>(
      `/api/units/${encodeURIComponent(decodedUnitId)}`,
    )
      .then(setUnit)
      .finally(() => setLoading(false))
  }, [decodedUnitId])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-5 w-28 animate-pulse rounded bg-[var(--border)]" />
        <div className="h-64 animate-pulse rounded-3xl bg-[var(--surface)]" />
        <div className="h-48 animate-pulse rounded-3xl bg-[var(--surface)]" />
      </div>
    )
  }

  if (!unit) {
    return (
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-12 text-center">
        <Building2
          size={28}
          className="mx-auto text-[var(--muted)]"
        />

        <h1 className="mt-4 text-lg font-semibold">
          Property not found
        </h1>

        <button
          onClick={() => navigate('/properties')}
          className="mt-6 rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white"
        >
          Back to properties
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <button
        onClick={() => navigate('/properties')}
        className="flex items-center gap-2 text-sm text-[var(--muted)] transition hover:text-[var(--foreground)]"
      >
        <ArrowLeft size={16} />
        Properties
      </button>

      {/* Hero */}
      <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)]">
            <Building2 size={28} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-mono text-2xl font-semibold tracking-tight sm:text-3xl">
                {unit.property_id}
              </h1>

              <span className="rounded-full border border-[var(--border)] px-2.5 py-1 text-[11px]">
                {unit.property_type ||
                  'Property'}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-4 text-sm text-[var(--muted)]">
              <span>
                Unit {unit.unit_number || 'Not available'}
              </span>

              <span>
                Code {unit.unit_code || 'Not available'}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['Unit code', unit.unit_code],
            ['Property type', unit.property_type],
            ['Size', unit.size ? `${unit.size} sqm` : null],
            ['DM number', unit.dm_no],
          ].map(([label, item]) => (
            <div
              key={label}
              className="rounded-2xl bg-[var(--background)] p-4"
            >
              <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                {label}
              </div>

              <div className="mt-2 truncate text-sm font-medium">
                {value(item)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Location */}
      <section>
        <div className="mb-3 px-1">
          <h2 className="text-sm font-semibold">
            Location
          </h2>

          <p className="mt-1 text-xs text-[var(--muted)]">
            Physical location associated with this unit.
          </p>
        </div>

        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6">
          {unit.location ? (
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]">
                <MapPin size={19} />
              </div>

              <div>
                <div className="text-base font-semibold">
                  {unit.location.building_name ||
                    'Building unavailable'}
                </div>

                <div className="mt-1 text-sm text-[var(--muted)]">
                  {unit.location.community ||
                    'Community unavailable'}
                </div>

                <div className="mt-2 font-mono text-[11px] text-[var(--muted)]">
                  {unit.location.location_id}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-4 text-sm text-[var(--muted)]">
              Location information unavailable.
            </div>
          )}
        </div>
      </section>

      {/* Owners */}
      <section>
        <div className="mb-3 flex items-end justify-between px-1">
          <div>
            <h2 className="text-sm font-semibold">
              Owners
            </h2>

            <p className="mt-1 text-xs text-[var(--muted)]">
              Owners connected to this physical unit.
            </p>
          </div>

          <span className="text-xs text-[var(--muted)]">
            {unit.owners.length} owner
            {unit.owners.length === 1
              ? ''
              : 's'}
          </span>
        </div>

        {unit.owners.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[var(--border)] p-10 text-center">
            <UserRound
              size={24}
              className="mx-auto text-[var(--muted)]"
            />

            <div className="mt-3 text-sm font-medium">
              No owners recorded
            </div>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {unit.owners.map((owner) => (
              <button
                key={owner.owner_id}
                onClick={() =>
                  navigate(
                    `/owners/${encodeURIComponent(owner.owner_id)}`,
                  )
                }
                className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 text-left transition-all hover:-translate-y-0.5 hover:border-[var(--primary)]/30 hover:shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]">
                    <UserRound size={18} />
                  </div>

                  <ArrowUpRight
                    size={16}
                    className="text-[var(--muted)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </div>

                <div className="mt-5">
                  <div className="text-sm font-semibold">
                    {owner.name}
                  </div>

                  <div className="mt-1 break-all font-mono text-[10px] text-[var(--muted)]">
                    {owner.owner_id}
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-1.5 text-xs text-[var(--muted)]">
                  <Calendar size={13} />

                  {dateRange(
                    owner.start_date,
                    owner.end_date,
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Identity details */}
      <section>
        <div className="mb-3 px-1">
          <h2 className="text-sm font-semibold">
            Registry identifiers
          </h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {[
            ['Property ID', unit.property_id],
            ['DM sub number', unit.dm_sub_no],
            ['Land sub number', unit.land_sub_number],
          ].map(([label, item]) => (
            <div
              key={label}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4"
            >
              <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                {label}
              </div>

              <div className="mt-2 break-all font-mono text-xs font-medium">
                {value(item)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Orders */}
      <section className="rounded-3xl border border-dashed border-[var(--border)] p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--background)]">
            <ArrowUpRight
              size={17}
              className="text-[var(--muted)]"
            />
          </div>

          <div>
            <div className="text-sm font-semibold">
              Orders
            </div>

            <div className="mt-1 text-xs text-[var(--muted)]">
              No transaction-level orders have been
              imported yet.
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}