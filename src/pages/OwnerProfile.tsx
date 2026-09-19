import {
  ArrowLeft,
  ArrowUpRight,
  Building2,
  Calendar,
  CheckCircle2,
  CircleUserRound,
  Copy,
  FileText,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { apiFetch } from '../lib/api'

interface Contact {
  contact_id: number
  type: string
  value: string
  is_primary: boolean
}

interface Owner {
  owner_id: string
  record_id: string | null
  name: string
  normalized_name: string | null
  first_name: string | null
  last_name: string | null
  title: string | null
  owner_type: string | null
  vip_tier: string | null
  gender: string | null
  gender_source: string | null
  country: string | null
  id_number: string | null
  uae_id_number: string | null
  unified_number: string | null
  passport_expiry_date: string | null
  birth_date: string | null
  is_reachable: boolean | null
  is_active: boolean
  notes: string | null
}

interface OwnerUnit {
  unit_id: string
  property_id: string
  unit_code: string | null
  unit_number: string | null
  property_type: string | null
  size: number | null
  dm_no: string | null
  dm_sub_no: string | null
  land_sub_number: string | null
  location_id: string | null
  ownership_start_date: string | null
  ownership_end_date: string | null
}

interface Portfolio {
  source_property_count: number | null
  calculated_property_count: number
  communities_owned: number | null
  communities: string[]
  buildings: string[]
  is_multi_property: boolean | null
  is_portfolio_investor: boolean | null
  has_cross_community: boolean | null
  portfolio_tier: string | null
  has_plot: boolean | null
  has_apartment: boolean | null
  has_villa: boolean | null
}

interface OwnershipHistoryItem {
  history_id: number
  unit_id: string
  start_date: string | null
  end_date: string | null
  source_order_id: string | null
}

interface Order {
  order_id: string
  source_regis: string | null
  unit_id: string | null
  location_id: string | null
  procedure_name: string | null
  procedure_value: string | null
  transaction_date: string | null
}

interface Owner360Response {
  owner: Owner
  contacts: Contact[]
  portfolio: Portfolio
  units: OwnerUnit[]
  ownership_history: OwnershipHistoryItem[]
  orders: Order[]
  source: {
    source_community: string | null
    source_file: string | null
  }
  audit: {
    created_at: string
    updated_at: string
  }
}

function formatDate(value: string | null) {
  if (!value) {
    return 'Date unavailable'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Date unavailable'
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

function displayValue(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === '') {
    return 'Not available'
  }

  return String(value)
}

function booleanLabel(value: boolean | null) {
  if (value === true) return 'Yes'
  if (value === false) return 'No'
  return 'Not available'
}

function BooleanBadge({
  value,
  label,
}: {
  value: boolean | null
  label: string
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-[var(--background)] px-3 py-2.5">
      <span className="text-xs text-[var(--muted)]">
        {label}
      </span>

      <span
        className={
          value === true
            ? 'text-xs font-medium text-[var(--primary)]'
            : 'text-xs font-medium text-[var(--muted)]'
        }
      >
        {booleanLabel(value)}
      </span>
    </div>
  )
}

export function OwnerProfile() {
  const navigate = useNavigate()
  const { ownerId } = useParams()

  const decodedOwnerId = ownerId
    ? decodeURIComponent(ownerId)
    : ''

  const [data, setData] =
    useState<Owner360Response | null>(null)

  const [loading, setLoading] =
    useState(true)

  const [copied, setCopied] =
    useState(false)

  useEffect(() => {
    if (!decodedOwnerId) return

    setLoading(true)
    setData(null)

    apiFetch<Owner360Response>(
      `/api/owners/${encodeURIComponent(decodedOwnerId)}/360`,
    )
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [decodedOwnerId])

  const copyOwnerId = async () => {
    if (!data) return

    await navigator.clipboard.writeText(
      data.owner.owner_id,
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

        <div className="h-72 animate-pulse rounded-3xl bg-[var(--surface)]" />
      </div>
    )
  }

  if (!data) {
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
          This owner could not be found in the registry.
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

  const { owner, contacts, portfolio, units, ownership_history, orders, source, audit } =
    data

  const locationCount = new Set(
    units
      .map((unit) => unit.location_id)
      .filter(Boolean),
  ).size

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

      {/* Hero */}
      <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] sm:rounded-3xl">
        <div className="p-5 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)] sm:h-16 sm:w-16">
              <CircleUserRound size={28} />
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

                <span
                  className={
                    owner.is_active
                      ? 'rounded-full bg-[var(--primary-soft)] px-2.5 py-1 text-[11px] font-medium text-[var(--primary)]'
                      : 'rounded-full bg-[var(--background)] px-2.5 py-1 text-[11px] font-medium text-[var(--muted)]'
                  }
                >
                  {owner.is_active ? 'Active' : 'Inactive'}
                </span>
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

              <div className="mt-2 text-xs text-[var(--muted)]">
                {owner.vip_tier || 'Standard'} portfolio profile
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:grid-cols-4">
            <div className="rounded-2xl bg-[var(--background)] p-4">
              <div className="text-xl font-semibold sm:text-2xl">
                {portfolio.calculated_property_count.toLocaleString()}
              </div>

              <div className="mt-1 text-xs text-[var(--muted)]">
                Properties
              </div>
            </div>

            <div className="rounded-2xl bg-[var(--background)] p-4">
              <div className="text-xl font-semibold sm:text-2xl">
                {portfolio.communities.length.toLocaleString()}
              </div>

              <div className="mt-1 text-xs text-[var(--muted)]">
                Communities
              </div>
            </div>

            <div className="rounded-2xl bg-[var(--background)] p-4">
              <div className="text-xl font-semibold sm:text-2xl">
                {locationCount.toLocaleString()}
              </div>

              <div className="mt-1 text-xs text-[var(--muted)]">
                Locations
              </div>
            </div>

            <div className="rounded-2xl bg-[var(--background)] p-4">
              <div className="text-xl font-semibold sm:text-2xl">
                {ownership_history.length.toLocaleString()}
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
            Registry identity and available identifiers.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            ['First name', owner.first_name],
            ['Last name', owner.last_name],
            ['Title', owner.title],
            ['Owner type', owner.owner_type],
            ['Country', owner.country],
            ['Gender', owner.gender],
            ['ID number', owner.id_number],
            ['UAE ID', owner.uae_id_number],
            ['Unified number', owner.unified_number],
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

      {/* Contact */}
      <section>
        <div className="mb-3 px-1">
          <h2 className="text-sm font-semibold">
            Contact Information
          </h2>

          <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
            Contact details associated with this owner.
          </p>
        </div>

        {contacts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--border)] p-8 text-center text-sm text-[var(--muted)] sm:rounded-3xl">
            No contact information available.
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {contacts.map((contact) => {
              const isPhone =
                contact.type.toLowerCase().includes('mobile') ||
                contact.type.toLowerCase().includes('landline')

              const isEmail =
                contact.type.toLowerCase().includes('email')

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

      {/* Portfolio */}
      <section>
        <div className="mb-3 px-1">
          <h2 className="text-sm font-semibold">
            Portfolio
          </h2>

          <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
            Portfolio intelligence derived from the registry.
          </p>
        </div>

        <div className="grid gap-3 lg:grid-cols-3">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <div className="flex items-center gap-2">
              <Building2
                size={17}
                className="text-[var(--primary)]"
              />

              <span className="text-sm font-semibold">
                Portfolio summary
              </span>
            </div>

            <div className="mt-5 space-y-2">
              <div className="flex justify-between gap-4 text-sm">
                <span className="text-[var(--muted)]">
                  Source property count
                </span>

                <span className="font-medium">
                  {displayValue(portfolio.source_property_count)}
                </span>
              </div>

              <div className="flex justify-between gap-4 text-sm">
                <span className="text-[var(--muted)]">
                  Calculated properties
                </span>

                <span className="font-medium">
                  {portfolio.calculated_property_count}
                </span>
              </div>

              <div className="flex justify-between gap-4 text-sm">
                <span className="text-[var(--muted)]">
                  Communities owned
                </span>

                <span className="font-medium">
                  {displayValue(portfolio.communities_owned)}
                </span>
              </div>

              <div className="flex justify-between gap-4 text-sm">
                <span className="text-[var(--muted)]">
                  Portfolio tier
                </span>

                <span className="font-medium">
                  {displayValue(portfolio.portfolio_tier)}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <div className="text-sm font-semibold">
              Communities
            </div>

            {portfolio.communities.length === 0 ? (
              <div className="mt-4 text-sm text-[var(--muted)]">
                No communities available.
              </div>
            ) : (
              <div className="mt-4 flex flex-wrap gap-2">
                {portfolio.communities.map((community) => (
                  <span
                    key={community}
                    className="rounded-full border border-[var(--border)] px-3 py-1.5 text-xs"
                  >
                    {community}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <div className="text-sm font-semibold">
              Buildings
            </div>

            {portfolio.buildings.length === 0 ? (
              <div className="mt-4 text-sm text-[var(--muted)]">
                No buildings available.
              </div>
            ) : (
              <div className="mt-4 flex flex-wrap gap-2">
                {portfolio.buildings.map((building) => (
                  <span
                    key={building}
                    className="rounded-full border border-[var(--border)] px-3 py-1.5 text-xs"
                  >
                    {building}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          <BooleanBadge
            value={portfolio.is_multi_property}
            label="Multi-property"
          />

          <BooleanBadge
            value={portfolio.is_portfolio_investor}
            label="Portfolio investor"
          />

          <BooleanBadge
            value={portfolio.has_cross_community}
            label="Cross-community"
          />

          <BooleanBadge
            value={portfolio.has_plot}
            label="Has plot"
          />

          <BooleanBadge
            value={portfolio.has_apartment}
            label="Has apartment"
          />

          <BooleanBadge
            value={portfolio.has_villa}
            label="Has villa"
          />
        </div>
      </section>

      {/* Properties */}
      <section>
        <div className="mb-3 flex flex-col gap-1 px-1 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
          <div>
            <h2 className="text-sm font-semibold">
              Properties / Units
            </h2>

            <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
              Physical units linked to this owner.
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
                    {unit.unit_code || unit.unit_id}
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[var(--muted)]">
                    <span>
                      Unit {unit.unit_number || '—'}
                    </span>

                    <span>·</span>

                    <span>
                      {unit.property_type || 'Property'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-[11px] leading-4 text-[var(--muted)]">
                  <div className="flex items-start gap-1.5">
                    <MapPin
                      size={12}
                      className="mt-0.5 shrink-0"
                    />

                    <span className="break-all">
                      {unit.location_id || 'Location unavailable'}
                    </span>
                  </div>

                  {unit.size !== null && (
                    <div>
                      Size: {unit.size.toLocaleString()} 
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Ownership history */}
      <section>
        <div className="mb-3 px-1">
          <h2 className="text-sm font-semibold">
            Ownership History
          </h2>

          <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
            Historical ownership relationships recorded in the registry.
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:rounded-3xl sm:p-6">
          {ownership_history.length === 0 ? (
            <div className="py-8 text-center text-sm text-[var(--muted)]">
              No ownership history recorded.
            </div>
          ) : (
            <div className="space-y-0">
              {ownership_history.map((item, index) => (
                <div
                  key={item.history_id}
                  className="relative flex gap-3 pb-7 last:pb-0 sm:gap-4"
                >
                  {index < ownership_history.length - 1 && (
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
                          {item.start_date || item.end_date
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
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Orders */}
      <section>
        <div className="mb-3 px-1">
          <h2 className="text-sm font-semibold">
            Orders / Transactions
          </h2>

          <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
            Registry orders associated with this owner.
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--border)] p-8 text-center sm:rounded-3xl">
            <FileText
              size={24}
              className="mx-auto text-[var(--muted)]"
            />

            <div className="mt-3 text-sm font-medium">
              No orders recorded
            </div>

            <div className="mt-1 text-xs leading-5 text-[var(--muted)]">
              No reliable order records are currently linked to this owner.
            </div>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] sm:rounded-3xl">
            <div className="divide-y divide-[var(--border)]">
              {orders.map((order) => (
                <div
                  key={order.order_id}
                  className="p-4 sm:p-5"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="break-all font-mono text-xs font-medium">
                        {order.order_id}
                      </div>

                      <div className="mt-2 text-sm">
                        {order.procedure_name || 'Procedure unavailable'}
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-1.5 text-xs text-[var(--muted)]">
                      <Calendar size={13} />

                      {formatDate(order.transaction_date)}
                    </div>
                  </div>

                  <div className="mt-3 grid gap-2 text-xs text-[var(--muted)] sm:grid-cols-3">
                    <div>
                      Unit:{' '}
                      <span className="font-mono">
                        {order.unit_id || '—'}
                      </span>
                    </div>

                    <div>
                      Location:{' '}
                      <span className="font-mono">
                        {order.location_id || '—'}
                      </span>
                    </div>

                    <div>
                      Value: {order.procedure_value || '—'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Source / audit */}
      <section>
        <div className="mb-3 px-1">
          <h2 className="text-sm font-semibold">
            Source & Provenance
          </h2>

          <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
            Registry source and lifecycle information.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <div className="flex items-center gap-2">
              <FileText
                size={17}
                className="text-[var(--primary)]"
              />

              <span className="text-sm font-semibold">
                Source
              </span>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                  Community
                </div>

                <div className="mt-1 break-words text-sm">
                  {displayValue(source.source_community)}
                </div>
              </div>

              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                  Source file
                </div>

                <div className="mt-1 break-all font-mono text-xs">
                  {displayValue(source.source_file)}
                </div>
              </div>

              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                  Record ID
                </div>

                <div className="mt-1 break-all font-mono text-xs">
                  {displayValue(owner.record_id)}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <div className="flex items-center gap-2">
              <ShieldCheck
                size={17}
                className="text-[var(--primary)]"
              />

              <span className="text-sm font-semibold">
                Registry status
              </span>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs text-[var(--muted)]">
                  Active
                </span>

                <span className="flex items-center gap-1.5 text-xs font-medium">
                  <CheckCircle2
                    size={14}
                    className={
                      owner.is_active
                        ? 'text-[var(--primary)]'
                        : 'text-[var(--muted)]'
                    }
                  />

                  {owner.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                  Created
                </div>

                <div className="mt-1 text-sm">
                  {formatDate(audit.created_at)}
                </div>
              </div>

              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                  Last updated
                </div>

                <div className="mt-1 text-sm">
                  {formatDate(audit.updated_at)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Notes */}
      {owner.notes && (
        <section>
          <div className="mb-3 px-1">
            <h2 className="text-sm font-semibold">
              Notes
            </h2>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 text-sm leading-6 sm:rounded-3xl">
            {owner.notes}
          </div>
        </section>
      )}
    </div>
  )
}
