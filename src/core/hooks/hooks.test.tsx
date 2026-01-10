import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useAsync, type Fetcher } from './useAsync'
import { useDebounce } from './useDebounce'
import { useLocalStorage } from './useLocalStorage'

describe('useDebounce', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('only publishes the latest value after the delay', () => {
    vi.useFakeTimers()
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: 'a' },
    })

    rerender({ value: 'ab' })
    rerender({ value: 'abc' })
    act(() => vi.advanceTimersByTime(299))
    expect(result.current).toBe('a')

    act(() => vi.advanceTimersByTime(1))
    expect(result.current).toBe('abc')
  })
})

describe('useLocalStorage', () => {
  it('returns the initial value and persists updates as JSON', () => {
    const { result } = renderHook(() => useLocalStorage('items', ['a']))
    expect(result.current[0]).toEqual(['a'])

    act(() => result.current[1]((previous) => [...previous, 'b']))

    expect(result.current[0]).toEqual(['a', 'b'])
    expect(window.localStorage.getItem('items')).toBe('["a","b"]')
  })

  it('shares the value between hooks using the same key', () => {
    const first = renderHook(() => useLocalStorage('shared', 0))
    const second = renderHook(() => useLocalStorage('shared', 0))

    act(() => first.result.current[1](42))

    expect(second.result.current[0]).toBe(42)
  })

  it('falls back to the initial value when stored data is corrupted', () => {
    window.localStorage.setItem('broken', '{not json')
    const { result } = renderHook(() => useLocalStorage('broken', 'fallback'))
    expect(result.current[0]).toBe('fallback')
  })

  it('uses the parse option to reject invalid shapes', () => {
    window.localStorage.setItem('count', '"seven"')
    const parse = (value: unknown) => {
      if (typeof value !== 'number') throw new Error('invalid')
      return value
    }
    const { result } = renderHook(() => useLocalStorage('count', 0, { parse }))
    expect(result.current[0]).toBe(0)
  })

  it('removes the key', () => {
    const { result } = renderHook(() => useLocalStorage('temp', 'x'))
    act(() => result.current[1]('y'))
    act(() => result.current[2]())
    expect(window.localStorage.getItem('temp')).toBeNull()
    expect(result.current[0]).toBe('x')
  })
})

describe('useAsync', () => {
  it('stays idle without a fetcher', () => {
    const { result } = renderHook(() => useAsync(null))
    expect(result.current.status).toBe('idle')
  })

  it('goes from loading to success', async () => {
    const fetcher: Fetcher<string> = () => Promise.resolve('done')
    const { result } = renderHook(() => useAsync(fetcher))

    expect(result.current.status).toBe('loading')
    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(result.current.data).toBe('done')
  })

  it('exposes errors and retries on reload', async () => {
    const fetcher = vi
      .fn<Fetcher<number>>()
      .mockRejectedValueOnce(new Error('boom'))
      .mockResolvedValueOnce(1)
    const { result } = renderHook(() => useAsync(fetcher))

    await waitFor(() => expect(result.current.status).toBe('error'))
    expect(result.current.error?.message).toBe('boom')

    act(() => result.current.reload())
    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(fetcher).toHaveBeenCalledTimes(2)
  })

  it('aborts the previous request when the fetcher changes', async () => {
    const signals: AbortSignal[] = []
    const makeFetcher =
      (value: string): Fetcher<string> =>
      (signal) => {
        signals.push(signal)
        return new Promise((resolve) => setTimeout(() => resolve(value), 10))
      }

    const { result, rerender } = renderHook(({ fetcher }) => useAsync(fetcher), {
      initialProps: { fetcher: makeFetcher('first') },
    })
    rerender({ fetcher: makeFetcher('second') })

    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(signals[0].aborted).toBe(true)
    expect(result.current.data).toBe('second')
  })
})
