import { test, expect } from '@playwright/test'

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should load landing page', async ({ page }) => {
    await expect(page).toHaveTitle(/PUNTA BIKERS/)
  })

  test('should have navigation links', async ({ page }) => {
    const signInButton = page.getByRole('button', { name: /sign in/i })
    const getStartedButton = page.getByRole('button', { name: /get started/i })

    await expect(signInButton).toBeVisible()
    await expect(getStartedButton).toBeVisible()
  })

  test('should navigate to signup on Get Started click', async ({ page }) => {
    const getStartedButton = page.getByRole('button', { name: /get started/i })
    await getStartedButton.click()

    await expect(page).toHaveURL(/\/auth\/signup/)
  })

  test('should display feature cards', async ({ page }) => {
    const featureCards = page.locator('text=/Instant Booking|Safe & Secure|24\/7 Support/')

    await expect(featureCards).toHaveCount(3)
  })

  test('should display pricing section', async ({ page }) => {
    const pricingSection = page.locator('text=Simple, Transparent Pricing')

    await expect(pricingSection).toBeVisible()
  })

  test('should have responsive design on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 812 })

    const heading = page.locator('h2:has-text("Explore Puerto Escondido")')
    await expect(heading).toBeVisible()

    // Logo should be shortened on mobile
    const logo = page.locator('h1')
    await expect(logo).toContainText('PUNTA')
  })

  test('should have readable text on all viewports', async ({ page }) => {
    const sizes = [
      { width: 375, height: 812, name: 'iPhone SE' },
      { width: 768, height: 1024, name: 'iPad' },
      { width: 1280, height: 720, name: 'Desktop' },
    ]

    for (const size of sizes) {
      await page.setViewportSize(size)

      // Body text should be readable (at least 12px)
      const bodyText = page.locator('p')
      const fontSize = await bodyText.first().evaluate((el: HTMLElement) => {
        return window.getComputedStyle(el).fontSize
      })

      const fontSizeValue = parseFloat(fontSize)
      expect(fontSizeValue).toBeGreaterThanOrEqual(12)
    }
  })

  test('should have proper touch targets on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })

    const buttons = page.locator('button')
    const buttonCount = await buttons.count()

    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i)
      const boundingBox = await button.boundingBox()

      if (boundingBox) {
        // Touch targets should be at least 44x44px
        expect(boundingBox.height).toBeGreaterThanOrEqual(44)
        expect(boundingBox.width).toBeGreaterThanOrEqual(44)
      }
    }
  })

  test('should have working CTA buttons', async ({ page }) => {
    const startJourneyButton = page.getByRole('button', { name: /start your journey/i })

    await expect(startJourneyButton).toBeVisible()
    await startJourneyButton.click()

    await expect(page).toHaveURL(/\/auth\/signup/)
  })

  test('should load all sections without horizontal scroll', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })

    const maxWidth = await page.evaluate(() => {
      return Math.max(
        document.body.scrollWidth,
        document.documentElement.scrollWidth,
        document.body.clientWidth,
        document.documentElement.clientWidth
      )
    })

    const viewportWidth = 375
    expect(maxWidth).toBeLessThanOrEqual(viewportWidth)
  })

  test('should have accessible heading hierarchy', async ({ page }) => {
    const h1Count = await page.locator('h1').count()
    const h2Count = await page.locator('h2').count()

    expect(h1Count).toBeGreaterThan(0)
    expect(h2Count).toBeGreaterThan(0)
  })

  test('should have visible footer content', async ({ page }) => {
    await page.goto('/')

    const footer = page.locator('footer')
    await expect(footer).toBeVisible()

    const footerText = await footer.textContent()
    expect(footerText).toContain('2026 PUNTA BIKERS')
  })

  test('should handle rapid clicks without issues', async ({ page }) => {
    const button = page.getByRole('button', { name: /sign in/i })

    // Rapid clicks should not cause errors
    await button.click()
    await button.click()
    await button.click()

    // Page should still be responsive
    await expect(page).toBeVisible()
  })
})

test.describe('Landing Page Performance', () => {
  test('should load within acceptable time', async ({ page }) => {
    const startTime = Date.now()

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const loadTime = Date.now() - startTime

    // Page should load within 3 seconds
    expect(loadTime).toBeLessThan(3000)
  })

  test('should have no console errors', async ({ page }) => {
    const errors: string[] = []

    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    expect(errors).toHaveLength(0)
  })
})
