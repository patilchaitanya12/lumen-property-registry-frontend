import {
  ArrowLeft,
  ArrowUpRight,
  Building2,
  Calendar,
  Mail,
  Copy,
  MapPin,
  Phone,
  UserRound,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { apiFetch } from '../lib/api'

interface Owner {
  owner_id: string
  record_id: string | null
  name: string
  normalized_name: string | null
  owner_type: string | null
  country: string | null
  id_number: string | null
  uae_id_number: string | null
  unified_number: string | null
  property_count: number
  contacts: {
    contact_id: number
    type: string
    value: string
    is_primary: boolean
  }[]
}

interface OwnerUnit {
  unit_id: string
  property_id: string
  unit_code: string | null
  unit_number: string | null
  location_id: string | null
  property_type: string | null
  start_date: string | null
  end_date: string | null
}

interface OwnerUnitsResponse {
  owner_id: string
  items: OwnerUnit[]
  total: number
}

interface HistoryItem {
  history_id: number
  unit_id: string
  start_date: string | null
  end_date: string | null
  source_order_id: string | null
}

interface HistoryResponse {
  owner_id: string
  items: HistoryItem[]
  total: number
}

function formatDate(
  value: string | null,
) {
  if (!value) {
    return 'Date unavailable'
  }

  return new Intl.DateTimeFormat(
    'en-IN',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    },
  ).format(new Date(value))
}

function displayValue(
  value: string | null,
) {
  return value || 'Not available'
}

export function OwnerProfile() {
  const navigate = useNavigate()
  const { ownerId } = useParams()

  const decodedOwnerId = ownerId
    ? decodeURIComponent(ownerId)
    : ''

  const [owner, setOwner] =
    useState<Owner | null>(null)

  const [units, setUnits] =
    useState<OwnerUnit[]>([])

  const [history, setHistory] =
    useState<HistoryItem[]>([])

  const [loading, setLoading] =
    useState(true)

  const [copied, setCopied] =
    useState(false)

  useEffect(() => {
    if (!decodedOwnerId) return

    setLoading(true)

    Promise.all([
      apiFetch<Owner>(
        `/api/owners/${encodeURIComponent(decodedOwnerId)}`,
      ),
      apiFetch<OwnerUnitsResponse>(
        `/api/owners/${encodeURIComponent(decodedOwnerId)}/units`,
      ),
      apiFetch<HistoryResponse>(
        `/api/owners/${encodeURIComponent(decodedOwnerId)}/history`,
      ),
    ])
      .then(
        ([
          ownerData,
          unitsData,
          historyData,
        ]) => {
          setOwner(ownerData)
          setUnits(unitsData.items)
          setHistory(historyData.items)
        },
      )
      .finally(() => setLoading(false))
  }, [decodedOwnerId])

  const copyOwnerId = async () => {
    if (!owner) return

    await navigator.clipboard.writeText(
      owner.owner_id,
    )

    setCopied(true)

    window.setTimeout(
      () => setCopied(false),
      1500,
    )
  }

  if (loading) {
    return (
      <div className="space-y-5 sm:space-y-6">
        <div className="h-5 w-24 animate-pulse rounded bg-[var(--border)]" />

        <div className="h-64 animate-pulse rounded-3xl bg-[var(--surface)] sm:h-56" />

        <div className="h-72 animate-pulse rounded-3xl bg-[var(--surface)]" />
      </div>
    )
  }

  if (!owner) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center sm:rounded-3xl sm:p-12">
        <UserRound
          size={28}
          className="mx-auto text-[var(--muted)]"
        />

        <h1 className="mt-4 text-lg font-semibold">
          Owner not found
        </h1>

        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
          This owner could not be found in the
          registry.
        </p>

        <button
          type="button"
          onClick={() => navigate('/owners')}
          className="mt-6 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-medium text-white"
        >
          Back to owners
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Back */}
      <button
        type="button"
        onClick={() => navigate('/owners')}
        className="flex min-h-10 items-center gap-2 text-sm text-[var(--muted)] transition hover:text-[var(--foreground)]"
      >
        <ArrowLeft size={16} />
        Owners
      </button>

      {/* Owner hero */}
      <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] sm:rounded-3xl">
        <div className="p-5 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)] sm:h-16 sm:w-16">
              <UserRound size={26} />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-col items-start gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                <h1 className="max-w-full break-words text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
                  {owner.name}
                </h1>

                {owner.owner_type && (
                  <span className="shrink-0 rounded-full border border-[var(--border)] px-2.5 py-1 text-[11px]">
                    {owner.owner_type}
                  </span>
                )}
              </div>

              <div className="mt-3 flex max-w-full items-start gap-2">
                <span className="min-w-0 break-all font-mono text-[11px] leading-5 text-[var(--muted)] sm:text-xs">
                  {owner.owner_id}
                </span>

                <button
                  type="button"
                  onClick={copyOwnerId}
                  className="mt-0.5 shrink-0 rounded-lg p-1.5 text-[var(--muted)] transition hover:bg-[var(--background)] hover:text-[var(--foreground)]"
                  title="Copy Owner ID"
                  aria-label="Copy Owner ID"
                >
                  <Copy size={13} />
                </button>

                {copied && (
                  <span className="shrink-0 pt-1 text-[11px] text-[var(--primary)]">
                    Copied
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:grid-cols-3">
            <div className="rounded-2xl bg-[var(--background)] p-4">
              <div className="text-xl font-semibold sm:text-2xl">
                {owner.property_count.toLocaleString()}
              </div>

              <div className="mt-1 text-xs text-[var(--muted)]">
                Properties
              </div>
            </div>

            <div className="rounded-2xl bg-[var(--background)] p-4">
              <div className="text-xl font-semibold sm:text-2xl">
                {new Set(
                  units
                    .map((unit) => unit.location_id)
                    .filter(Boolean),
                ).size.toLocaleString()}
              </div>

              <div className="mt-1 text-xs text-[var(--muted)]">
                Locations
              </div>
            </div>

            <div className="col-span-2 rounded-2xl bg-[var(--background)] p-4 sm:col-span-1">
              <div className="text-xl font-semibold sm:text-2xl">
                {history.length.toLocaleString()}
              </div>

              <div className="mt-1 text-xs text-[var(--muted)]">
                Ownership records
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Identity */}
      <section>
        <div className="mb-3 px-1">
          <h2 className="text-sm font-semibold">
            Identity
          </h2>

          <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
            Registry identity and available
            identifiers.
          </p>
        </div>

        <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
          {[
            ['Owner type', owner.owner_type],
            ['Country', owner.country],
            ['ID number', owner.id_number],
            ['UAE ID', owner.uae_id_number],
          ].map(([label, value]) => (
            <div
              key={label}
              className="min-w-0 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4"
            >
              <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                {label}
              </div>

              <div className="mt-2 break-words text-sm font-medium">
                {displayValue(value)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contacts */}
      <section>
        <div className="mb-3 px-1">
          <h2 className="text-sm font-semibold">
            Contact Information
          </h2>

          <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
            Contact details associated with this
            owner.
          </p>
        </div>

        {owner.contacts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--border)] p-8 text-center text-sm text-[var(--muted)] sm:rounded-3xl">
            No contact information available.
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {owner.contacts.map((contact) => {
              const isPhone =
                contact.type
                  .toLowerCase()
                  .includes('mobile') ||
                contact.type
                  .toLowerCase()
                  .includes('landline')

              const isEmail =
                contact.type
                  .toLowerCase()
                  .includes('email')

              const Icon = isPhone
                ? Phone
                : isEmail
                  ? Mail
                  : UserRound

              return (
                <div
                  key={contact.contact_id}
                  className="min-w-0 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]">
                      <Icon size={17} />
                    </div>

                    {contact.is_primary && (
                      <span className="shrink-0 rounded-full bg-[var(--primary-soft)] px-2.5 py-1 text-[10px] font-medium text-[var(--primary)]">
                        Primary
                      </span>
                    )}
                  </div>

                  <div className="mt-4 min-w-0">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                      {contact.type}
                    </div>

                    <div className="mt-2 break-all text-sm font-medium">
                      {contact.value}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Properties */}
      <section>
        <div className="mb-3 flex flex-col gap-1 px-1 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
          <div>
            <h2 className="text-sm font-semibold">
              Properties
            </h2>

            <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
              Units currently linked to this owner.
            </p>
          </div>

          <span className="text-xs text-[var(--muted)]">
            {units.length.toLocaleString()} records
          </span>
        </div>

        {units.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--border)] p-10 text-center sm:rounded-3xl">
            <Building2
              size={24}
              className="mx-auto text-[var(--muted)]"
            />

            <div className="mt-3 text-sm font-medium">
              No properties linked
            </div>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {units.map((unit) => (
              <button
                type="button"
                key={unit.unit_id}
                onClick={() =>
                  navigate(
                    `/properties/${encodeURIComponent(unit.unit_id)}`,
                  )
                }
                className="group min-w-0 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-left transition-all hover:-translate-y-0.5 hover:border-[var(--primary)]/30 hover:shadow-lg sm:p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]">
                    <Building2 size={18} />
                  </div>

                  <ArrowUpRight
                    size={16}
                    className="shrink-0 text-[var(--muted)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </div>

                <div className="mt-5 min-w-0">
                  <div className="break-all font-mono text-xs font-medium leading-5 sm:text-sm">
                    {unit.unit_id}
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[var(--muted)]">
                    <span>
                      Unit {unit.unit_number || '—'}
                    </span>

                    <span>·</span>

                    <span>
                      {unit.property_type ||
                        'Property'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex min-w-0 items-start gap-1.5 text-[11px] leading-4 text-[var(--muted)]">
                  <MapPin
                    size={12}
                    className="mt-0.5 shrink-0"
                  />

                  <span className="break-all">
                    {unit.location_id ||
                      'Location unavailable'}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* History */}
      <section>
        <div className="mb-3 px-1">
          <h2 className="text-sm font-semibold">
            Ownership History
          </h2>

          <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
            Historical ownership relationships
            recorded in the registry.
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:rounded-3xl sm:p-6">
          {history.length === 0 ? (
            <div className="py-8 text-center text-sm text-[var(--muted)]">
              No ownership history recorded.
            </div>
          ) : (
            <div className="space-y-0">
              {history.map(
                (item, index) => (
                  <div
                    key={item.history_id}
                    className="relative flex gap-3 pb-7 last:pb-0 sm:gap-4"
                  >
                    {index <
                      history.length - 1 && (
                      <div className="absolute left-[7px] top-5 h-full w-px bg-[var(--border)]" />
                    )}

                    <div className="relative mt-1 h-4 w-4 shrink-0 rounded-full border-2 border-[var(--primary)] bg-[var(--surface)]" />

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:gap-4">
                        <div className="min-w-0">
                          <div className="text-sm font-medium">
                            Ownership relationship
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/properties/${encodeURIComponent(item.unit_id)}`,
                              )
                            }
                            className="mt-1 max-w-full break-all text-left font-mono text-xs leading-5 text-[var(--primary)] hover:underline"
                          >
                            {item.unit_id}
                          </button>
                        </div>

                        <div className="flex shrink-0 items-start gap-1.5 text-xs leading-5 text-[var(--muted)] sm:items-center">
                          <Calendar
                            size={13}
                            className="mt-1 shrink-0 sm:mt-0"
                          />

                          <span>
                            {item.start_date ||
                            item.end_date
                              ? `${formatDate(item.start_date)} — ${formatDate(item.end_date)}`
                              : 'Period unavailable'}
                          </span>
                        </div>
                      </div>

                      {item.source_order_id && (
                        <div className="mt-2 break-all text-[11px] leading-5 text-[var(--muted)]">
                          Source order:{' '}
                          <span className="font-mono">
                            {item.source_order_id}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ),
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
