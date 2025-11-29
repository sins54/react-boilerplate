import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDebounce } from './useDebounce'

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500))
    expect(result.current).toBe('initial')
  })

  it('does not update value before delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    )

    rerender({ value: 'updated', delay: 500 })
    
    // Advance time but not past the delay
    act(() => {
      vi.advanceTimersByTime(400)
    })

    expect(result.current).toBe('initial')
  })

  it('updates value after delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    )

    rerender({ value: 'updated', delay: 500 })
    
    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(result.current).toBe('updated')
  })

  it('uses default delay of 500ms', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value),
      { initialProps: { value: 'initial' } }
    )

    rerender({ value: 'updated' })
    
    act(() => {
      vi.advanceTimersByTime(499)
    })
    expect(result.current).toBe('initial')

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(result.current).toBe('updated')
  })

  it('resets timer on rapid changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    )

    // First change
    rerender({ value: 'change1', delay: 500 })
    act(() => {
      vi.advanceTimersByTime(300)
    })
    expect(result.current).toBe('initial')

    // Second change before timer completes - should reset
    rerender({ value: 'change2', delay: 500 })
    act(() => {
      vi.advanceTimersByTime(300)
    })
    expect(result.current).toBe('initial')

    // Complete the timer for second change
    act(() => {
      vi.advanceTimersByTime(200)
    })
    expect(result.current).toBe('change2')
  })

  it('handles numeric values', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 0, delay: 500 } }
    )

    rerender({ value: 42, delay: 500 })
    
    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(result.current).toBe(42)
  })

  it('handles object values', () => {
    const initialObj = { name: 'initial' }
    const updatedObj = { name: 'updated' }

    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: initialObj, delay: 500 } }
    )

    rerender({ value: updatedObj, delay: 500 })
    
    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(result.current).toEqual(updatedObj)
  })

  it('handles array values', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: [1, 2, 3], delay: 500 } }
    )

    rerender({ value: [4, 5, 6], delay: 500 })
    
    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(result.current).toEqual([4, 5, 6])
  })

  it('cleans up timer on unmount', () => {
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout')
    
    const { unmount, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    )

    rerender({ value: 'updated', delay: 500 })
    unmount()

    expect(clearTimeoutSpy).toHaveBeenCalled()
  })

  it('handles delay change', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 1000 } }
    )

    // Change value with new delay
    rerender({ value: 'updated', delay: 200 })
    
    act(() => {
      vi.advanceTimersByTime(200)
    })

    expect(result.current).toBe('updated')
  })
})
