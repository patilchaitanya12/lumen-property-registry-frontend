import {
  ArrowRight,
  Building2,
  Plus,
  Search,
  UserRound,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { apiFetch, apiRequest } from '../lib/api'

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

interface CreateOwnerForm {
  name: string
  first_name: string
  last_name: string
  title: string
  owner_type: string
  vip_tier: string
  country: string
  gender: string
  uae_id_number: string
  unified_number: string
  source_community: string
  source_file: string
  portfolio_tier: string
  notes: string
}

const initialForm: CreateOwnerForm = {
  name: '',
  first_name: '',
  last_name: '',
  title: '',
  owner_type: 'Individual',
  vip_tier: 'Standard',
  country: '',
  gender: '',
  uae_id_number: '',
  unified_number: '',
  source_community: '',
  source_file: '',
  portfolio_tier: '',
  notes: '',
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

  const [showCreate, setShowCreate] =
    useState(false)

  const [form, setForm] =
    useState<CreateOwnerForm>(initialForm)

  const [creating, setCreating] =
    useState(false)

  const [createError, setCreateError] =
    useState('')

  const [createSuccess, setCreateSuccess] =
    useState('')

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

  const updateField = (
    field: keyof CreateOwnerForm,
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const closeCreate = () => {
    if (creating) return

    setShowCreate(false)
    setForm(initialForm)
    setCreateError('')
  }

  const createOwner = async () => {
    if (!form.name.trim()) {
      setCreateError('Owner name is required.')
      return
    }

    setCreating(true)
    setCreateError('')
    setCreateSuccess('')

    try {
      const payload = {
        name: form.name.trim(),
        first_name:
          form.first_name.trim() || null,
        last_name:
          form.last_name.trim() || null,
        title:
          form.title.trim() || null,
        owner_type:
          form.owner_type.trim() || null,
        vip_tier:
          form.vip_tier.trim() || null,
        country:
          form.country.trim() || null,
        gender:
          form.gender.trim() || null,
        uae_id_number:
          form.uae_id_number.trim() || null,
        unified_number:
          form.unified_number.trim() || null,
        source_community:
          form.source_community.trim() || null,
        source_file:
          form.source_file.trim() || null,
        portfolio_tier:
          form.portfolio_tier.trim() || null,
        notes:
          form.notes.trim() || null,
      }

      const created = await apiRequest<{
        owner_id: string
      }>('/api/owners', {
        method: 'POST',
        body: payload,
      })

      setCreateSuccess(
        `Owner created: ${created.owner_id}`,
      )

      setForm(initialForm)

      window.setTimeout(() => {
        setShowCreate(false)
        setCreateSuccess('')
        setPage(1)

        if (query.trim()) {
          setQuery('')
        }
      }, 800)
    } catch (error) {
      setCreateError(
        error instanceof Error
          ? error.message
          : 'Unable to create owner.',
      )
    } finally {
      setCreating(false)
    }
  }

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

        <div className="flex items-center gap-3">
          <div className="hidden text-sm text-[var(--muted)] sm:block">
            {total.toLocaleString()} owners
          </div>

          <button
            type="button"
            onClick={() => {
              setShowCreate(true)
              setCreateError('')
              setCreateSuccess('')
            }}
            className="flex min-h-10 items-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
          >
            <Plus size={16} />
            Add owner
          </button>
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

                    <div className="mt-2 break-all font-mono text-[10px] leading-4 text-[var(--muted)] md:hidden">
                      {owner.owner_id}
                    </div>
                  </div>
                </div>

                <div className="hidden truncate font-mono text-[11px] text-[var(--muted)] md:block">
                  {owner.owner_id}
                </div>

                <div className="hidden md:block">
                  <span className="rounded-full border border-[var(--border)] px-2.5 py-1 text-[11px]">
                    {owner.owner_type ||
                      'Unknown'}
                  </span>
                </div>

                <ArrowRight
                  size={17}
                  className="absolute right-4 top-5 text-[var(--muted)] transition-transform group-hover:translate-x-1 sm:right-5 md:static md:translate-y-0"
                />

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

      {/* Create owner modal */}
      {showCreate && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeCreate()
            }
          }}
        >
          <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-3xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl sm:max-w-3xl sm:rounded-3xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface)] px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-lg font-semibold">
                  Add owner
                </h2>

                <p className="mt-1 text-xs text-[var(--muted)]">
                  Create a new owner in the registry.
                </p>
              </div>

              <button
                type="button"
                onClick={closeCreate}
                disabled={creating}
                className="rounded-xl p-2 text-[var(--muted)] transition hover:bg-[var(--background)] hover:text-[var(--foreground)] disabled:opacity-40"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-5 p-5 sm:p-6">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field
                  label="Owner name"
                  required
                  value={form.name}
                  onChange={(value) =>
                    updateField('name', value)
                  }
                />

                <Field
                  label="First name"
                  value={form.first_name}
                  onChange={(value) =>
                    updateField('first_name', value)
                  }
                />

                <Field
                  label="Last name"
                  value={form.last_name}
                  onChange={(value) =>
                    updateField('last_name', value)
                  }
                />

                <Field
                  label="Title"
                  value={form.title}
                  onChange={(value) =>
                    updateField('title', value)
                  }
                />

                <SelectField
                  label="Owner type"
                  value={form.owner_type}
                  options={[
                    'Individual',
                    'Company',
                    'Organization',
                  ]}
                  onChange={(value) =>
                    updateField('owner_type', value)
                  }
                />

                <SelectField
                  label="VIP tier"
                  value={form.vip_tier}
                  options={[
                    'Standard',
                    'Premium',
                    'VIP',
                  ]}
                  onChange={(value) =>
                    updateField('vip_tier', value)
                  }
                />

                <Field
                  label="Country"
                  value={form.country}
                  onChange={(value) =>
                    updateField('country', value)
                  }
                />

                <Field
                  label="Gender"
                  value={form.gender}
                  onChange={(value) =>
                    updateField('gender', value)
                  }
                />

                <Field
                  label="UAE ID"
                  value={form.uae_id_number}
                  onChange={(value) =>
                    updateField(
                      'uae_id_number',
                      value,
                    )
                  }
                />

                <Field
                  label="Unified number"
                  value={form.unified_number}
                  onChange={(value) =>
                    updateField(
                      'unified_number',
                      value,
                    )
                  }
                />

                <Field
                  label="Source community"
                  value={form.source_community}
                  onChange={(value) =>
                    updateField(
                      'source_community',
                      value,
                    )
                  }
                />

                <Field
                  label="Source file"
                  value={form.source_file}
                  onChange={(value) =>
                    updateField(
                      'source_file',
                      value,
                    )
                  }
                />

                <Field
                  label="Portfolio tier"
                  value={form.portfolio_tier}
                  onChange={(value) =>
                    updateField(
                      'portfolio_tier',
                      value,
                    )
                  }
              />
              </div>

              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                  Notes
                </label>

                <textarea
                  value={form.notes}
                  onChange={(event) =>
                    updateField(
                      'notes',
                      event.target.value,
                    )
                  }
                  rows={4}
                  className="mt-2 w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10"
                  placeholder="Optional notes..."
                />
              </div>

              {createError && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-600">
                  {createError}
                </div>
              )}

              {createSuccess && (
                <div className="rounded-xl border border-[var(--primary)]/20 bg-[var(--primary-soft)] px-4 py-3 text-sm text-[var(--primary)]">
                  {createSuccess}
                </div>
              )}

              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeCreate}
                  disabled={creating}
                  className="min-h-10 rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-medium transition hover:bg-[var(--background)] disabled:opacity-40"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={createOwner}
                  disabled={creating}
                  className="min-h-10 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {creating
                    ? 'Creating...'
                    : 'Create owner'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  required = false,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  required?: boolean
}) {
  return (
    <div>
      <label className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
        {label}
        {required && (
          <span className="ml-1 text-[var(--primary)]">
            *
          </span>
        )}
      </label>

      <input
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="mt-2 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 text-sm outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10"
      />
    </div>
  )
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: string[]
  onChange: (value: string) => void
}) {
  return (
    <div>
      <label className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="mt-2 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 text-sm outline-none transition focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}
