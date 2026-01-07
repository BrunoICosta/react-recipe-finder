export class ApiError extends Error {
  readonly status: number | null

  constructor(message: string, status: number | null = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError'
}

/**
 * Thin wrapper around fetch that rejects with a user friendly {@link ApiError}
 * for network and HTTP failures, while letting abort errors pass through untouched.
 */
export async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  let response: Response
  try {
    response = await fetch(url, { signal, headers: { Accept: 'application/json' } })
  } catch (error) {
    if (isAbortError(error)) throw error
    throw new ApiError('Não foi possível conectar ao servidor. Verifique sua conexão.')
  }

  if (!response.ok) {
    throw new ApiError(`O servidor respondeu com erro (${response.status}).`, response.status)
  }

  try {
    return (await response.json()) as T
  } catch {
    throw new ApiError('Resposta inválida do servidor.', response.status)
  }
}
