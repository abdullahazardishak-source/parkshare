'use client';

export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-[3px]',
    lg: 'w-8 h-8 border-4',
  };

  return (
    <div
      className={`
        ${sizes[size]}
        border-white/30 border-t-white rounded-full animate-spin
      `}
    />
  );
}

export function LoadingOverlay({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="fixed inset-0 bg-gray-7/50 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-4">
      <LoadingSpinner size="lg" />
      <p className="text-white font-medium">{message}</p>
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="w-16 h-16 bg-orange rounded-2xl flex items-center justify-center shadow-lg shadow-orange/40">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M9 17V7h4a3 3 0 010 6H9" />
          </svg>
        </div>
        <div className="absolute inset-0 rounded-2xl animate-ping bg-orange/30" />
      </div>
      <LoadingSpinner size="md" />
    </div>
  );
}

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton ${className}`} />;
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-card">
      <div className="flex gap-4">
        <Skeleton className="w-24 h-24 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      </div>
    </div>
  );
}
