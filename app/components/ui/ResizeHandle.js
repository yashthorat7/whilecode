export default function ResizeHandle({ orientation = "vertical", className = "" }) {
  const cls = orientation === "vertical" ? "w-2 cursor-ew-resize" : "h-2 cursor-ns-resize w-full";
  return <div className={`bg-transparent shrink-0 ${cls} ${className}`} />;
}
