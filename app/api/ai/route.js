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

    const userMessage = `
LANGUAGE: ${context.language}

CODE:
${context.code || '(empty)'}

NOTES:
${context.notes || '(empty)'}

TEST CASES (with actual outputs):
${JSON.stringify(context.testCases, null, 2)}

USER PROMPT: ${prompt}
    `.trim();

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.3,
      max_tokens: 2048,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error('No content returned from AI');

    const parsed = JSON.parse(content);
    if (!parsed.changeType) throw new Error('Invalid AI response structure');

    return NextResponse.json(parsed);
  } catch (err) {
    if (err.status === 429) {
      return NextResponse.json(
        { error: 'AI rate limit reached. Please wait a moment.' },
        { status: 429 }
      );
    }
    return NextResponse.json(
      { error: 'AI service unavailable. Please try again later.' },
      { status: 500 }
    );
  }
}
