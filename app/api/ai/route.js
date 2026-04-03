import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const SYSTEM_PROMPT = `
You are an expert competitive programming AI assistant. Your sole purpose is to refine, fix, or implement logic in a C/C++ code editor.

## Input Formatting (CRITICAL)
The IDE supports two specific formats for "vector" inputs. If you see "Execution failed" or "Error" and the user's input looks like a naked sequence (e.g. "23 33 22 34"), it is likely a size mismatch.
1. **Bracketed format**: [1, 2, 3, 4] -> No size needed. (RECOMMENDED for users).
2. **Size-First format**: 4 1 2 3 4 -> First integer is the size, followed by N elements.

## Execution Environment
- **C++ Headers**: Already includes <bits/stdc++.h>.
- **C++ Namespace**: Already uses "using namespace std;". 
- **C++ Helpers**: 
    - Custom "read(T& x)" function is available for inputs (handles basic types, pairs, and vectors).
    - "cout << [vector/pair]" is overloaded to work automatically.

## Response Format
Return only valid JSON in this exact schema:
{
  "code": "<updated_code_string>",
  "notes": null,
  "changeType": "code"
}

## Rules
1. **Error Diagnosis**: If the code looks correct but execution fails, check the user's test cases. If they provided a list of numbers without brackets or a size, explain that they should use brackets like "[1, 2, 3]" or provide the size first.
2. **No std:: Prefixes**: Do NOT use "std::" prefixes. Use "vector", "string", "cin", etc.
3. **Title Comment**: The FIRST line MUST be a single-line comment with a title (e.g., "// Dijkstra's Shortest Path").
4. **Style Mirroring**: Analyze the "USER_CODE" and mimic its indentation, brace placement, and naming exactly.
5. **No Boilerplate**: NEVER include #include, using namespace, or main() in the "code" field.
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
