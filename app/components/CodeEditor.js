"use client";

import Editor from "@monaco-editor/react";

export default function CodeEditor({ code, language, theme, fontSize, onChange, onRun, onSave }) {
  const handleEditorMount = (editor, monaco) => {
    editor.addAction({
      id: "run-code",
      label: "Run Code",
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
      run: () => onRun?.(),
    });

    editor.addAction({
      id: "save-code",
      label: "Save Code",
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS],
      run: () => {
        onSave?.();
        return null;
      },
    });
  };

  const loadingIndicator = (
    <div className="flex h-full w-full items-center justify-center bg-surface text-secondary">
      Loading editor...
    </div>
  );

  return (
    <div className="h-full w-full">
      <Editor
        width="100%"
        height="100%"
        language={language === "cpp" ? "cpp" : "c"}
        theme={theme === "dark" ? "vs-dark" : "light"}
        value={code}
        onChange={(value) => onChange(value)}
        onMount={handleEditorMount}
        loading={loadingIndicator}
        options={{
          fontSize,
          fontFamily: "'Fira Code', monospace",
          fontLigatures: true,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          renderLineHighlight: "none",
          padding: { top: 12, bottom: 8 },
          lineNumbers: "on",
          lineNumbersMinChars: 3,
          glyphMargin: false,
          folding: true,
          bracketPairColorization: { enabled: true },
          automaticLayout: true,
          tabSize: 4,
          wordWrap: "off",
          smoothScrolling: true,
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
        }}
      />
    </div>
  );
}
