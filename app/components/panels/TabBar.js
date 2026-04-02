import { Plus } from "lucide-react";
import Tab from "../ui/Tab";
import { useTabs } from "../../hooks/useTabs";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToHorizontalAxis, restrictToParentElement } from "@dnd-kit/modifiers";

export default function TabBar() {
  const { tabs, activeTabId, setActiveTabId, addTab, removeTab, reorderTabs, canAddTab } = useTabs();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      reorderTabs(active.id, over.id);
    }
  };

  return (
    <div className="relative z-20 h-9 flex items-end select-none">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToHorizontalAxis, restrictToParentElement]}
      >
        <div className="flex items-end h-full min-w-0">
          <div className="flex items-end h-full gap-[2px] min-w-0">
            <SortableContext 
              items={tabs.map((t) => t.id)} 
              strategy={horizontalListSortingStrategy}
            >
              {tabs.map((tab) => (
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
          <div className="h-full flex items-center shrink-0 ml-1">
            <button 
              onClick={addTab}
              disabled={!canAddTab}
              className={`w-6 h-6 flex items-center justify-center transition-colors rounded ${
                canAddTab 
                  ? "text-gray-500 hover:text-gray-300" 
                  : "text-gray-700 cursor-not-allowed opacity-50"
              }`}
            >
              <Plus className="w-3.5 h-3.5" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </DndContext>
    </div>
  );
}
