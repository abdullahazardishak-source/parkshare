'use client';

import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  noPadding?: boolean;
}

export function Card({ children, className = '', onClick, noPadding = false }: CardProps) {
  return (
    <div
      className={`
        bg-white rounded-2xl shadow-card border border-black/[0.04]
        ${noPadding ? '' : 'p-5'}
        ${onClick ? 'cursor-pointer active:scale-[0.98] transition-transform' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function CardList({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`space-y-3 ${className}`}>{children}</div>;
}
