"use client";

export default function RunButton({ onClick, isRunning }) {
  return (
    <button
      onClick={onClick}
      disabled={isRunning}
      className={`absolute bottom-4 left-4 z-10 flex items-center gap-2 px-4 py-2 rounded-[6px] font-semibold text-[13px] transition-all duration-150 ease-in-out
        ${isRunning 
          ? "bg-accent/80 text-white/90 pointer-events-none cursor-default" 
          : "bg-accent text-white hover:brightness-110 cursor-pointer shadow-lg active:scale-95"
        }`}
    >
      {isRunning ? (
        <>
          <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-transparent border-t-white" />
          <span>Running...</span>
        </>
      ) : (
        <>
          <span>▶</span>
          <span>Run</span>
        </>
      )}
    </button>
  );
}
