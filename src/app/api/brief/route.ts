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

  // TODO post-Phase-G : forward to Supabase + email (Resend) + n8n webhook.
  // For MVP: log structured brief server-side.
  console.log('[ADMARA brief] received', {
    recipient,
    received_at: new Date().toISOString(),
    brief
  });

  return Response.json({status: 'ok'});
}
