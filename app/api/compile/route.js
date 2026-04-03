import { NextResponse } from 'next/server';
import { LANGUAGE_MAP } from '@/app/utils/languageMap';

const DEFAULT_HOST = 'ce.judge0.com';
const JUDGE0_API_HOST = process.env.JUDGE0_API_HOST || DEFAULT_HOST;
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY;

export async function POST(req) {
  try {
    const { code, input, language } = await req.json();

    const mapped = LANGUAGE_MAP[language];
    const languageId = mapped ? mapped.judge0Id : 54; 

    const headers = { 'Content-Type': 'application/json' };
    if (JUDGE0_API_KEY) {
      if (JUDGE0_API_HOST.includes('rapidapi')) {
        headers['X-RapidAPI-Key'] = JUDGE0_API_KEY;
        headers['X-RapidAPI-Host'] = JUDGE0_API_HOST;
      } else {
        headers['Authorization'] = `Token ${JUDGE0_API_KEY}`;
      }
    }

    const JUDGE0_URL = `https://${JUDGE0_API_HOST}/submissions?base64_encoded=false&wait=true`;

    const response = await fetch(JUDGE0_URL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        source_code: code,
        language_id: languageId,
        stdin: input || '',
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Executor Error: ${response.status}\nMessage: ${await response.text()}` },
        { status: response.status }
      );
    }

    const result = await response.json();


    if (result.status && result.status.id === 6) {
      return NextResponse.json({
        error: `Compilation Error:\n${result.compile_output || 'Unknown compiler error'}`,
      });
    }

    if (result.status && ![3, 4].includes(result.status.id)) {
      let errorMsg = `Runtime Error: ${result.status.description}`;
      if (result.stderr) errorMsg += `\n${result.stderr}`;
      if (result.message) errorMsg += `\n${result.message}`;
      return NextResponse.json({ error: errorMsg });
    }

    return NextResponse.json({
      output: result.stdout || '',
      time: result.time || 0,
    });
  } catch (err) {
    console.error('Execution API error:', err);
    return NextResponse.json({ error: `Execution failed: ${err.message}` }, { status: 500 });
  }
}
