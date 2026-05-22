import {Resend} from 'resend';
import {briefSchema} from '@/lib/ai/agent-b-config';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const raw = await req.json();
  const parsed = briefSchema.safeParse(raw);

  if (!parsed.success) {
    return Response.json(
      {status: 'error', issues: parsed.error.issues},
      {status: 400}
    );
  }

  const brief = parsed.data;
  const recipient = process.env.BRIEF_RECIPIENT_EMAIL || 'alyssia@admara-studio.com';
  const resendKey = process.env.RESEND_API_KEY;

  // Always log structured brief server-side for debugging.
  console.log('[ADMARA brief] received', {
    recipient,
    received_at: new Date().toISOString(),
    brief
  });

  // Forward to recipient via Resend if configured. Non-blocking failure for MVP.
  if (resendKey) {
    try {
      const resend = new Resend(resendKey);
      await resend.emails.send({
        from: 'Agent B <agent@admara-studio.com>',
        to: recipient,
        subject: `[ADMARA] Nouveau brief – ${brief.contact.name}`,
        text: JSON.stringify(brief, null, 2)
      });
    } catch (err) {
      console.error('[ADMARA brief] resend error', err);
    }
  }

  return Response.json({status: 'ok'});
}
