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
        'editor.background': '#1f2937',
        'editor.foreground': '#e5e7eb',
        'editor.lineHighlightBackground': '#1f293700',
        'editorLineNumber.foreground': '#6b7280',
        'editorCursor.foreground': '#60a5fa',
        'editor.selectionBackground': '#374151',
        'editor.inactiveSelectionBackground': '#37415180',
        'editorWhitespace.foreground': '#374151',
        'editorIndentGuide.background1': '#374151',
        'editorIndentGuide.activeBackground1': '#4b5563',
      },
    });
    monaco.editor.defineTheme('cp-light', {
      base: 'vs',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#ffffff',
        'editor.foreground': '#111827',
        'editor.lineHighlightBackground': '#00000000',
        'editorLineNumber.foreground': '#9ca3af',
        'editorCursor.foreground': '#2563eb',
        'editor.selectionBackground': '#dbeafe',
        'editor.inactiveSelectionBackground': '#e5e7eb',
        'editorWhitespace.foreground': '#e5e7eb',
        'editorIndentGuide.background1': '#e5e7eb',
        'editorIndentGuide.activeBackground1': '#cbd5e1',
      },
    });
  }, []);

  const options = useMemo(
    () => ({
      fontSize,
      fontFamily: "'Fira Code', monospace",
      fontLigatures: true,
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
