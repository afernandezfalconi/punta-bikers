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
      totalCost,
      duration,
    } = body;

    if (!userEmail || !rentalId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #004E89;">¡Renta Finalizada - PUNTA BIKERS!</h2>

      <p>Hola ${userName || 'Cliente'},</p>

      <p>Tu renta ha finalizado. Gracias por usar PUNTA BIKERS.</p>

      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Resumen de la Renta:</strong></p>
        <ul style="list-style: none; padding: 0;">
          <li>📍 <strong>Scooter:</strong> ${scooterModel}</li>
          <li>🏷️ <strong>Placa:</strong> ${licensePlate}</li>
          <li>⏱️ <strong>Duración:</strong> ${duration}</li>
          <li>💰 <strong>Costo Total:</strong> $${totalCost.toFixed(2)} MXN</li>
          <li>🆔 <strong>ID de Renta:</strong> ${rentalId}</li>
        </ul>
      </div>

      <div style="background-color: #e8f5e9; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p><strong>📝 Califica tu experiencia:</strong></p>
        <p>Tu opinión es importante para nosotros. <a href="${process.env.NEXT_PUBLIC_APP_URL}/feedback/${rentalId}" style="color: #004E89; text-decoration: none; font-weight: bold;">Deja tu reseña aquí</a></p>
      </div>

      <p>¡Esperamos verte pronto!</p>

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
        subject: '✓ Renta Finalizada - PUNTA BIKERS',
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
