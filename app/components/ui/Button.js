export default function Button({ children, href, className = '', ...props }) {
  const cls = `sq-btn ${className}`.trim();
  return href ? (
    <a href={href} className={cls} {...props}>
      {children}
    </a>
  ) : (
    <button className={cls} {...props}>
      {children}
    </button>
  );
}
