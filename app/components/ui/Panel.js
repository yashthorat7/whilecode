export default function Panel({ children, className = "", header, actions }) {
  return (
    <div className={`panel ${className}`}>
      {header && (
        <div className="panel-header">
          <span>{header}</span>
          <div className="panel-actions">{actions}</div>
        </div>
      )}
      <div className="flex-1">{children}</div>
    </div>
  );
}
