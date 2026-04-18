import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const autoHeight = el => {
  if (!el) return;
  el.style.height = 'auto';
  el.style.height = el.scrollHeight + 'px';
};

export default function InputList({ testCases, removeTestCase, updateTestCase, fontSize = 14 }) {
  const listRef = useRef(null);

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      listRef.current?.querySelectorAll('textarea').forEach(autoHeight);
    });

    if (listRef.current) observer.observe(listRef.current);

    listRef.current?.querySelectorAll('textarea').forEach(autoHeight);

    return () => observer.disconnect();
  }, [fontSize, testCases]);

  return (
    <div className="panel-list" ref={listRef}>
      {testCases.map(tc => (
        <div
          key={tc.id}
          className="group relative flex min-h-[2.2em] items-start px-[0.5em] py-[0.75em]"
        >
          <textarea
            style={{ fontSize, color: 'var(--text-primary)' }}
            className="w-full resize-none bg-transparent font-mono whitespace-pre-wrap outline-none"
            placeholder="..."
            value={tc.input}
            onChange={e => updateTestCase(tc.id, { input: e.target.value })}
            onInput={e => autoHeight(e.target)}
            ref={autoHeight}
            spellCheck={false}
            rows={1}
          />
          {testCases.length > 1 && (
            <button
              onClick={() => removeTestCase(tc.id)}
              className="icon-btn mt-1 ml-1 shrink-0 bg-transparent opacity-0 group-hover:opacity-100 max-md:opacity-100 md:group-hover:opacity-100"
            >
              <X className="h-3.5 w-3.5 text-zinc-500 hover:text-zinc-200" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
