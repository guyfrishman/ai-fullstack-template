// Base URL for the API. Defaults to the local API; override with
// VITE_API_BASE_URL. Set it to an empty string to use relative paths
// (handy with the Vite dev proxy, which forwards /api to the API).
const apiBaseUrl: string = import.meta.env.VITE_API_BASE_URL?.trim() ?? 'http://localhost:8000'

export function buildApiUrl(path: string): string {
  if (apiBaseUrl && /^https?:\/\//.test(apiBaseUrl)) {
    return new URL(path, apiBaseUrl).toString()
  }
  return path
}

function buildHeaders(extra?: Record<string, string>): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...extra,
  }
  // Only needed if the API has API_ACCESS_KEY set (it is open by default).
  const apiKey = import.meta.env.VITE_API_KEY?.trim()
  if (apiKey) {
    headers['X-API-Key'] = apiKey
  }
  return headers
}

async function parseError(response: Response): Promise<string> {
  try {
    const data = await response.json()
    if (typeof data?.detail === 'string') return data.detail
    if (Array.isArray(data?.detail)) {
      return data.detail
        .map((item: { loc?: Array<string | number>; msg?: string }) => {
          const location = Array.isArray(item?.loc) ? item.loc.join('.') : 'request'
          return `${location}: ${item?.msg || 'Validation error'}`
        })
        .join(', ')
    }
    if (typeof data?.message === 'string') return data.message
  } catch {
    const text = await response.text().catch(() => '')
    if (text) return text
  }
  return `Request failed with status ${response.status}`
}

export async function postJson<TResponse>(path: string, body?: unknown): Promise<TResponse> {
  const response = await fetch(buildApiUrl(path), {
    method: 'POST',
    headers: buildHeaders(),
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  if (!response.ok) throw new Error(await parseError(response))
  return response.json() as Promise<TResponse>
}

export async function getJson<TResponse>(path: string): Promise<TResponse> {
  const response = await fetch(buildApiUrl(path), {
    method: 'GET',
    headers: buildHeaders(),
  })
  if (!response.ok) throw new Error(await parseError(response))
  return response.json() as Promise<TResponse>
}
