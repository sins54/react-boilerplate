import { describe, it, expect, vi, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useRef, type RefObject } from 'react'
import { useOnClickOutside } from './useOnClickOutside'

// Helper to create a mock ref with an element
function createMockRef<T extends HTMLElement>(element: T | null): RefObject<T | null> {
  return { current: element }
}

describe('useOnClickOutside', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  describe('Single Element', () => {
    it('calls handler when clicking outside the element', () => {
      const handler = vi.fn()
      const element = document.createElement('div')
      document.body.appendChild(element)
      
      const ref = createMockRef(element)

      renderHook(() => useOnClickOutside(ref, handler))

      // Click outside the element (on body)
      const outsideEvent = new MouseEvent('mousedown', { bubbles: true })
      document.body.dispatchEvent(outsideEvent)

      expect(handler).toHaveBeenCalledTimes(1)
    })

    it('does not call handler when clicking inside the element', () => {
      const handler = vi.fn()
      const element = document.createElement('div')
      document.body.appendChild(element)
      
      const ref = createMockRef(element)

      renderHook(() => useOnClickOutside(ref, handler))

      // Click inside the element
      const insideEvent = new MouseEvent('mousedown', { bubbles: true })
      element.dispatchEvent(insideEvent)

      expect(handler).not.toHaveBeenCalled()
    })

    it('does not call handler when clicking on a child element', () => {
      const handler = vi.fn()
      const element = document.createElement('div')
      const childElement = document.createElement('button')
      element.appendChild(childElement)
      document.body.appendChild(element)
      
      const ref = createMockRef(element)

      renderHook(() => useOnClickOutside(ref, handler))

      // Click on child element
      const childEvent = new MouseEvent('mousedown', { bubbles: true })
      childElement.dispatchEvent(childEvent)

      expect(handler).not.toHaveBeenCalled()
    })
  })

  describe('Multiple Elements', () => {
    it('does not call handler when clicking inside any of the elements', () => {
      const handler = vi.fn()
      const element1 = document.createElement('div')
      const element2 = document.createElement('div')
      document.body.appendChild(element1)
      document.body.appendChild(element2)
      
      const ref1 = createMockRef(element1)
      const ref2 = createMockRef(element2)

      renderHook(() => useOnClickOutside([ref1, ref2], handler))

      // Click inside first element
      const event1 = new MouseEvent('mousedown', { bubbles: true })
      element1.dispatchEvent(event1)
      expect(handler).not.toHaveBeenCalled()

      // Click inside second element
      const event2 = new MouseEvent('mousedown', { bubbles: true })
      element2.dispatchEvent(event2)
      expect(handler).not.toHaveBeenCalled()
    })

    it('calls handler when clicking outside all elements', () => {
      const handler = vi.fn()
      const element1 = document.createElement('div')
      const element2 = document.createElement('div')
      document.body.appendChild(element1)
      document.body.appendChild(element2)
      
      const ref1 = createMockRef(element1)
      const ref2 = createMockRef(element2)

      renderHook(() => useOnClickOutside([ref1, ref2], handler))

      // Click outside both elements (on body directly)
      const outsideEvent = new MouseEvent('mousedown', { bubbles: true })
      document.body.dispatchEvent(outsideEvent)

      expect(handler).toHaveBeenCalledTimes(1)
    })
  })

  describe('Enabled/Disabled', () => {
    it('does not attach listeners when disabled', () => {
      const handler = vi.fn()
      const element = document.createElement('div')
      document.body.appendChild(element)
      
      const ref = createMockRef(element)

      renderHook(() => useOnClickOutside(ref, handler, false))

      // Click outside
      const outsideEvent = new MouseEvent('mousedown', { bubbles: true })
      document.body.dispatchEvent(outsideEvent)

      expect(handler).not.toHaveBeenCalled()
    })

    it('enables listener when enabled changes to true', () => {
      const handler = vi.fn()
      const element = document.createElement('div')
      document.body.appendChild(element)
      
      const ref = createMockRef(element)

      const { rerender } = renderHook(
        ({ enabled }) => useOnClickOutside(ref, handler, enabled),
        { initialProps: { enabled: false } }
      )

      // Click outside - should not trigger
      document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
      expect(handler).not.toHaveBeenCalled()

      // Enable the hook
      rerender({ enabled: true })

      // Click outside - should trigger now
      document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
      expect(handler).toHaveBeenCalledTimes(1)
    })
  })

  describe('Touch Events', () => {
    it('calls handler on touchstart outside the element', () => {
      const handler = vi.fn()
      const element = document.createElement('div')
      document.body.appendChild(element)
      
      const ref = createMockRef(element)

      renderHook(() => useOnClickOutside(ref, handler))

      // Touch outside the element
      const touchEvent = new TouchEvent('touchstart', { bubbles: true })
      document.body.dispatchEvent(touchEvent)

      expect(handler).toHaveBeenCalledTimes(1)
    })

    it('does not call handler on touchstart inside the element', () => {
      const handler = vi.fn()
      const element = document.createElement('div')
      document.body.appendChild(element)
      
      const ref = createMockRef(element)

      renderHook(() => useOnClickOutside(ref, handler))

      // Touch inside the element
      const touchEvent = new TouchEvent('touchstart', { bubbles: true })
      element.dispatchEvent(touchEvent)

      expect(handler).not.toHaveBeenCalled()
    })
  })

  describe('Cleanup', () => {
    it('removes event listeners on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')
      const handler = vi.fn()
      const element = document.createElement('div')
      document.body.appendChild(element)
      
      const ref = createMockRef(element)

      const { unmount } = renderHook(() => useOnClickOutside(ref, handler))

      unmount()

      expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function))
      expect(removeEventListenerSpy).toHaveBeenCalledWith('touchstart', expect.any(Function))

      removeEventListenerSpy.mockRestore()
    })
  })

  describe('Edge Cases', () => {
    it('handles null ref gracefully', () => {
      const handler = vi.fn()
      const ref = createMockRef<HTMLDivElement>(null)

      renderHook(() => useOnClickOutside(ref, handler))

      // Click anywhere - should not crash
      const event = new MouseEvent('mousedown', { bubbles: true })
      document.body.dispatchEvent(event)

      // Handler should still be called (null ref means nothing to check against)
      expect(handler).toHaveBeenCalled()
    })

    it('passes event to handler', () => {
      const handler = vi.fn()
      const element = document.createElement('div')
      document.body.appendChild(element)
      
      const ref = createMockRef(element)

      renderHook(() => useOnClickOutside(ref, handler))

      const event = new MouseEvent('mousedown', { bubbles: true })
      document.body.dispatchEvent(event)

      expect(handler).toHaveBeenCalledWith(expect.any(MouseEvent))
    })
  })

  describe('Integration with React useRef', () => {
    it('works with React useRef', () => {
      const handler = vi.fn()
      const element = document.createElement('div')
      document.body.appendChild(element)

      const { result: refResult } = renderHook(() => useRef<HTMLDivElement>(null))
      // Manually set the ref's current value
      refResult.current.current = element as HTMLDivElement

      renderHook(() => useOnClickOutside(refResult.current, handler))

      // Click outside
      const event = new MouseEvent('mousedown', { bubbles: true })
      document.body.dispatchEvent(event)

      expect(handler).toHaveBeenCalledTimes(1)
    })
  })
})
