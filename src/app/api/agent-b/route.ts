import {anthropic} from '@ai-sdk/anthropic';
import {streamText, tool, convertToModelMessages} from 'ai';
import {briefSchema, buildSystemPrompt} from '@/lib/ai/agent-b-config';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(req: Request) {
  const {messages} = await req.json();
  const origin = new URL(req.url).origin;

  // Filter out any system messages from the client — system prompt is passed
  // separately via the `system` param and must not be duplicated in messages.
  const safeMessages = (messages as Array<{role: string}>).filter(
    (m) => m.role !== 'system'
  );
  const modelMessages = await convertToModelMessages(
    safeMessages as Parameters<typeof convertToModelMessages>[0]
  );

  const result = streamText({
    model: anthropic('claude-haiku-4-5-20251001'),
    system: buildSystemPrompt(),
    messages: modelMessages,
    temperature: 0.4,
    maxOutputTokens: 120,
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
