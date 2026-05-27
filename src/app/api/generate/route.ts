import Anthropic from "@anthropic-ai/sdk";

import { auth } from "@/auth";
import {
  refundCredit,
  saveGeneration,
  tryDeductCredit,
} from "@/lib/credits";
import { buildUserMessage, splitBio, SYSTEM_PROMPT } from "@/lib/prompt";
import { DEFAULT_SETTINGS, type GenerateRequest } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const DEFAULT_MODEL = "claude-sonnet-4-6";
const MAX_TOKENS = 2048;

function sse(data: Record<string, unknown>): string {
  return `data: ${JSON.stringify(data)}\n\n`;
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Niet ingelogd." }, { status: 401 });
  }
  const userId = session.user.id;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "Serverconfiguratie ontbreekt: ANTHROPIC_API_KEY is niet ingesteld." },
      { status: 500 },
    );
  }

  let body: GenerateRequest;
  try {
    body = (await req.json()) as GenerateRequest;
  } catch {
    return Response.json({ error: "Ongeldige aanvraag." }, { status: 400 });
  }

  const deducted = await tryDeductCredit(userId);
  if (!deducted) {
    return Response.json(
      { error: "Je hebt geen credits meer. Koop credits om door te gaan." },
      { status: 402 },
    );
  }

  const answers = body.answers ?? {};
  const settings = { ...DEFAULT_SETTINGS, ...body.settings };
  const userMessage = buildUserMessage(answers, settings);

  const anthropic = new Anthropic({ apiKey });
  const model = process.env.ANTHROPIC_MODEL || DEFAULT_MODEL;
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let collected = "";
      let failed = false;

      try {
        const messageStream = anthropic.messages.stream({
          model,
          max_tokens: MAX_TOKENS,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: userMessage }],
        });

        for await (const event of messageStream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            collected += event.delta.text;
            controller.enqueue(
              encoder.encode(sse({ type: "chunk", text: event.delta.text })),
            );
          }
        }

        controller.enqueue(encoder.encode(sse({ type: "done" })));
      } catch (err) {
        failed = true;
        const message =
          err instanceof Error
            ? err.message
            : "Onbekende fout bij het genereren.";
        controller.enqueue(encoder.encode(sse({ type: "error", message })));
      } finally {
        controller.close();
        if (failed) {
          await refundCredit(userId).catch(() => {});
        } else if (collected.trim()) {
          const { bio, supplement } = splitBio(collected);
          await saveGeneration(
            userId,
            answers,
            settings,
            bio,
            supplement,
          ).catch(() => {});
        }
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
