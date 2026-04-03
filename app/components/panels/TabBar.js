import { Plus } from 'lucide-react';
import Tab from '../ui/Tab';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToHorizontalAxis, restrictToParentElement } from '@dnd-kit/modifiers';

export default function TabBar({
  tabs,
  activeTabId,
  setActiveTabId,
  addTab,
  removeTab,
  reorderTabs,
  canAddTab,
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = ({ active, over }) => {
    if (over && active.id !== over.id) reorderTabs(active.id, over.id);
  };

  return (
    <div className="relative z-20 flex h-9 items-end select-none">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToHorizontalAxis, restrictToParentElement]}
      >
        <div className="flex h-full min-w-0 items-end">
          <div className="flex h-full min-w-0 items-end gap-[2px]">
            <SortableContext items={tabs.map(t => t.id)} strategy={horizontalListSortingStrategy}>
              {tabs.map(tab => (
                <Tab
                  key={tab.id}
                  id={tab.id}
                  name={tab.name}
                  active={tab.id === activeTabId}
                  onClick={() => setActiveTabId(tab.id)}
                  onClose={() => removeTab(tab.id)}
                />
              ))}
            </SortableContext>
          </div>
          <div className="ml-1 flex h-full shrink-0 items-center">
            <button
              onClick={addTab}
              disabled={!canAddTab}
              className="flex h-6 w-6 items-center justify-center rounded transition-colors"
              style={{
                color: canAddTab ? 'var(--text-muted)' : 'var(--border-focus)',
                opacity: canAddTab ? 1 : 0.4,
                cursor: canAddTab ? 'pointer' : 'not-allowed',
              }}
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </DndContext>
    </div>
  );
}
