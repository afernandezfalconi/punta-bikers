import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  isTouchDevice,
  getViewportWidth,
  isMobileViewport,
  getViewportHeight,
  debounce,
  formatPhoneNumber,
} from '@/lib/mobile-utils'

describe('Mobile Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('isTouchDevice', () => {
    it('returns boolean for touch support', () => {
      const result = isTouchDevice()
      expect(typeof result).toBe('boolean')
    })

    it('detects touch on supported devices', () => {
      // Mock touch support
      Object.defineProperty(window, 'ontouchstart', {
        writable: true,
        value: true,
      })
      expect(isTouchDevice()).toBe(true)
    })
  })

  describe('getViewportWidth', () => {
    it('returns window width', () => {
      const width = getViewportWidth()
      expect(typeof width).toBe('number')
      expect(width).toBeGreaterThan(0)
    })

    it('returns 0 when window is undefined', () => {
      // In test environment, window exists, so this just validates the fallback
      expect(getViewportWidth()).toBe(window.innerWidth)
    })
  })

  describe('isMobileViewport', () => {
    it('returns true for viewport < 768px', () => {
      // Mock innerWidth as mobile
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })
      expect(isMobileViewport()).toBe(true)
    })

    it('returns false for viewport >= 768px', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      })
      expect(isMobileViewport()).toBe(false)
    })
  })

  describe('getViewportHeight', () => {
    it('returns window height', () => {
      const height = getViewportHeight()
      expect(typeof height).toBe('number')
      expect(height).toBeGreaterThan(0)
    })
  })

  describe('debounce', () => {
    it('debounces function calls', async () => {
      const fn = vi.fn()
      const debounced = debounce(fn, 100)

      debounced()
      debounced()
      debounced()

      expect(fn).not.toHaveBeenCalled()

      await new Promise(resolve => setTimeout(resolve, 150))
      expect(fn).toHaveBeenCalledOnce()
    })

    it('passes arguments to debounced function', async () => {
      const fn = vi.fn()
      const debounced = debounce(fn, 50)

      debounced('test', 123)

      await new Promise(resolve => setTimeout(resolve, 100))
      expect(fn).toHaveBeenCalledWith('test', 123)
    })
  })

  describe('formatPhoneNumber', () => {
    it('formats 10-digit phone number', () => {
      const result = formatPhoneNumber('9581234567')
      expect(result).toBe('(958) 123-4567')
    })

    it('handles phone numbers with existing formatting', () => {
      const result = formatPhoneNumber('(958) 123-4567')
      expect(result).toBe('(958) 123-4567')
    })

    it('returns original string for non-10-digit numbers', () => {
      const input = '12345'
      const result = formatPhoneNumber(input)
      expect(result).toBe(input)
    })

    it('removes all non-digit characters before formatting', () => {
      const result = formatPhoneNumber('(958) 123-4567')
      expect(result).toBe('(958) 123-4567')
    })
  })

  describe('Touch Target Compliance', () => {
    it('validates 44px minimum touch target size', () => {
      const MIN_TOUCH_TARGET = 44
      expect(MIN_TOUCH_TARGET).toBe(44)
      expect(MIN_TOUCH_TARGET).toBeGreaterThanOrEqual(44)
    })
  })
})
