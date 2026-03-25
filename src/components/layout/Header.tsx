'use client';

import { ArrowLeft, Bell, Menu } from 'lucide-react';
import Link from 'next/link';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  transparent?: boolean;
  white?: boolean;
  rightAction?: React.ReactNode;
  backUrl?: string;
}

export function Header({
  title,
  showBack = false,
  transparent = false,
  white = false,
  rightAction,
  backUrl,
}: HeaderProps) {
  const bgStyles = transparent
    ? 'bg-transparent border-none'
    : white
    ? 'bg-gray-0/95'
    : 'bg-gray-1/92 backdrop-blur-xl';

  const textColor = transparent ? 'text-white' : 'text-gray-7';

  return (
    <header
      className={`
        sticky top-0 z-50 flex items-center justify-between px-5 h-12
        border-b border-gray-6/10 ${bgStyles}
      `}
    >
      <div className="flex items-center gap-2">
        {showBack ? (
          <Link
            href={backUrl || '#'}
            className={`flex items-center gap-1 p-2 -ml-2 rounded-xl ${textColor}`}
          >
            <ArrowLeft size={20} />
            <span className="text-base font-medium">Back</span>
          </Link>
        ) : (
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange rounded-lg flex items-center justify-center">
              <svg
                width="18"
                height="18"
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
            <span className={`font-bold text-lg ${textColor}`}>ParkShare</span>
          </Link>
        )}
      </div>

      <div className="flex items-center gap-2">
        {rightAction || (
          <Link href="/notifications" className={`p-2 rounded-xl relative ${textColor}`}>
            <Bell size={20} />
          </Link>
        )}
      </div>
    </header>
  );
}
