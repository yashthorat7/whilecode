import { Plus } from "lucide-react";
import Tab from "../ui/Tab";

export default function TabBar() {
  const tabs = [
    { name: "main", active: true },
    { name: "utils", active: false }
  ];

  return (
    <div className="relative z-20 h-9 flex items-end select-none">
      <div className="flex items-end h-full">
        {tabs.map((tab, i) => (
          <Tab key={i} name={tab.name} active={tab.active} onClose={() => {}} />
        ))}
      </div>
      <div className="h-full flex items-center">
        <button className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-300 transition-colors rounded">
          <Plus className="w-3.5 h-3.5" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
