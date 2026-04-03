import { Lightbulb, Globe, Sparkles, Code } from 'lucide-react';

const DRAWER_ITEMS = [
  { icon: Globe, title: 'Search', action: 'search' },
  { icon: Sparkles, title: 'Solution', action: 'solution' },
  { icon: Code, title: 'Inspect', action: 'inspect' },
];

export default function AiDrawer({ onAiAction, loadingAction, className = '' }) {
  const drawerWidth = DRAWER_ITEMS.length * 28;
  return (
    <div className={`ai-drawer ${className}`} style={{ '--drawer-width': `${drawerWidth}px` }}>
      <div className="ai-drawer-inner">
        {DRAWER_ITEMS.map((item, i) => (
          <button
            key={item.action}
            className={`seg-cell min-w-[28px] shrink-0 ${i > 0 ? 'border-l border-[var(--border)]' : ''} ${loadingAction === item.action ? 'animate-pulse text-[var(--text-accent)]' : ''}`}
            title={item.title}
            disabled={!!loadingAction}
            onClick={() => onAiAction(item.action)}
          >
            <item.icon className="h-3.5 w-3.5" strokeWidth={1.5} />
          </button>
        ))}
      </div>
      <button
        className={`seg-cell min-w-[28px] shrink-0 border-l border-transparent transition-colors group-hover/drawer:border-[var(--border)] ${loadingAction === 'hint' ? 'animate-pulse text-[var(--text-accent)]' : ''}`}
        title="Hint"
        disabled={!!loadingAction}
        onClick={() => onAiAction('hint')}
      >
        <Lightbulb className="h-3.5 w-3.5" strokeWidth={1.5} />
      </button>
    </div>
  );
}
