export default function Panel({ children, className = "", header, actions }) {
  return (
    <div className={`panel relative ${className}`}>
      {header ? (
        <div className="panel-header">
          <span>{header}</span>
          <div className="panel-actions">{actions}</div>
        </div>
      ) : (
        actions && (
          <div className="panel-actions absolute top-2 right-2 z-30">
            {actions}
          </div>
        )
      )}
      <div className="flex-1">{children}</div>
    </div>
  );
}
