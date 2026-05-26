import {anthropic} from '@ai-sdk/anthropic';
import {streamText, tool, convertToModelMessages, stepCountIs} from 'ai';
import {briefSchema, buildSystemPrompt} from '@/lib/ai/agent-b-config';

export const runtime = 'nodejs';
export const maxDuration = 60;

const TOTAL_USER_TURNS = 12;

type IncomingMessage = {
  role: string;
  parts?: Array<{type?: string; state?: string}>;
};

function hasSubmittedBrief(messages: IncomingMessage[]): boolean {
  return messages.some((m) =>
    m.parts?.some(
      (p) => p.type === 'tool-submit_brief' && p.state === 'output-available'
    )
  );
}

export async function POST(req: Request) {
  const {messages, locale} = await req.json();
  const origin = new URL(req.url).origin;
  const lang: 'fr' | 'en' = locale === 'en' ? 'en' : 'fr';

  // Filter out any system messages from the client — system prompt is passed
  // separately via the `system` param and must not be duplicated in messages.
  const incoming = messages as IncomingMessage[];
  const safeMessages = incoming.filter((m) => m.role !== 'system');
  const modelMessages = await convertToModelMessages(
    safeMessages as Parameters<typeof convertToModelMessages>[0]
  );

  // Filet de sécurité : si le user a déjà répondu à 11 tours et que le tool
  // n'a pas encore été appelé, on force le modèle à appeler submit_brief
  // pour clôturer le flow. Évite que Haiku boucle indéfiniment.
  const userTurns = safeMessages.filter((m) => m.role === 'user').length;
  const forceSubmit =
    userTurns >= TOTAL_USER_TURNS && !hasSubmittedBrief(safeMessages);

  console.log('[agent-b] POST', {
    lang,
    userTurns,
    forceSubmit,
    totalMessages: safeMessages.length
  });

  const result = streamText({
    model: anthropic('claude-haiku-4-5-20251001'),
    system: buildSystemPrompt(lang),
    messages: modelMessages,
    temperature: 0.4,
    maxOutputTokens: forceSubmit ? 800 : 120,
    stopWhen: stepCountIs(2),
    toolChoice: forceSubmit ? {type: 'tool', toolName: 'submit_brief'} : 'auto',
    onError({error}) {
      console.error('[agent-b] streamText error', error);
    },
    onStepFinish({finishReason, toolCalls, toolResults, text}) {
      console.log('[agent-b] step finish', {
        finishReason,
        toolCallNames: toolCalls?.map((c) => c.toolName),
        toolResultCount: toolResults?.length ?? 0,
        textLen: text?.length ?? 0
      });
    },
    tools: {
      submit_brief: tool({
        description:
          'Submit the project brief when ALL info is collected (project_type, objective, deliverables, location, dates, budget, vision, contact). Call ONLY at the final turn.',
        inputSchema: briefSchema,
        execute: async (payload) => {
          const res = await fetch(`${origin}/api/brief`, {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify(payload)
          });
          if (!res.ok) {
            return {status: 'error', message: "Le brief n'a pas pu être envoyé."};
          }
          return {
            status: 'ok',
            message:
              'Brief transmis à Alyssia. Tu peux maintenant réserver ton Discovery Call.'
          };
        }
      })
    }
  });

  return result.toUIMessageStreamResponse({
    headers: {
      'x-accel-buffering': 'no'
    }
  });
}
