import { Injectable } from '@nestjs/common';
import type {
  AIChatMessage,
  AIChatRequest,
  AIChatResponse,
  AIFinishReason,
  AppMode,
} from '@papadata/shared';
import { getAppMode } from '../../common/app-mode';
import { VertexAI } from '@google-cloud/vertexai';
import { getDemoResponse } from './demo-responses';
import { getLogger } from '../../common/logger';
import { getApiConfig } from '../../common/config';

const DEFAULT_MODEL = 'gemini-2.5-flash-lite';

const SYSTEM_INSTRUCTION = `You are Papa AI, a world-class e-commerce data scientist and strategic consultant.
Your goal is to analyze e-commerce data (provided in the context) to detect anomalies, inefficiencies, and hidden growth opportunities.

Guidelines for your responses:
1. STRUCTURE: Use "OBSERVATION" (what the data says), "RISK/OPPORTUNITY" (why it matters), and "ACTION PLAN" (specific, prioritized steps).
2. TONE: Professional, analytical, but highly actionable. No fluff.
3. ANOMALY DETECTION: Look for discrepancies between spend and revenue, spikes in return rates, or drops in CVR/ROAS.
4. RECOMMENDATIONS: Focus on ROAS optimization, budget reallocation, and inventory health.
5. OUTPUT FORMAT: Always respond in two sections with clear labels:
PL:
[Polish version]
EN:
[English version]

If the user provides a "DATA SNAPSHOT", treat it as the ground truth for your analysis.`;

const SMOKE_SYSTEM_INSTRUCTION =
  'Return exactly two sections only:\nPL:\nEN:\nKeep the answer extremely short.';

const parseEnvFlag = (value: string | undefined, fallback: boolean): boolean => {
  if (value === undefined) return fallback;
  const normalized = value.trim().toLowerCase();
  if (['false', '0', 'no', 'off'].includes(normalized)) return false;
  if (['true', '1', 'yes', 'on'].includes(normalized)) return true;
  return fallback;
};

const isAiEnabledForMode = (mode: AppMode): boolean => {
  const config = getApiConfig().ai;
  const globalEnabled = parseEnvFlag(String(config.enabled), true);
  const perModeEnabled = mode === 'demo' ? config.enabledDemo : config.enabledProd;
  return globalEnabled && perModeEnabled;
};

const getTimeoutMs = (): number => getApiConfig().ai.timeoutMs;

const withTimeout = async <T>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
  if (!timeoutMs || timeoutMs <= 0) return promise;
  let timer: NodeJS.Timeout | undefined;
  const timeoutPromise = new Promise<T>((_, reject) => {
    timer = setTimeout(() => reject(new Error('timeout')), timeoutMs);
  });
  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timer) clearTimeout(timer);
  }
};

const mapFinishReason = (reason?: string): AIFinishReason | undefined => {
  if (!reason) return undefined;
  const normalized = reason.toUpperCase();
  if (normalized === 'STOP') return 'stop';
  if (normalized === 'SAFETY') return 'safety';
  if (normalized === 'MAX_TOKENS') return 'timeout';
  return 'error';
};

const formatBilingual = (pl: string, en: string): string =>
  ['PL:', pl.trim(), '', 'EN:', en.trim()].join('\n');

const hasBilingualSections = (text: string): boolean => {
  const hasPl = /(^|\n)PL:\s*/i.test(text);
  const hasEn = /(^|\n)EN:\s*/i.test(text);
  return hasPl && hasEn;
};

const buildContextPrompt = (payload: AIChatRequest): string => {
  const sections: string[] = [];
  if (payload.context) {
    sections.push(`CONTEXT:\n${JSON.stringify(payload.context, null, 2)}`);
  }
  const prompt = payload.prompt?.trim();
  if (prompt) {
    sections.push(`USER QUESTION:\n${prompt}`);
  }
  return sections.join('\n\n').trim();
};

const mapMessageRole = (role: AIChatMessage['role']): 'user' | 'model' => {
  if (role === 'assistant') return 'model';
  return 'user';
};

const collectUserInput = (payload: AIChatRequest): string => {
  const parts: string[] = [];
  if (payload.prompt) parts.push(payload.prompt);
  if (payload.messages) {
    parts.push(
      ...payload.messages
        .filter((message) => message.role === 'user')
        .map((message) => message.content)
    );
  }
  return parts.join('\n');
};

const hasSensitiveInput = (text: string): boolean => {
  if (!text) return false;
  const patterns: RegExp[] = [
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
    /\b(?:\d[ -]*?){13,16}\b/,
    /\bAKIA[0-9A-Z]{16}\b/,
    /\bASIA[0-9A-Z]{16}\b/,
    /\bghp_[A-Za-z0-9]{30,}\b/,
    /\bsk-[A-Za-z0-9]{20,}\b/,
    /\bya29\.[A-Za-z0-9\-_]+/i,
    /\beyJ[A-Za-z0-9_-]+?\.[A-Za-z0-9_-]+?\.[A-Za-z0-9_-]+?\b/,
  ];
  return patterns.some((pattern) => pattern.test(text));
};

@Injectable()
export class AiService {
  private readonly logger = getLogger(AiService.name);
  private readonly projectId = getApiConfig().ai.vertexProjectId ?? '';
  private readonly location = getApiConfig().ai.vertexLocation ?? '';
  private readonly modelName = getApiConfig().ai.vertexModel ?? DEFAULT_MODEL;

  async respond(payload: AIChatRequest & { smoke?: boolean }): Promise<AIChatResponse> {
    const mode = payload.mode ?? getAppMode();
    const isSmoke = Boolean((payload as any)?.smoke);

    if (!isAiEnabledForMode(mode)) {
      return {
        text: formatBilingual('Funkcja AI jest obecnie wyłączona.', 'AI is currently disabled.'),
        finishReason: 'error',
      };
    }

    // DEMO: zawsze blokuj sensitive. Bez smoke -> demo response. Smoke -> Vertex.
    if (mode === 'demo') {
      const userInput = collectUserInput(payload);
      if (hasSensitiveInput(userInput)) {
        return {
          text: formatBilingual(
            'W trybie DEMO nie wolno przesylac danych wrazliwych.',
            'Sensitive data is not allowed in DEMO mode.'
          ),
          finishReason: 'safety',
        };
      }
      if (!isSmoke) {
        return {
          text: getDemoResponse(payload.prompt || ''),
          finishReason: 'stop',
        };
      }
    }

    if (!this.projectId || !this.location) {
      return {
        text: formatBilingual('Proxy AI nie jest skonfigurowane.', 'AI proxy not configured.'),
        finishReason: 'error',
      };
    }

    const systemExtras = (payload.messages || [])
      .filter((message) => message.role === 'system')
      .map((message) => message.content.trim())
      .filter(Boolean);

    const systemInstruction = isSmoke
      ? SMOKE_SYSTEM_INSTRUCTION
      : [SYSTEM_INSTRUCTION, ...systemExtras].join('\n\n').trim();

    const contents = (payload.messages || [])
      .filter((message) => message.role !== 'system')
      .map((message) => ({
        role: mapMessageRole(message.role),
        parts: [{ text: message.content }],
      }));

    const prompt = buildContextPrompt(payload);
    if (prompt) {
      const finalPrompt = isSmoke ? `SMOKE CHECK (keep response short).\n${prompt}` : prompt;
      contents.push({ role: 'user', parts: [{ text: finalPrompt }] });
    }

    if (contents.length === 0) {
      return {
        text: formatBilingual('Brak treści zapytania.', 'Missing prompt.'),
        finishReason: 'error',
      };
    }

    const timeoutMs = getTimeoutMs();

    try {
      const vertex = new VertexAI({
        project: this.projectId,
        location: this.location,
      });

      const model = vertex.getGenerativeModel({
        model: this.modelName,
        systemInstruction: {
          role: 'system',
          parts: [{ text: systemInstruction }],
        },
      });

      const result = await withTimeout(model.generateContent({ contents }), timeoutMs);

      const response = result.response;
      const candidate = response.candidates?.[0];
      const text = (candidate?.content?.parts || [])
        .map((part) => (typeof part.text === 'string' ? part.text : ''))
        .join('')
        .trim();

      if (!text) {
        return {
          text: formatBilingual('Odpowiedź AI była pusta.', 'AI response was empty.'),
          finishReason: 'error',
        };
      }

      // Smoke: nie robimy repair (żeby nie robić 2x requestów).
      if (isSmoke) {
        return {
          text: hasBilingualSections(text) ? text : formatBilingual(text, text),
          finishReason: mapFinishReason(candidate?.finishReason),
        };
      }

      if (hasBilingualSections(text)) {
        return {
          text,
          finishReason: mapFinishReason(candidate?.finishReason),
        };
      }

      const repairPrompt = [
        'Rewrite the following response into the required bilingual format.',
        'Return only two sections labeled exactly as:',
        'PL:',
        '[Polish version]',
        'EN:',
        '[English version]',
        '',
        'Original response:',
        text,
      ].join('\n');

      const repair = await withTimeout(
        model.generateContent({
          contents: [{ role: 'user', parts: [{ text: repairPrompt }] }],
        }),
        timeoutMs
      );

      const repairCandidate = repair.response.candidates?.[0];
      const repairedText = (repairCandidate?.content?.parts || [])
        .map((part) => (typeof part.text === 'string' ? part.text : ''))
        .join('')
        .trim();

      if (repairedText && hasBilingualSections(repairedText)) {
        return {
          text: repairedText,
          finishReason: mapFinishReason(repairCandidate?.finishReason),
        };
      }

      this.logger.warn('Vertex AI response missing bilingual sections');
      return {
        text: formatBilingual(`Tlumaczenie niedostepne. Ponizej wersja robocza:\n${text}`, text),
        finishReason: 'error',
      };
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : (error as { message?: string }).message;

      if (message === 'timeout') {
        return {
          text: formatBilingual('Limit czasu dla AI zostal przekroczony.', 'AI request timed out.'),
          finishReason: 'timeout',
        };
      }

      this.logger.warn({ errorMessage: message ?? 'unknown' }, 'Vertex AI request failed');

      return {
        text: formatBilingual('Zadanie AI nie powiodlo sie.', 'AI request failed.'),
        finishReason: 'error',
      };
    }
  }
}
