const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'http://127.0.0.1:8000'

export async function apiFetch<T>(
  endpoint: string,
): Promise<T> {
  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
  )

  if (!response.ok) {
    const message = await response.text()

    throw new Error(
      message || `API error: ${response.status}`,
    )
  }

  return response.json()
}

interface ApiRequestOptions {
  method?: 'POST' | 'PATCH' | 'DELETE'
  body?: unknown
}

export async function apiRequest<T>(
  endpoint: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      method: options.method || 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body:
        options.body !== undefined
          ? JSON.stringify(options.body)
          : undefined,
    },
  )

  if (!response.ok) {
    const message = await response.text()

    throw new Error(
      message || `API error: ${response.status}`,
    )
  }

  return response.json()
}
