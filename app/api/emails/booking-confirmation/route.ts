import { NextRequest, NextResponse } from 'next/server';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_API = 'https://api.resend.com/emails';

function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, char => map[char]);
}

export async function POST(req: NextRequest) {
  try {
    // Verify authentication
    const token = req.cookies.get('sb-access-token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      userEmail,
      userName,
      scooterModel,
      licensePlate,
      rentalId,
      cost,
      startTime,
    } = body;

    if (!userEmail || !scooterModel || !rentalId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Escape all user inputs to prevent HTML injection
    const safeUserName = escapeHtml(userName || 'Cliente');
    const safeModel = escapeHtml(scooterModel);
    const safePlate = escapeHtml(licensePlate);

    const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #004E89;">¡Confirmación de Renta - PUNTA BIKERS!</h2>

      <p>Hola ${safeUserName},</p>

      <p>Tu renta ha sido confirmada exitosamente. Aquí están los detalles:</p>

      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Detalles de la Renta:</strong></p>
        <ul style="list-style: none; padding: 0;">
          <li>📍 <strong>Scooter:</strong> ${safeModel}</li>
          <li>🏷️ <strong>Placa:</strong> ${safePlate}</li>
          <li>📅 <strong>Inicio:</strong> ${escapeHtml(new Date(startTime).toLocaleString('es-MX'))}</li>
          <li>💰 <strong>Costo:</strong> $${cost.toFixed(2)} MXN</li>
          <li>🆔 <strong>ID de Renta:</strong> ${escapeHtml(rentalId)}</li>
        </ul>
      </div>

      <p>Para completar tu pago y activar la renta, haz clic en el botón de pago en tu dashboard.</p>

      <p>Si tienes preguntas, contáctanos a: support@puntabikers.com</p>

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
        subject: '✓ Confirmación de Renta - PUNTA BIKERS',
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
