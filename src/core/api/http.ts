/** Kind of failure, so the UI can show a message in the active language. */
export type ApiErrorCode = 'network' | 'http' | 'parse'

export class ApiError extends Error {
  readonly code: ApiErrorCode
  readonly status: number | null

  constructor(code: ApiErrorCode, message: string, status: number | null = null) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.status = status
  }
}

export function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError'
}

/**
 * Thin wrapper around fetch that rejects with an {@link ApiError} for network,
 * HTTP and parsing failures, while letting abort errors pass through untouched.
 */
export async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  let response: Response
  try {
    response = await fetch(url, { signal, headers: { Accept: 'application/json' } })
  } catch (error) {
    if (isAbortError(error)) throw error
    throw new ApiError('network', `Network request to ${url} failed`)
  }

  if (!response.ok) {
    throw new ApiError('http', `Request to ${url} failed with ${response.status}`, response.status)
  }

  try {
    return (await response.json()) as T
  } catch {
    throw new ApiError('parse', `Invalid JSON returned by ${url}`, response.status)
  }
}
