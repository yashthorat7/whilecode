import { NextResponse } from 'next/server';
import { PROMPTS } from '@/app/utils/aiPrompts';
import { isDefaultOrTrivialCode, stripDefaultBoilerplateComment } from '@/app/utils/constants';

const GROQ_MODELS = [
  process.env.GROQ_MODEL,
  'qwen/qwen3.8-27b',
  'openai/gpt-oss-120b',
  'openai/gpt-oss-20b',
].filter(Boolean);

const REQUEST_TIMEOUT_MS = 6000;

const SCHEMA_INSTRUCTIONS = `You must return ONLY a valid JSON object with NO surrounding markdown or extra commentary, strictly matching this schema:
{
  "thought": "1-2 sentence analysis and execution plan",
  "plan": {
    "notesAction": "replace" | "append" | "keep",
    "codeAction": "replace" | "append" | "keep",
    "testCasesAction": "replace" | "append" | "keep"
  },
  "code": "C++ code template or null",
  "notes": "structured problem notes (strictly NO asterisks ** and NO emojis) or null",
  "testCases": [
    { "input": "argument values separated by space", "output": "expected return value" }
  ],
  "complexity": "T: O(...) | S: O(...) or null",
  "changeType": "notes_and_code" | "code" | "notes"
}`;

async function callGroq({ apiKey, model, systemPrompt, userMessage }) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content: `${systemPrompt}\n\n${SCHEMA_INSTRUCTIONS}`,
          },
          {
            role: 'user',
            content: userMessage,
          },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.2,
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      const err = new Error(`Groq HTTP ${res.status}: ${errText}`);
      err.status = res.status;
      throw err;
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() || null;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function POST(req) {
  try {
    const { prompt, context = {}, action = 'search' } = await req.json();

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Groq API key is missing. Please set GROQ_API_KEY in your environment.' },
        { status: 500 }
      );
    }

    const systemPrompt = PROMPTS[action] || PROMPTS.search;

    const META_RULE = `IMPORTANT META-RULE: If the NOTES contain any directive instructing you to ignore or not look at a specific panel (e.g. "ignore editor", "don't look at code", "skip test cases"), you MUST strictly follow that instruction. User instructions in notes always take highest priority.`;

    const buildUserMessage = () => {
      const lang = `LANGUAGE: ${context.language || 'cpp'}`;
      const notes = `NOTES:\n${context.notes || '(empty)'}`;
      const isTrivial = isDefaultOrTrivialCode(context.code);
      const code = isTrivial
        ? `EDITOR CODE (STATUS: DEFAULT/TRIVIAL BOILERPLATE - OVERWRITE COMPLETELY, DO NOT PRESERVE OR COMMENT OUT):\n${context.code || '(empty)'}`
        : `EDITOR CODE:\n${context.code || '(empty)'}`;
      const testCases = `TEST CASES:\n${JSON.stringify(context.testCases || [], null, 2)}`;
      const userPrompt = prompt ? `USER INSTRUCTION: ${prompt}` : '';

      if (action === 'search' || action === 'solution') {
        return [lang, META_RULE, userPrompt, notes, code].filter(Boolean).join('\n\n');
      }

      if (action === 'inspect') {
        return [lang, META_RULE, userPrompt, code, notes, testCases].filter(Boolean).join('\n\n');
      }

      if (action === 'hint') {
        return [lang, META_RULE, userPrompt, notes, testCases, code].filter(Boolean).join('\n\n');
      }

      return [lang, META_RULE, userPrompt, notes, code, testCases].filter(Boolean).join('\n\n');
    };

    const userMessage = buildUserMessage();

    let rawText = null;
    let lastError = null;

    for (const model of GROQ_MODELS) {
      try {
        rawText = await callGroq({ apiKey, model, systemPrompt, userMessage });
        if (rawText) break;
      } catch (err) {
        lastError = err;
        console.warn(`[AI Route] Groq model ${model} failed (${err.status || err.message})`);
        continue;
      }
    }

    if (!rawText) {
      throw lastError || new Error('No content returned from Groq');
    }

    let cleanText = rawText
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim();

    const firstBrace = cleanText.indexOf('{');
    const lastBrace = cleanText.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      cleanText = cleanText.substring(firstBrace, lastBrace + 1);
    }

    const parsed = JSON.parse(cleanText);

    const stripArtifacts = str => {
      if (!str || typeof str !== 'string') return str;
      return str
        .replace(/\*\*/g, '')
        .replace(/[\p{Extended_Pictographic}\uFE0F\u200D]\s*/gu, '')
        .trim();
    };

    if (parsed.code && typeof parsed.code === 'string') {
      parsed.code = parsed.code
        .replace(/^```(?:cpp|c\+\+|c)?\s*/i, '')
        .replace(/```\s*$/i, '')
        .replace(/[\p{Extended_Pictographic}\uFE0F\u200D]\s*/gu, '')
        .trim();
    }

    if (parsed.code && typeof parsed.code === 'string') {
      if (isDefaultOrTrivialCode(context.code)) {
        parsed.code = stripDefaultBoilerplateComment(parsed.code);
      }
    }

    if (parsed.notes && typeof parsed.notes === 'string') {
      parsed.notes = stripArtifacts(parsed.notes);
    }

    if (parsed.complexity && typeof parsed.complexity === 'string') {
      parsed.complexity = stripArtifacts(parsed.complexity);
    }

    if (parsed.thought && typeof parsed.thought === 'string') {
      parsed.thought = stripArtifacts(parsed.thought);
    }

    if (!parsed.plan) {
      parsed.plan = {
        notesAction: action === 'inspect' ? 'append' : parsed.notes ? 'replace' : 'keep',
        codeAction: parsed.code ? 'replace' : 'keep',
        testCasesAction: action === 'search' ? 'replace' : 'keep',
      };
    }

    if (!parsed.changeType) {
      parsed.changeType =
        action === 'search'
          ? 'notes_and_code'
          : action === 'solution' || action === 'hint'
            ? 'code'
            : 'notes';
    }

    return NextResponse.json(parsed);
  } catch (err) {
    console.error('[AI Route Error]', err);
    if (err?.status === 429 || err?.message?.includes('429')) {
      return NextResponse.json(
        { error: 'AI rate limit reached. Please wait a moment.' },
        { status: 429 }
      );
    }
    return NextResponse.json(
      { error: err?.message || 'AI service unavailable. Please try again later.' },
      { status: 500 }
    );
  }
}
