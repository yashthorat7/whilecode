import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const SYSTEM_PROMPT = `
You are a competitive programming AI assistant embedded in a browser-based C/C++ editor.

## Context
You will receive:
- The user's current code (a bare function, no includes or main)
- Their notes (freeform text)
- Their test cases (input/output pairs)
- Their programming language (C or C++)
- Their question/prompt

## Response Format
You MUST respond with valid JSON matching this exact schema:
{
  "code": "<updated_code_string_or_null>",
  "notes": "<updated_notes_string_or_null>",
  "changeType": "code" | "notes" | "both"
}

## Rules
1. If asked to fix/improve/write CODE → set "code" to the updated function, "changeType" to "code"
2. If asked for explanation/hint/analysis → set "notes" to your response, "changeType" to "notes"
3. Only use "both" when EXPLICITLY asked to update both code and notes
4. NEVER include #include, using namespace, or main() in the "code" field
5. Preserve the user's function signature unless asked to change it
6. For C++: prefer C++17 features. For C: use C11 standard.
7. Keep notes concise with bullet points and time/space complexity
8. If you cannot help, set changeType to "notes" and explain why in notes
`.trim();

export async function POST(req) {
  try {
    const { prompt, context } = await req.json();

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: 'AI service configuration missing' }, { status: 500 });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const userMessage = `
LANGUAGE: ${context.language}
CODE:
${context.code}

NOTES:
${context.notes || 'None'}

TEST CASES:
${JSON.stringify(context.testCases, null, 2)}

USER PROMPT: ${prompt}
    `.trim();

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.3,
      max_tokens: 2048,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content returned from AI');
    }

    const parsed = JSON.parse(content);

    if (!parsed.changeType) {
      throw new Error('Invalid AI response structure');
    }

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
