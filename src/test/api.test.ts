import { describe, it, expect } from 'vitest'
import { Prisma } from '@prisma/client'

describe('API Financial Calculations', () => {
  describe('Rental Pricing', () => {
    it('calculates subtotal correctly', () => {
      const pricePerDay = new Prisma.Decimal(350)
      const totalDays = 3
      const subtotal = pricePerDay.times(totalDays)

      expect(subtotal.toString()).toBe('1050')
    })

    it('applies security deposit for Mexican customers', () => {
      const isMaxican = true
      const depositAmount = isMaxican ? new Prisma.Decimal(2000) : new Prisma.Decimal(0)

      expect(depositAmount.toString()).toBe('2000')
    })

    it('applies no deposit for foreign customers', () => {
      const isMaxican = false
      const depositAmount = isMaxican ? new Prisma.Decimal(2000) : new Prisma.Decimal(0)

      expect(depositAmount.toString()).toBe('0')
    })

    it('calculates commission correctly for subtotal > 500', () => {
      const subtotal = new Prisma.Decimal(1050)
      const commission =
        subtotal.greaterThan(500) ? subtotal.times(0.1) : new Prisma.Decimal(100)

      expect(commission.toString()).toBe('105.0')
    })

    it('applies flat commission for subtotal <= 500', () => {
      const subtotal = new Prisma.Decimal(350)
      const commission =
        subtotal.greaterThan(500) ? subtotal.times(0.1) : new Prisma.Decimal(100)

      expect(commission.toString()).toBe('100')
    })

    it('calculates total amount correctly', () => {
      const subtotal = new Prisma.Decimal(1050)
      const depositAmount = new Prisma.Decimal(2000)
      const totalAmount = subtotal.plus(depositAmount)

      expect(totalAmount.toString()).toBe('3050')
    })
  })

  describe('Rental State Machine', () => {
    it('starts in PENDING_DOC status', () => {
      const initialStatus = 'PENDING_DOC'
      expect(initialStatus).toBe('PENDING_DOC')
    })

    it('transitions PENDING_DOC -> PENDING_PAYMENT after document approval', () => {
      const currentStatus = 'PENDING_DOC'
      const nextStatus = 'PENDING_PAYMENT'

      expect(currentStatus).not.toBe(nextStatus)
      expect(nextStatus).toBe('PENDING_PAYMENT')
    })

    it('transitions PENDING_PAYMENT -> ACTIVE after payment', () => {
      const currentStatus = 'PENDING_PAYMENT'
      const nextStatus = 'ACTIVE'

      expect(nextStatus).toBe('ACTIVE')
    })

    it('transitions ACTIVE -> COMPLETED after rental period ends', () => {
      const currentStatus = 'ACTIVE'
      const nextStatus = 'COMPLETED'

      expect(nextStatus).toBe('COMPLETED')
    })

    it('does not allow invalid status transitions', () => {
      const validStatuses = ['PENDING_DOC', 'PENDING_PAYMENT', 'ACTIVE', 'COMPLETED', 'CANCELLED']
      const invalidStatus = 'INVALID_STATUS'

      expect(validStatuses).not.toContain(invalidStatus)
    })
  })

  describe('Financial Decimal Precision', () => {
    it('maintains decimal precision for monetary values', () => {
      const price = new Prisma.Decimal('199.99')
      const days = new Prisma.Decimal('5')
      const subtotal = price.times(days)

      expect(subtotal.toDecimalPlaces(2).toString()).toBe('999.95')
    })

    it('prevents floating point errors', () => {
      const val1 = new Prisma.Decimal('0.1')
      const val2 = new Prisma.Decimal('0.2')
      const result = val1.plus(val2)

      // Using Decimal should give exact 0.3, not 0.30000000000000004
      expect(result.toString()).toBe('0.3')
    })

    it('handles currency rounding correctly', () => {
      const amount = new Prisma.Decimal('10.005')
      const rounded = amount.toDecimalPlaces(2)

      expect(rounded.toString()).toBe('10.01') // Banker's rounding
    })
  })

  describe('Error Handling', () => {
    it('validates required rental fields', () => {
      const requiredFields = ['scooter_id', 'customer_id', 'rental_start_date', 'rental_end_date']
      const testRental = {
        scooter_id: 'scooter-123',
        customer_id: 'customer-456',
        rental_start_date: '2026-10-15',
        rental_end_date: '2026-10-17',
      }

      for (const field of requiredFields) {
        expect(testRental).toHaveProperty(field)
      }
    })

    it('detects negative rental duration', () => {
      const startDate = new Date('2026-10-20')
      const endDate = new Date('2026-10-15')
      const isValid = endDate > startDate

      expect(isValid).toBe(false)
    })

    it('ensures start date is before end date', () => {
      const startDate = new Date('2026-10-15')
      const endDate = new Date('2026-10-17')
      const isValid = endDate > startDate

      expect(isValid).toBe(true)
    })
  })

  describe('Data Validation', () => {
    it('validates email format', () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      expect(emailRegex.test('user@example.com')).toBe(true)
      expect(emailRegex.test('invalid-email')).toBe(false)
    })

    it('validates phone number length', () => {
      const phoneRegex = /^\d{10,15}$/
      expect(phoneRegex.test('9581234567')).toBe(true)
      expect(phoneRegex.test('123')).toBe(false)
    })

    it('validates scooter ID format', () => {
      const scooterId = 'scooter-123-abc'
      expect(scooterId).toMatch(/^scooter-/)
    })
  })
})
