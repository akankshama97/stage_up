import React from 'react';

export default function Button({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'ghost' | 'link'
  size = 'md', // 'sm' | 'md' | 'lg'
  className = '',
  type = 'button',
  onClick,
  disabled = false,
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-colors duration-150 rounded-btn cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-accent/30';

  const variants = {
    primary: 'bg-accent text-surface hover:bg-accent-hover shadow-soft',
    secondary: 'bg-surface border border-border text-text hover:bg-surface-muted shadow-soft',
    ghost: 'bg-transparent text-text hover:bg-surface-muted',
    link: 'bg-transparent text-accent hover:text-accent-hover underline-offset-4 hover:underline p-0 h-auto'
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 h-8 gap-1.5',
    md: 'text-sm px-4 py-2 h-10 gap-2',
    lg: 'text-base px-5 py-2.5 h-11 gap-2.5'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${
        variant !== 'link' ? sizes[size] || sizes.md : ''
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
