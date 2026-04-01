"use client";

import CodeEditor from "./CodeEditor";
import RunButton from "./RunButton";

export default function EditorPanel({
  code,
  language,
  theme,
  fontSize,
  onChange,
  onRun,
  isRunning,
}) {
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-surface">
      <div className="grow overflow-hidden">
        <CodeEditor
          code={code}
          language={language}
          theme={theme}
          fontSize={fontSize}
          onChange={onChange}
          onRun={onRun}
          onSave={() => {}}
        />
      </div>
      <RunButton onClick={onRun} isRunning={isRunning} />
    </div>
  );
}
