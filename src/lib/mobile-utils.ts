/**
 * Mobile Optimization Utilities
 * Guidelines for responsive and mobile-first design
 */

export const MOBILE_BREAKPOINTS = {
  xs: '320px',   // Small phones
  sm: '640px',   // Large phones
  md: '768px',   // Tablets
  lg: '1024px',  // Small desktops
  xl: '1280px',  // Desktops
  '2xl': '1536px', // Large desktops
} as const

export const TOUCH_TARGET_MIN = 44 // pixels (Apple HIG recommendation)

export const MOBILE_OPTIMIZATIONS = {
  // Spacing adjustments for small screens
  paddingMobile: 'px-4',      // 1rem
  paddingTablet: 'sm:px-6',   // 1.5rem
  paddingDesktop: 'md:px-8',  // 2rem

  // Font sizes for readability
  baseText: 'text-base',      // 16px for body
  smallText: 'text-sm',       // 14px for secondary
  largeText: 'text-lg',       // 18px for emphasis

  // Input/Button sizing for touch
  inputHeight: 'h-12 sm:h-11', // 48px on mobile, 44px on larger
  buttonHeight: 'h-12 sm:h-11', // Same as input for consistency

  // Safe viewport areas (accounting for notches, etc)
  safeArea: 'safe-area-inset',

  // Touch feedback
  activeFeedback: 'active:scale-95 active:opacity-80',
  tapHighlight: 'tap-highlight-color-transparent',
}

/**
 * Check if device supports touch
 */
export function isTouchDevice(): boolean {
  return (
    typeof window !== 'undefined' &&
    (('ontouchstart' in window) ||
      (navigator.maxTouchPoints > 0) ||
      ((navigator as any).msMaxTouchPoints > 0))
  )
}

/**
 * Get viewport width
 */
export function getViewportWidth(): number {
  return typeof window !== 'undefined' ? window.innerWidth : 0
}

/**
 * Check if viewport is mobile
 */
export function isMobileViewport(): boolean {
  const width = getViewportWidth()
  return width < 768 // Tailwind md breakpoint
}

/**
 * Get viewport height
 */
export function getViewportHeight(): number {
  return typeof window !== 'undefined' ? window.innerHeight : 0
}

/**
 * Debounce function for resize/scroll events
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Prevent scroll on mobile modals
 */
export function lockScroll(): void {
  if (typeof window !== 'undefined') {
    document.body.style.overflow = 'hidden'
    document.body.style.paddingRight = getScrollbarWidth() + 'px'
  }
}

/**
 * Re-enable scroll
 */
export function unlockScroll(): void {
  if (typeof window !== 'undefined') {
    document.body.style.overflow = ''
    document.body.style.paddingRight = ''
  }
}

/**
 * Get scrollbar width
 */
function getScrollbarWidth(): number {
  if (typeof window === 'undefined') return 0
  const outer = document.createElement('div')
  outer.style.visibility = 'hidden'
  outer.style.overflow = 'scroll'
  document.body.appendChild(outer)
  const inner = document.createElement('div')
  outer.appendChild(inner)
  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth
  outer.parentNode?.removeChild(outer)
  return scrollbarWidth
}

/**
 * Format phone number for display
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }
  return phone
}

/**
 * Handle orientation change
 */
export function onOrientationChange(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {}

  window.addEventListener('orientationchange', callback)
  window.addEventListener('resize', callback)

  return () => {
    window.removeEventListener('orientationchange', callback)
    window.removeEventListener('resize', callback)
  }
}

/**
 * Safe area insets for devices with notches
 */
export function getSafeAreaInsets() {
  if (typeof window === 'undefined') {
    return { top: 0, right: 0, bottom: 0, left: 0 }
  }

  const root = document.documentElement
  return {
    top: parseInt(getComputedStyle(root).getPropertyValue('--safe-area-inset-top')) || 0,
    right: parseInt(getComputedStyle(root).getPropertyValue('--safe-area-inset-right')) || 0,
    bottom: parseInt(getComputedStyle(root).getPropertyValue('--safe-area-inset-bottom')) || 0,
    left: parseInt(getComputedStyle(root).getPropertyValue('--safe-area-inset-left')) || 0,
  }
}
