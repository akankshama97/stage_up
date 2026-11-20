import React from 'react';

export default function Container({
  children,
  className = '',
  ...props
}) {
  return (
    <div
      className={`max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8 w-full ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
