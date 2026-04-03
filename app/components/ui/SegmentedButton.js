import { Children } from 'react';

export default function SegmentedButton({ children, className = '' }) {
  return (
    <div className={`seg-btn ${className}`}>
      {children}
    </div>

  );
}
