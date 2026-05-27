import Anthropic from "@anthropic-ai/sdk";
import { cookies } from "next/headers";

import { auth } from "@/auth";
import { db } from "@/db";
import { generations } from "@/db/schema";
import { isAdminEmail } from "@/lib/admin";
import {
  PASS_COOKIE_NAME,
  refundPass,
  tryUsePass,
} from "@/lib/bio-passes";
import {
  refundCredit,
  saveGeneration,
  tryDeductCredit,
} from "@/lib/credits";
import { stringsFor } from "@/lib/get-locale";
import { LOCALE_COOKIE, normalizeLocale } from "@/lib/i18n";
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

type Reservation =
  | { kind: "user"; userId: string }
  | { kind: "pass"; code: string }
  | { kind: "admin"; userId: string };

export async function POST(req: Request) {
  const cookieJar = cookies();
  const locale = normalizeLocale(cookieJar.get(LOCALE_COOKIE)?.value);
  const E = stringsFor(locale).apiErrors;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json({ error: E.configMissing }, { status: 500 });
  }

  let body: GenerateRequest;
  try {
    body = (await req.json()) as GenerateRequest;
  } catch {
    return Response.json({ error: E.invalidRequest }, { status: 400 });
  }

  const session = await auth();
  const passCode = cookieJar.get(PASS_COOKIE_NAME)?.value;

  let reservation: Reservation | null = null;
  if (session?.user?.id) {
    // Admins bypassen credit-checks — onbeperkt genereren voor de eigenaar.
    if (isAdminEmail(session.user.email)) {
      reservation = { kind: "admin", userId: session.user.id };
    } else {
      const ok = await tryDeductCredit(session.user.id);
      if (ok) {
        reservation = { kind: "user", userId: session.user.id };
      } else if (passCode) {
        // Fallback: gebruiker heeft 0 credits maar wel een pass-cookie.
        const passOk = await tryUsePass(passCode);
        if (passOk) reservation = { kind: "pass", code: passCode };
      }
      if (!reservation) {
        return Response.json({ error: E.noCredits }, { status: 402 });
      }
    }
  } else if (passCode) {
    const ok = await tryUsePass(passCode);
    if (!ok) {
      return Response.json({ error: E.passDepleted }, { status: 402 });
    }
    reservation = { kind: "pass", code: passCode };
  } else {
    return Response.json({ error: E.noAccess }, { status: 401 });
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
          err instanceof Error ? err.message : E.unknown;
        controller.enqueue(encoder.encode(sse({ type: "error", message })));
      } finally {
        controller.close();
        if (!reservation) return;
        if (failed) {
          if (reservation.kind === "user") {
            await refundCredit(reservation.userId).catch(() => {});
          } else if (reservation.kind === "pass") {
            await refundPass(reservation.code).catch(() => {});
          }
          // admin: niets terug te draaien
        } else if (collected.trim()) {
          const { bio, supplement } = splitBio(collected);
          if (reservation.kind === "user" || reservation.kind === "admin") {
            await saveGeneration(
              reservation.userId,
              answers,
              settings,
              bio,
              supplement,
            ).catch(() => {});
          } else {
            await db
              .insert(generations)
              .values({
                userId: null,
                passCode: reservation.code,
                answers,
                settings,
                bio,
                supplement,
              })
              .catch(() => {});
          }
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
