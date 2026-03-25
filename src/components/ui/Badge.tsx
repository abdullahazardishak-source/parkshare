'use client';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'orange' | 'green' | 'red' | 'blue' | 'gray';
  className?: string;
}

export function Badge({ children, variant = 'orange', className = '' }: BadgeProps) {
  const variants = {
    orange: 'bg-orange-pale text-orange-dark',
    green: 'bg-green-pale text-green',
    red: 'bg-red-pale text-red',
    blue: 'bg-blue-pale text-blue',
    gray: 'bg-gray-2 text-gray-5',
  };

  return (
    <span
      className={`
        inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
