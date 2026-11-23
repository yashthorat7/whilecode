export const DELIMITER = '---CASE_DELIMITER---';

export const DEFAULT_CODE_CPP = `// Recursive Factorial
long long factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}`;

export const DEFAULT_CODE_C = `// Add Two Numbers
int add(int a, int b) {
    return a + b;
}`;

export const STORAGE_KEYS = {
  TABS: 'cp-tabs',
  ACTIVE_TAB: 'cp-active-tab',
  THEME: 'cp-theme',
};

export const LANGUAGE_OPTIONS = [
  { id: 'cpp', label: 'C++', monacoId: 'cpp' },
  { id: 'c', label: 'C', monacoId: 'c' },
];

export const FONT_SIZE_RANGE = { min: 10, max: 24, default: 14 };

export const PISTON_CONFIG = {
  COMPILE_TIMEOUT: 10000,
  RUN_TIMEOUT: 5000,
  MEMORY_LIMIT: 268435456,
};

export function isDefaultOrTrivialCode(code) {
  if (!code || typeof code !== 'string') return true;
  const trimmed = code.trim();
  if (!trimmed) return true;

  const withoutComments = trimmed.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '').trim();
  if (!withoutComments) return true;

  const norm = trimmed.replace(/\r\n/g, '\n');
  if (
    norm === DEFAULT_CODE_CPP.trim().replace(/\r\n/g, '\n') ||
    norm === DEFAULT_CODE_C.trim().replace(/\r\n/g, '\n')
  ) {
    return true;
  }

  if (
    (withoutComments.includes('factorial') || withoutComments.includes('return a + b;')) &&
    withoutComments.length < 200
  ) {
    return true;
  }

  if (
    withoutComments.length < 50 &&
    (withoutComments.includes('solve()') || withoutComments.includes('main()'))
  ) {
    return true;
  }

  return false;
}

export function stripDefaultBoilerplateComment(code) {
  if (!code || typeof code !== 'string') return code;
  const match = code.match(/^\s*\/\*([\s\S]*?)\*\/\s*/);
  if (match) {
    const commentContent = match[1];
    if (
      commentContent.includes('factorial') ||
      commentContent.includes('Add Two Numbers') ||
      commentContent.includes('Recursive Factorial') ||
      isDefaultOrTrivialCode(commentContent)
    ) {
      return code.slice(match[0].length).trimStart();
    }
  }
  return code;
}
