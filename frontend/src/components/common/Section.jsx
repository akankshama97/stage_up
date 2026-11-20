import React from 'react';

export default function Section({
  children,
  className = '',
  surfaceMuted = false,
  id,
  ...props
}) {
  return (
    <section
      id={id}
      className={`py-12 sm:py-20 ${surfaceMuted ? 'bg-surface-muted' : ''} ${className}`}
      {...props}
    >
      {children}
    </section>
  );
}
