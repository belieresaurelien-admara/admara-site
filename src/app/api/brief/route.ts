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
  // Default to Resend's sandboxed sender until admara-studio.com domain is verified.
  const from = process.env.RESEND_FROM || 'ADMARA Agent B <onboarding@resend.dev>';

  console.log('[ADMARA brief] received', {
    recipient,
    received_at: new Date().toISOString(),
    brief
  });

  if (resendKey) {
    try {
      const resend = new Resend(resendKey);
      const {data, error} = await resend.emails.send({
        from,
        to: recipient,
        subject: `[ADMARA] Nouveau brief – ${brief.contact.name}`,
        text: JSON.stringify(brief, null, 2)
      });
      if (error) {
        console.error('[ADMARA brief] resend error', error);
      } else {
        console.log('[ADMARA brief] resend sent', {id: data?.id, to: recipient});
      }
    } catch (err) {
      console.error('[ADMARA brief] resend exception', err);
    }
  } else {
    console.warn('[ADMARA brief] RESEND_API_KEY missing — email not sent');
  }

  return Response.json({status: 'ok'});
}
