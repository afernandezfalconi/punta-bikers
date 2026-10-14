import { NextRequest, NextResponse } from 'next/server';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_API = 'https://api.resend.com/emails';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userEmail,
      userName,
      scooterModel,
      licensePlate,
      rentalId,
      amount,
      paymentId,
    } = body;

    if (!userEmail || !amount || !paymentId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #10B981;">¡Pago Confirmado!</h2>

      <p>Hola ${userName || 'Cliente'},</p>

      <p>Tu pago ha sido procesado exitosamente. Tu renta está activada.</p>

      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Recibo de Pago:</strong></p>
        <ul style="list-style: none; padding: 0;">
          <li>💳 <strong>Transacción:</strong> ${paymentId}</li>
          <li>💰 <strong>Monto:</strong> $${amount.toFixed(2)} MXN</li>
          <li>📍 <strong>Scooter:</strong> ${scooterModel} (${licensePlate})</li>
          <li>🆔 <strong>ID de Renta:</strong> ${rentalId}</li>
          <li>✓ <strong>Estado:</strong> Pagado</li>
        </ul>
      </div>

      <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p><strong>⚡ Tu scooter está listo:</strong></p>
        <p>Dirígete al punto de retiro y comienza a disfrutar tu viaje con PUNTA BIKERS.</p>
      </div>

      <p>Para cualquier duda: support@puntabikers.com</p>

      <p style="color: #666; font-size: 12px; margin-top: 30px;">
        © 2026 PUNTA BIKERS. Todos los derechos reservados.
      </p>
    </div>
    `;

    const response = await fetch(RESEND_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'PUNTA BIKERS <noreply@puntabikers.com>',
        to: userEmail,
        subject: '✓ Pago Confirmado - PUNTA BIKERS',
        html: emailContent,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send email via Resend');
    }

    const data = await response.json();
    return NextResponse.json({ success: true, emailId: data.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Email send error:', message);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
