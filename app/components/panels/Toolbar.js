import { FileText, Download, Moon } from "lucide-react";
import Button from "../ui/Button";
import SegmentedButton from "../ui/SegmentedButton";

export default function Toolbar({ fontSize, setFontSize }) {
  const dec = () => setFontSize((s) => Math.max(10, s - 1));
  const inc = () => setFontSize((s) => Math.min(30, s + 1));

  return (
    <div className="h-[26px] mb-2 flex justify-end items-center gap-1.5">
      <SegmentedButton>
        <button><FileText className="w-3.5 h-3.5" strokeWidth={1.5} /></button>
        <button><Download className="w-3.5 h-3.5" strokeWidth={1.5} /></button>
        <div className="w-8 h-full flex items-center justify-center relative select-none group">
          <span className="text-[11px] text-gray-500 group-hover:text-gray-300 transition-colors z-0">{fontSize}</span>
          <div className="absolute inset-0 flex">
            <button className="flex-1" onClick={dec} />
            <button className="flex-1" onClick={inc} />
          </div>
        </div>
        <button><Moon className="w-3.5 h-3.5" strokeWidth={1.5} /></button>
      </SegmentedButton>

      <Button href="https://github.com/yashthorat7" target="_blank" rel="noopener noreferrer">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
        </svg>
      </Button>
    </div>
  );
}
