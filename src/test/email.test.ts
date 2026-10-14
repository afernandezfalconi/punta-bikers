import { describe, it, expect } from 'vitest'
import {
  rentalConfirmationEmail,
  documentApprovedEmail,
  paymentSuccessEmail,
  documentRejectedEmail,
} from '@/lib/email'

describe('Email Templates', () => {
  describe('rentalConfirmationEmail', () => {
    it('generates rental confirmation HTML', () => {
      const html = rentalConfirmationEmail({
        customerName: 'Juan García',
        rentalId: 'test-123',
        scooterModel: 'Xiaomi Mi 3 Pro',
        startDate: '2026-10-15',
        endDate: '2026-10-17',
        totalAmount: '500.00',
        dashboardLink: 'http://localhost:3000/app/rentals/test-123',
      })

      expect(html).toContain('Juan García')
      expect(html).toContain('Xiaomi Mi 3 Pro')
      expect(html).toContain('500.00')
      expect(html).toContain('test-123')
      expect(html).toContain('http://localhost:3000/app/rentals/test-123')
      expect(html).toContain('<!DOCTYPE html>')
      expect(html).toContain('<html>')
    })

    it('contains essential email sections', () => {
      const html = rentalConfirmationEmail({
        customerName: 'Test User',
        rentalId: 'id-123',
        scooterModel: 'Model X',
        startDate: '2026-10-15',
        endDate: '2026-10-17',
        totalAmount: '100.00',
        dashboardLink: 'http://test.com',
      })

      expect(html).toContain('<head>')
      expect(html).toContain('<body>')
      expect(html).toContain('<style>')
      expect(html).toContain('Rental Period')
    })
  })

  describe('documentApprovedEmail', () => {
    it('generates document approval HTML', () => {
      const html = documentApprovedEmail({
        customerName: 'María López',
        rentalId: 'rental-456',
        documentType: 'INE',
        nextStepLink: 'http://localhost:3000/app/rentals/rental-456/payment',
      })

      expect(html).toContain('María López')
      expect(html).toContain('INE')
      expect(html).toContain('aprobado')
      expect(html).toContain('http://localhost:3000/app/rentals/rental-456/payment')
    })

    it('includes green/success styling', () => {
      const html = documentApprovedEmail({
        customerName: 'Test',
        rentalId: 'id',
        documentType: 'Passport',
        nextStepLink: 'http://test.com',
      })

      expect(html).toContain('10b981') // Green color in hex
    })
  })

  describe('documentRejectedEmail', () => {
    it('generates document rejection HTML', () => {
      const html = documentRejectedEmail({
        customerName: 'Carlos Ruiz',
        rentalId: 'rental-789',
        documentType: 'Passport',
        reason: 'Document is blurry',
        resubmitLink: 'http://localhost:3000/app/rentals/rental-789/documents',
      })

      expect(html).toContain('Carlos Ruiz')
      expect(html).toContain('Passport')
      expect(html).toContain('Document is blurry')
      expect(html).toContain('http://localhost:3000/app/rentals/rental-789/documents')
    })

    it('includes red/warning styling', () => {
      const html = documentRejectedEmail({
        customerName: 'Test',
        rentalId: 'id',
        documentType: 'INE',
        reason: 'Test reason',
        resubmitLink: 'http://test.com',
      })

      expect(html).toContain('ef4444') // Red color in hex
    })
  })

  describe('paymentSuccessEmail', () => {
    it('generates payment success HTML', () => {
      const html = paymentSuccessEmail({
        customerName: 'Ana Martínez',
        rentalId: 'rental-101',
        scooterModel: 'Segway Ninebot Max',
        startDate: '2026-10-15',
        pickupLink: 'http://localhost:3000/app/rentals/rental-101',
      })

      expect(html).toContain('Ana Martínez')
      expect(html).toContain('Segway Ninebot Max')
      expect(html).toContain('http://localhost:3000/app/rentals/rental-101')
      expect(html).toContain('ACTIVE')
    })

    it('contains payment confirmation details', () => {
      const html = paymentSuccessEmail({
        customerName: 'Test',
        rentalId: 'id',
        scooterModel: 'Scooter',
        startDate: '2026-10-15',
        pickupLink: 'http://test.com',
      })

      expect(html).toContain('Scooter:')
      expect(html).toContain('Referencia de Alquiler')
    })
  })

  describe('Email Template Security', () => {
    it('escapes HTML special characters in user input', () => {
      const html = rentalConfirmationEmail({
        customerName: '<script>alert("XSS")</script>',
        rentalId: 'id&param=value',
        scooterModel: 'Model<br>X',
        startDate: '2026-10-15',
        endDate: '2026-10-17',
        totalAmount: '100.00',
        dashboardLink: 'http://test.com',
      })

      // HTML should render the dangerous input as text, not execute it
      expect(html).toContain('<script>')
      expect(html).not.toContain('<script>alert(')
    })
  })

  describe('Email Template Localization', () => {
    it('uses Spanish language in templates', () => {
      const html = rentalConfirmationEmail({
        customerName: 'Usuario',
        rentalId: 'id',
        scooterModel: 'Scooter',
        startDate: '2026-10-15',
        endDate: '2026-10-17',
        totalAmount: '100',
        dashboardLink: 'http://test.com',
      })

      expect(html).toContain('Hola')
      expect(html).toContain('MXN') // Mexican Peso currency
    })
  })
})
