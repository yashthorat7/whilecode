import { NextResponse } from 'next/server';
import { LANGUAGE_MAP } from '@/app/utils/languageMap';
import { PISTON_CONFIG } from '@/app/utils/constants';

export async function POST(req) {
  try {
    const { source_code, stdin, language } = await req.json();

    const mapped = LANGUAGE_MAP[language];
    if (!mapped) {
      return NextResponse.json({ error: 'Unsupported language' }, { status: 400 });
    }

    const PISTON_URL = process.env.PISTON_URL || 'https://emkc.org/api/v2/piston/execute';

    const response = await fetch(PISTON_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: mapped.runtime,
        version: mapped.version,
        files: [{ name: mapped.fileName, content: source_code }],
        stdin: stdin,
        compile_timeout: PISTON_CONFIG.COMPILE_TIMEOUT,
        run_timeout: PISTON_CONFIG.RUN_TIMEOUT,
        compile_memory_limit: PISTON_CONFIG.MEMORY_LIMIT,
        run_memory_limit: PISTON_CONFIG.MEMORY_LIMIT,
      }),
    });

    const data = await response.json();

    if (data.compile && data.compile.code !== 0) {
      return NextResponse.json(
        {
          type: 'compile_error',
          message: data.compile.stderr,
        },
        { status: 400 }
      );
    }

    if (data.run && data.run.code !== 0) {
      return NextResponse.json(
        {
          type: 'runtime_error',
          message: data.run.stderr,
          signal: data.run.signal,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      stdout: data.run.stdout,
      stderr: data.run.stderr,
      time: data.run.time || 0,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Execution failed' }, { status: 500 });
  }
}
