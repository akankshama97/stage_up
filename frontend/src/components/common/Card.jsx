import React from 'react';

export default function Card({
  children,
  className = '',
  interactive = false,
  onClick,
  ...props
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-surface border border-border rounded-card shadow-soft ${
        interactive
          ? 'cursor-pointer hover:border-text-muted/40 transition-colors duration-150'
          : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
