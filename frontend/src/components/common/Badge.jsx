import React from 'react';

export default function Badge({
  children,
  variant = 'muted', // 'muted' | 'accent' | 'success'
  className = '',
  ...props
}) {
  const variants = {
    muted: 'bg-surface-muted text-text-muted border border-border',
    accent: 'bg-surface-muted text-accent border border-border',
    success: 'bg-surface-muted text-success border border-border'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full ${
        variants[variant] || variants.muted
      } ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
