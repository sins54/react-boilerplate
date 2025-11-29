import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from './useLocalStorage'

describe('useLocalStorage', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    vi.clearAllMocks()
  })

  afterEach(() => {
    localStorage.clear()
  })

  describe('Initial Value', () => {
    it('returns initial value when localStorage is empty', () => {
      const { result } = renderHook(() =>
        useLocalStorage('test-key', 'initial')
      )
      expect(result.current[0]).toBe('initial')
    })

    it('returns stored value when localStorage has data', () => {
      localStorage.setItem('test-key', JSON.stringify('stored-value'))
      const { result } = renderHook(() =>
        useLocalStorage('test-key', 'initial')
      )
      expect(result.current[0]).toBe('stored-value')
    })

    it('handles complex objects', () => {
      const initialValue = { name: 'test', count: 0 }
      const { result } = renderHook(() =>
        useLocalStorage('test-key', initialValue)
      )
      expect(result.current[0]).toEqual(initialValue)
    })

    it('handles arrays', () => {
      const initialValue = [1, 2, 3]
      const { result } = renderHook(() =>
        useLocalStorage('test-key', initialValue)
      )
      expect(result.current[0]).toEqual(initialValue)
    })
  })

  describe('setValue', () => {
    it('updates state and localStorage with direct value', () => {
      const { result } = renderHook(() =>
        useLocalStorage('test-key', 'initial')
      )

      act(() => {
        result.current[1]('updated')
      })

      expect(result.current[0]).toBe('updated')
      expect(JSON.parse(localStorage.getItem('test-key') || '')).toBe('updated')
    })

    it('updates state with function updater', () => {
      const { result } = renderHook(() => useLocalStorage('counter', 0))

      act(() => {
        result.current[1]((prev) => prev + 1)
      })

      expect(result.current[0]).toBe(1)
      expect(JSON.parse(localStorage.getItem('counter') || '')).toBe(1)
    })

    it('handles complex object updates', () => {
      interface TestObject {
        name: string
        count: number
      }
      const { result } = renderHook(() =>
        useLocalStorage<TestObject>('test-key', { name: 'test', count: 0 })
      )

      act(() => {
        result.current[1]((prev) => ({ ...prev, count: prev.count + 1 }))
      })

      expect(result.current[0]).toEqual({ name: 'test', count: 1 })
    })
  })

  describe('removeValue', () => {
    it('removes value from localStorage and resets to initial', () => {
      localStorage.setItem('test-key', JSON.stringify('stored'))
      const { result } = renderHook(() =>
        useLocalStorage('test-key', 'initial')
      )

      expect(result.current[0]).toBe('stored')

      act(() => {
        result.current[2]()
      })

      expect(result.current[0]).toBe('initial')
      expect(localStorage.getItem('test-key')).toBeNull()
    })
  })

  describe('Storage Event Handling', () => {
    it('syncs across storage events with new value', () => {
      const { result } = renderHook(() =>
        useLocalStorage('test-key', 'initial')
      )

      act(() => {
        // Simulate storage event from another tab
        window.dispatchEvent(
          new StorageEvent('storage', {
            key: 'test-key',
            newValue: JSON.stringify('from-other-tab'),
          })
        )
      })

      expect(result.current[0]).toBe('from-other-tab')
    })

    it('resets to initial value when storage event has null value', () => {
      localStorage.setItem('test-key', JSON.stringify('stored'))
      const { result } = renderHook(() =>
        useLocalStorage('test-key', 'initial')
      )

      expect(result.current[0]).toBe('stored')

      act(() => {
        // Simulate key removal from another tab
        window.dispatchEvent(
          new StorageEvent('storage', {
            key: 'test-key',
            newValue: null,
          })
        )
      })

      expect(result.current[0]).toBe('initial')
    })

    it('ignores storage events for different keys', () => {
      const { result } = renderHook(() =>
        useLocalStorage('test-key', 'initial')
      )

      act(() => {
        window.dispatchEvent(
          new StorageEvent('storage', {
            key: 'other-key',
            newValue: JSON.stringify('other-value'),
          })
        )
      })

      expect(result.current[0]).toBe('initial')
    })
  })

  describe('Error Handling', () => {
    it('handles JSON parse errors gracefully', () => {
      localStorage.setItem('test-key', 'invalid-json')
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const { result } = renderHook(() =>
        useLocalStorage('test-key', 'fallback')
      )

      expect(result.current[0]).toBe('fallback')
      expect(consoleSpy).toHaveBeenCalled()

      consoleSpy.mockRestore()
    })

    it('handles localStorage errors on set', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceeded')
      })

      const { result } = renderHook(() =>
        useLocalStorage('test-key', 'initial')
      )

      act(() => {
        result.current[1]('new-value')
      })

      expect(consoleSpy).toHaveBeenCalled()

      consoleSpy.mockRestore()
      setItemSpy.mockRestore()
    })
  })

  describe('Persistence', () => {
    it('persists value across hook re-renders', () => {
      const { result, rerender } = renderHook(() =>
        useLocalStorage('persist-key', 'initial')
      )

      act(() => {
        result.current[1]('persisted')
      })

      rerender()

      expect(result.current[0]).toBe('persisted')
    })

    it('maintains value when component unmounts and remounts', () => {
      const { result, unmount } = renderHook(() =>
        useLocalStorage('persist-key', 'initial')
      )

      act(() => {
        result.current[1]('persisted')
      })

      unmount()

      // Remount
      const { result: newResult } = renderHook(() =>
        useLocalStorage('persist-key', 'initial')
      )

      expect(newResult.current[0]).toBe('persisted')
    })
  })

  describe('Type Safety', () => {
    it('works with boolean values', () => {
      const { result } = renderHook(() => useLocalStorage('bool-key', false))

      act(() => {
        result.current[1](true)
      })

      expect(result.current[0]).toBe(true)
    })

    it('works with nullable values', () => {
      const { result } = renderHook(() =>
        useLocalStorage<string | null>('nullable-key', null)
      )

      act(() => {
        result.current[1]('not null')
      })

      expect(result.current[0]).toBe('not null')
    })
  })
})
