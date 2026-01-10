import { useCallback, useEffect, useState } from 'react'
import { isAbortError } from '@/core/api/http'

export type Fetcher<T> = (signal: AbortSignal) => Promise<T>

export type AsyncState<T> =
  | { status: 'idle'; data: undefined; error: undefined }
  | { status: 'loading'; data: undefined; error: undefined }
  | { status: 'success'; data: T; error: undefined }
  | { status: 'error'; data: undefined; error: Error }

type Settled<T> = {
  fetcher: Fetcher<T>
  attempt: number
  state: Extract<AsyncState<T>, { status: 'success' | 'error' }>
}

const IDLE = { status: 'idle', data: undefined, error: undefined } as const
const LOADING = { status: 'loading', data: undefined, error: undefined } as const

function toError(error: unknown): Error {
  return error instanceof Error ? error : new Error('Algo deu errado. Tente novamente.')
}

/**
 * Runs `fetcher` whenever its identity changes (memoise it with `useCallback`)
 * and aborts the previous request, so stale responses never overwrite fresh ones.
 * Pass `null` to stay idle, e.g. while a search box is empty.
 *
 * Loading is derived (the settled result belongs to another fetcher/attempt)
 * instead of being set inside the effect, which avoids cascading renders.
 */
export function useAsync<T>(fetcher: Fetcher<T> | null): AsyncState<T> & { reload: () => void } {
  const [attempt, setAttempt] = useState(0)
  const [settled, setSettled] = useState<Settled<T> | null>(null)

  useEffect(() => {
    if (!fetcher) return
    const controller = new AbortController()

    fetcher(controller.signal).then(
      (data) => {
        if (controller.signal.aborted) return
        setSettled({
          fetcher,
          attempt,
          state: { status: 'success', data, error: undefined },
        })
      },
      (error: unknown) => {
        if (controller.signal.aborted || isAbortError(error)) return
        setSettled({
          fetcher,
          attempt,
          state: { status: 'error', data: undefined, error: toError(error) },
        })
      },
    )

    return () => controller.abort()
  }, [fetcher, attempt])

  const reload = useCallback(() => setAttempt((value) => value + 1), [])

  if (!fetcher) return { ...IDLE, reload }
  if (!settled || settled.fetcher !== fetcher || settled.attempt !== attempt) {
    return { ...LOADING, reload }
  }
  return { ...settled.state, reload }
}
