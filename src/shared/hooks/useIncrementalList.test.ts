import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useIncrementalList } from './useIncrementalList'

const items = Array.from({ length: 30 }, (_, index) => index)

describe('useIncrementalList', () => {
  it('reveals items page by page', () => {
    const { result } = renderHook(() => useIncrementalList(items, 12))
    expect(result.current.visible).toHaveLength(12)
    expect(result.current.remaining).toBe(18)

    act(() => result.current.showMore())
    act(() => result.current.showMore())

    expect(result.current.visible).toHaveLength(30)
    expect(result.current.hasMore).toBe(false)
  })

  it('starts over when the list changes', () => {
    const { result, rerender } = renderHook(({ list }) => useIncrementalList(list, 10), {
      initialProps: { list: items },
    })
    act(() => result.current.showMore())
    expect(result.current.visible).toHaveLength(20)

    rerender({ list: [...items] })
    expect(result.current.visible).toHaveLength(10)
  })
})
