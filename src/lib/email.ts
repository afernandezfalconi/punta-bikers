import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface EmailPayload {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: EmailPayload) {
  try {
    const result = await resend.emails.send({
      from: 'PUNTA BIKERS <noreply@puntabikers.com>',
      to,
      subject,
      html,
    })
    return { success: true, data: result }
  } catch (error) {
    console.error('Email send failed:', error)
    return { success: false, error }
  }
}

// Email Templates

export function rentalConfirmationEmail(data: {
  customerName: string
  rentalId: string
  scooterModel: string
  startDate: string
  endDate: string
  totalAmount: string
  dashboardLink: string
}) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #3b82f6 0%, #f97316 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
          .detail-label { font-weight: 600; color: #666; }
          .detail-value { color: #333; }
          .cta-button { display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #f97316 100%); color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; margin-top: 20px; }
          .footer { text-align: center; color: #999; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>¡Reserva Confirmada! 🎉</h1>
          </div>
          <div class="content">
            <p>Hola ${data.customerName},</p>
            <p>Tu reserva de scooter en PUNTA BIKERS ha sido confirmada. Aquí están los detalles:</p>

            <div class="detail-row">
              <span class="detail-label">Referencia:</span>
              <span class="detail-value">#${data.rentalId.slice(0, 8).toUpperCase()}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Modelo:</span>
              <span class="detail-value">${data.scooterModel}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Inicio:</span>
              <span class="detail-value">${new Date(data.startDate).toLocaleDateString('es-MX')}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Fin:</span>
              <span class="detail-value">${new Date(data.endDate).toLocaleDateString('es-MX')}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Monto Total:</span>
              <span class="detail-value"><strong>$${data.totalAmount} MXN</strong></span>
            </div>

            <p style="margin-top: 20px; color: #666;">
              El próximo paso es subir tu identificación (INE o Pasaporte). Accede a tu panel para completar este paso:
            </p>

            <a href="${data.dashboardLink}" class="cta-button">Ver Mi Reserva</a>

            <p style="margin-top: 20px; font-size: 14px; color: #999;">
              ¿Preguntas? Contáctanos en support@puntabikers.com
            </p>
          </div>
          <div class="footer">
            <p>© 2026 PUNTA BIKERS - Puerto Escondido, Oaxaca</p>
          </div>
        </div>
      </body>
    </html>
  `
}

export function documentApprovedEmail(data: {
  customerName: string
  rentalId: string
  documentType: string
  nextStepLink: string
}) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .cta-button { display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; margin-top: 20px; }
          .footer { text-align: center; color: #999; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✓ Documento Aprobado</h1>
          </div>
          <div class="content">
            <p>Hola ${data.customerName},</p>
            <p>Tu ${data.documentType} ha sido aprobado exitosamente. ¡Estamos un paso más cerca!</p>

            <p style="margin-top: 20px; color: #666;">
              Ahora puedes proceder al pago para activar tu alquiler.
            </p>

            <a href="${data.nextStepLink}" class="cta-button">Completar Pago</a>

            <p style="margin-top: 20px; font-size: 14px; color: #999;">
              ¿Preguntas? Contáctanos en support@puntabikers.com
            </p>
          </div>
          <div class="footer">
            <p>© 2026 PUNTA BIKERS - Puerto Escondido, Oaxaca</p>
          </div>
        </div>
      </body>
    </html>
  `
}

export function paymentSuccessEmail(data: {
  customerName: string
  rentalId: string
  scooterModel: string
  startDate: string
  pickupLink: string
}) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #3b82f6 0%, #f97316 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .highlight { background: #fef3c7; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #f59e0b; }
          .cta-button { display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #f97316 100%); color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; margin-top: 20px; }
          .footer { text-align: center; color: #999; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>💳 Pago Completado</h1>
          </div>
          <div class="content">
            <p>Hola ${data.customerName},</p>
            <p>¡Tu pago ha sido procesado exitosamente! Tu scooter está listo para recoger.</p>

            <div class="highlight">
              <p><strong>Scooter:</strong> ${data.scooterModel}</p>
              <p><strong>Referencia de Alquiler:</strong> #${data.rentalId.slice(0, 8).toUpperCase()}</p>
              <p><strong>Fecha de Inicio:</strong> ${new Date(data.startDate).toLocaleDateString('es-MX')}</p>
            </div>

            <p style="margin-top: 20px; color: #666;">
              Ve a tu panel para ver la ubicación de recogida y detalles del scooter.
            </p>

            <a href="${data.pickupLink}" class="cta-button">Ver Detalles de Recogida</a>

            <p style="margin-top: 20px; font-size: 14px; color: #999;">
              ¿Preguntas? Contáctanos en support@puntabikers.com
            </p>
          </div>
          <div class="footer">
            <p>© 2026 PUNTA BIKERS - Puerto Escondido, Oaxaca</p>
          </div>
        </div>
      </body>
    </html>
  `
}

export function documentRejectedEmail(data: {
  customerName: string
  rentalId: string
  documentType: string
  reason: string
  resubmitLink: string
}) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .warning { background: #fee2e2; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #ef4444; color: #7f1d1d; }
          .cta-button { display: inline-block; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; margin-top: 20px; }
          .footer { text-align: center; color: #999; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⚠️ Documento No Aprobado</h1>
          </div>
          <div class="content">
            <p>Hola ${data.customerName},</p>
            <p>Tu ${data.documentType} no pudo ser verificado. Por favor, revisa los comentarios abajo e intenta nuevamente.</p>

            <div class="warning">
              <p><strong>Razón:</strong></p>
              <p>${data.reason}</p>
            </div>

            <p style="margin-top: 20px; color: #666;">
              Sube una foto más clara o un documento diferente.
            </p>

            <a href="${data.resubmitLink}" class="cta-button">Subir Documento Nuevamente</a>

            <p style="margin-top: 20px; font-size: 14px; color: #999;">
              ¿Preguntas? Contáctanos en support@puntabikers.com
            </p>
          </div>
          <div class="footer">
            <p>© 2026 PUNTA BIKERS - Puerto Escondido, Oaxaca</p>
          </div>
        </div>
      </body>
    </html>
  `
}
