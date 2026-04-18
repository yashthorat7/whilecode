'use client';

import Editor from '@monaco-editor/react';
import { useMemo, useCallback } from 'react';

export default function CodeEditor({
  value,
  language = 'cpp',
  theme = 'dark',
  fontSize = 14,
  onChange,
}) {
  const handleBeforeMount = useCallback(monaco => {
    monaco.editor.defineTheme('cp-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#202023',
        'editor.foreground': '#e4e4e7',
        'editor.lineHighlightBackground': '#20202300',
        'editorLineNumber.foreground': '#71717a',
        'editorCursor.foreground': '#34d399',
        'editor.selectionBackground': '#3f3f46',
        'editor.inactiveSelectionBackground': '#3f3f4680',
        'editorWhitespace.foreground': '#3f3f46',
        'editorIndentGuide.background1': '#3f3f46',
        'editorIndentGuide.activeBackground1': '#52525b',
      },
    });
    monaco.editor.defineTheme('cp-light', {
      base: 'vs',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#ffffff',
        'editor.foreground': '#18181b',
        'editor.lineHighlightBackground': '#00000000',
        'editorLineNumber.foreground': '#a1a1aa',
        'editorCursor.foreground': '#16a34a',
        'editor.selectionBackground': '#dcfce7',
        'editor.inactiveSelectionBackground': '#e4e4e7',
        'editorWhitespace.foreground': '#e4e4e7',
        'editorIndentGuide.background1': '#e4e4e7',
        'editorIndentGuide.activeBackground1': '#d4d4d8',
      },
    });
  }, []);

  const options = useMemo(
    () => ({
      fontSize,
      fontFamily: "'Fira Code', monospace",
      fontLigatures: false,
      minimap: { enabled: false },
      automaticLayout: true,
      scrollBeyondLastLine: false,
      smoothScrolling: true,
      lineNumbers: 'on',
      lineNumbersMinChars: 3,
      lineDecorationsWidth: 16,
      padding: { top: 12, bottom: 12 },
      roundedSelection: true,
      cursorBlinking: 'smooth',
      cursorSmoothCaretAnimation: 'on',
      cursorStyle: 'line',
      cursorWidth: 2,
      wordWrap: 'on',
      renderWhitespace: 'none',
      renderControlCharacters: false,
      renderLineHighlight: 'none',
      tabSize: 4,
      insertSpaces: true,
      autoIndent: 'full',
      folding: false,
      glyphMargin: false,
      overviewRulerBorder: false,
      scrollbar: {
        vertical: 'hidden',
        horizontal: 'hidden',
        verticalScrollbarSize: 0,
        horizontalScrollbarSize: 0,
        useShadows: false,
      },
      overviewRulerLanes: 0,
      hideCursorInOverviewRuler: true,
      quickSuggestions: false,
      suggestOnTriggerCharacters: false,
      parameterHints: { enabled: false },
      hover: { enabled: false },
      lightbulb: { enabled: false },
      codeLens: false,
      contextmenu: false,
      matchBrackets: 'never',
      occurrencesHighlight: 'off',
      selectionHighlight: false,
      renderIndentGuides: true,
    }),
    [fontSize]
  );

  return (
    <div className="editor-wrap">
      <Editor
        height="100%"
        width="100%"
        language={language}
        value={value}
        theme={theme === 'dark' ? 'cp-dark' : 'cp-light'}
        beforeMount={handleBeforeMount}
        onChange={onChange}
        options={options}
        loading={<div className="h-full w-full bg-inherit" />}
      />
    </div>
  );
}
