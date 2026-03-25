'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Search, Calendar, User } from 'lucide-react';

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Home' },
  { href: '/search', icon: Search, label: 'Search' },
  { href: '/bookings', icon: Calendar, label: 'Bookings' },
  { href: '/profile', icon: User, label: 'Profile' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/97 backdrop-blur-xl border-t border-gray-6/10 pb-safe pt-2 px-1 z-50">
      <div className="flex items-start justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-colors flex-1
                ${isActive ? 'text-orange' : 'text-gray-4'}
              `}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
