import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { PROMPTS } from '@/app/utils/aiPrompts';

export async function POST(req) {
  try {
    const { prompt, context, action = 'search' } = await req.json();

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: 'AI service configuration missing' }, { status: 500 });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const systemPrompt = PROMPTS[action] || PROMPTS.search;

    const META_RULE = `IMPORTANT META-RULE: If the NOTES contain any directive instructing you to ignore or not look at a specific panel (e.g. "ignore editor", "don't look at code", "skip test cases"), you MUST strictly follow that instruction. User instructions in notes always take highest priority.`;

    const buildUserMessage = () => {
      const lang = `LANGUAGE: ${context.language}`;
      const notes = `NOTES:\n${context.notes || '(empty)'}`;
      const code = `EDITOR CODE:\n${context.code || '(empty)'}`;
      const testCases = `TEST CASES:\n${JSON.stringify(context.testCases, null, 2)}`;
      const notesEmpty = !context.notes || context.notes.trim().length < 20;

      if (action === 'search') {
        const parts = [lang, META_RULE, notes];
        if (notesEmpty) parts.push(code);
        return parts.join('\n\n');
      }

      if (action === 'solution') {
        return [lang, META_RULE, notes, code].join('\n\n');
      }

      if (action === 'inspect') {
        return [lang, META_RULE, code, notes, testCases].join('\n\n');
      }

      if (action === 'hint') {
        return [lang, META_RULE, notes, testCases, code].join('\n\n');
      }

      return [lang, META_RULE, notes, code, testCases].join('\n\n');
    };

    const userMessage = buildUserMessage();

    let fullContent = '';
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      temperature: 1,
      max_completion_tokens: 1024,
      top_p: 1,
      stream: true,
      stop: null,
      response_format: { type: 'json_object' },
    });

    for await (const chunk of completion) {
      const content = chunk.choices[0]?.delta?.content || '';
      fullContent += content;
    }

    const content = fullContent;
    if (!content) throw new Error('No content returned from AI');

    const parsed = JSON.parse(content);
    if (!parsed.changeType) throw new Error('Invalid AI response structure');

    return NextResponse.json(parsed);
  } catch (err) {
    console.error('[AI Route Error]', err?.status, err?.message, err?.error);
    if (err.status === 429) {
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
