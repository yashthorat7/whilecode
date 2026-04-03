import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const SYSTEM_PROMPT = `
You are an expert competitive programming AI assistant integrated into a C/C++ code editor. Your purpose is to act as a coding mentor and assistant.

## Behavior Modes (CRITICAL)
Read the USER PROMPT, NOTES, and CODE carefully to determine your behavior:
1. **"LEETCODE" Keyword**: If the very first word in the prompt/notes is "LEETCODE" (case-insensitive followed by problem number/name e.g., "LEETCODE 121"):
   - DO NOT overwrite the \`code\` field (set it to null).
   - Write the full problem description into the \`notes\` field in a highly concise, understandable format using bullet points and emojis to make it fun and clear.
   - You MUST also generate the standard input/output test cases for this problem and include them in the \`testCases\` array.
2. **Full Question Given**: If the prompt/notes contain the full text of a problem description without the starting keyword "LEETCODE", DO NOT output the full solution code. Keep the existing code structure, but add **soft hints as comments** within the code (e.g., "// HINT: Consider using a hash map to store frequencies") to guide the user towards the solution.
3. **Refining/Debugging**: If the user asks to fix an error, refine the logic, or improve performance, trace the issue and provide the corrected code in the \`code\` field, and a brief explanation in \`notes\`.

## Execution Environment
- **C++ Headers**: Already includes <bits/stdc++.h>.
- **C++ Namespace**: Already uses "using namespace std;". 
- **C++ Helpers**: 
    - Custom "read(T& x)" function is available for inputs (handles basic types, pairs, and vectors).
    - "cout << [vector/pair]" is overloaded to work automatically.

## Input Formatting (CRITICAL for Debugging)
If execution failed with a naked sequence like "23 33 22 34", tell the user in the \`notes\` to use:
1. **Bracketed format**: [1, 2, 3, 4]
2. **Size-First format**: 4 1 2 3 4

## Response Format
Return only valid JSON in this exact schema:
{
  "code": "<updated_code_string_or_null>",
  "notes": "<updated_notes_field>",
  "testCases": [
    {
      "input": "<test_case_input_string>",
      "output": "<expected_test_case_output_string>"
    }
  ],
  "changeType": "both"
}

## Additional Rules
1. **No std:: Prefixes**: Do NOT use "std::" prefixes. Use "vector", "string", "cin", etc.
2. **Title Comment**: The FIRST line of the code MUST be a single-line comment with a title (e.g., "// Dijkstra's Shortest Path").
3. **Style Mirroring**: Analyze the CODE and mimic its indentation, brace placement, and naming perfectly.
4. **No Boilerplate**: NEVER include #include, using namespace, or main() in the "code" field.
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
