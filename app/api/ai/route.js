import { NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';
import { PROMPTS } from '@/app/utils/aiPrompts';

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    code: { type: Type.STRING, nullable: true },
    notes: { type: Type.STRING, nullable: true },
    testCases: {
      type: Type.ARRAY,
      nullable: true,
      items: {
        type: Type.OBJECT,
        properties: {
          input: { type: Type.STRING },
          output: { type: Type.STRING },
        },
        required: ['input', 'output'],
      },
    },
    complexity: { type: Type.STRING, nullable: true },
    changeType: { type: Type.STRING },
  },
  required: ['changeType'],
};

export async function POST(req) {
  try {
    const { prompt, context = {}, action = 'search' } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key is missing. Please set GEMINI_API_KEY in your environment.' },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    const systemPrompt = PROMPTS[action] || PROMPTS.search;
    const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

    const META_RULE = `IMPORTANT META-RULE: If the NOTES contain any directive instructing you to ignore or not look at a specific panel (e.g. "ignore editor", "don't look at code", "skip test cases"), you MUST strictly follow that instruction. User instructions in notes always take highest priority.`;

    const buildUserMessage = () => {
      const lang = `LANGUAGE: ${context.language || 'cpp'}`;
      const notes = `NOTES:\n${context.notes || '(empty)'}`;
      const code = `EDITOR CODE:\n${context.code || '(empty)'}`;
      const testCases = `TEST CASES:\n${JSON.stringify(context.testCases || [], null, 2)}`;
      const userPrompt = prompt ? `USER INSTRUCTION: ${prompt}` : '';
      const notesEmpty = !context.notes || context.notes.trim().length < 20;

      if (action === 'search') {
        const parts = [lang, META_RULE, userPrompt, notes].filter(Boolean);
        if (notesEmpty) parts.push(code);
        return parts.join('\n\n');
      }

      if (action === 'solution') {
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

    const response = await ai.models.generateContent({
      model,
      contents: userMessage,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema,
        temperature: 0.7,
      },
    });

    const text = response.text ? response.text.trim() : '';
    if (!text) {
      throw new Error('No content returned from AI');
    }

    const cleanText = text.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
    const parsed = JSON.parse(cleanText);

    if (!parsed.changeType) {
      throw new Error('Invalid AI response structure');
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
