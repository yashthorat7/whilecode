import { Children } from 'react';

export default function SegmentedButton({ children, className = '' }) {
  return (
    <div className={`seg-btn ${className}`}>
      {Children.map(children, (child, i) => (
        <div key={i} className="seg-cell">
          {child}
        </div>
      ))}
    </div>
  );
}
