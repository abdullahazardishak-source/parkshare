'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Car, Wallet, Settings, Bell, HelpCircle, LogOut, ChevronRight, Star, Shield, MapPin } from 'lucide-react';
import { Header, BottomNav } from '@/components/layout';
import { Card, Button } from '@/components/ui';
import { useAuthStore } from '@/lib/store';

export default function ProfilePage() {
  const router = useRouter();
  const lang: string = 'en';
  
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const menuItems = [
    { icon: User, label: lang === 'si' ? 'පැතිකඩ' : lang === 'ta' ? 'சுயவிவரம்' : 'My Profile', href: '/profile/edit' },
    { icon: Car, label: lang === 'si' ? 'මගේ වාහන' : lang === 'ta' ? 'என் வாகனம்' : 'My Vehicles', href: '/profile/vehicles' },
    { icon: Wallet, label: 'Wallet', href: '/wallet', badge: 'Rs. 5,000' },
    { icon: Star, label: lang === 'si' ? ' my reviews' : lang === 'ta' ? 'என் மதிப்புரைகள்' : 'My Reviews', href: '/profile/reviews' },
    { icon: Bell, label: lang === 'si' ? 'දැනුම්දීම්' : lang === 'ta' ? 'அறிவிப்புகள்' : 'Notifications', href: '/notifications' },
    { icon: Shield, label: lang === 'si' ? 'ආරක්‍ෂාව' : lang === 'ta' ? 'பாதுகாப்பு' : 'Security', href: '/profile/security' },
    { icon: HelpCircle, label: lang === 'si' ? 'උදව්' : lang === 'ta' ? 'உதவி' : 'Help & Support', href: '/help' },
    { icon: Settings, label: lang === 'si' ? 'සැකසුම්' : lang === 'ta' ? 'அமைப்புகள்' : 'Settings', href: '/settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-1 pb-20">
      <Header title={lang === 'si' ? 'පැතිකඩ' : lang === 'ta' ? 'சுயவிவரம்' : 'Profile'} />
      
      {/* Profile Header */}
      <div className="bg-gradient-to-b from-orange to-orange-2 px-5 pt-4 pb-8 rounded-b-[40px]">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-3xl">
            {user?.full_name?.charAt(0) || 'D'}
          </div>
          <div className="text-white">
            <h1 className="text-xl font-bold">{user?.full_name || 'Demo User'}</h1>
            <p className="text-white/80 text-sm">{user?.email || 'demo@parkshare.lk'}</p>
            <p className="text-white/80 text-sm">+94 77 123 4567</p>
            <span className="inline-block mt-2 px-3 py-1 bg-white/20 rounded-full text-xs font-medium">
              {user?.role === 'owner' ? 'Space Owner' : user?.role === 'admin' ? 'Admin' : 'Driver'}
            </span>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="flex gap-3 mt-6">
          <Link href="/wallet" className="flex-1 bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
            <p className="text-white font-bold text-lg">Rs. {(user?.wallet_balance || 5000).toLocaleString()}</p>
            <p className="text-white/70 text-xs">{lang === 'si' ? ' Wallet' : lang === 'ta' ? ' Wallet' : 'Balance'}</p>
          </Link>
          <Link href="/bookings" className="flex-1 bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
            <p className="text-white font-bold text-lg">12</p>
            <p className="text-white/70 text-xs">{lang === 'si' ? ' bookings' : lang === 'ta' ? 'முன்பதிவுகள்' : 'Bookings'}</p>
          </Link>
          <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
            <p className="text-white font-bold text-lg">4.8</p>
            <p className="text-white/70 text-xs">{lang === 'si' ? 'ශ්‍රේණිය' : lang === 'ta' ? 'மதிப்பீடு' : 'Rating'}</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="p-4 space-y-3">
        {menuItems.map((item, index) => (
          <Link key={index} href={item.href}>
            <Card className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-1 rounded-xl flex items-center justify-center">
                <item.icon size={20} className="text-gray-5" />
              </div>
              <span className="flex-1 font-medium text-gray-7">{item.label}</span>
              {item.badge && (
                <span className="text-sm font-semibold text-orange">{item.badge}</span>
              )}
              <ChevronRight size={20} className="text-gray-3" />
            </Card>
          </Link>
        ))}
        
        {/* Become Owner */}
        {user?.role === 'driver' && (
          <Link href="/owner/register">
            <Card className="flex items-center gap-4 border-2 border-orange/30 bg-orange-pale/30">
              <div className="w-10 h-10 bg-orange rounded-xl flex items-center justify-center">
                <MapPin size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-orange">
                  {lang === 'si' ? 'ඉඩ හිමිකරුවෙකු වන්න' : lang === 'ta' ? 'இட உரிமையாளராக ஆகுங்கள்' : 'Become a Space Owner'}
                </p>
                <p className="text-xs text-gray-4">
                  {lang === 'si' ? 'ඔබේ ගාල් ඉඩ ලැයිස්තු කර ආදායම් ලබන්න' : lang === 'ta' ? 'உங்கள் நிறுத்து இடத்தை பட்டியலிட்டு வருமானம் பெறுங்கள்' : 'List your parking space and earn'}
                </p>
              </div>
              <ChevronRight size={20} className="text-orange" />
            </Card>
          </Link>
        )}
        
        {/* Logout */}
        <button onClick={() => setShowLogoutConfirm(true)}>
          <Card className="flex items-center gap-4">
            <div className="w-10 h-10 bg-red-pale rounded-xl flex items-center justify-center">
              <LogOut size={20} className="text-red" />
            </div>
            <span className="flex-1 font-medium text-red">
              {lang === 'si' ? 'පිටවීම' : lang === 'ta' ? 'வெளியேறு' : 'Log Out'}
            </span>
          </Card>
        </button>
      </div>

      {/* Logout Confirmation */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 animate-[fadeIn_0.2s]">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm animate-[pop_0.25s_cubic-bezier(0.32,0.72,0,1)]">
            <h3 className="text-lg font-bold text-gray-7 mb-2">
              {lang === 'si' ? 'පිටවීමට විශ්මයයි?' : lang === 'ta' ? 'வெளியேற விரும்புகிறீர்களா?' : 'Log Out?'}
            </h3>
            <p className="text-gray-4 text-sm mb-6">
              {lang === 'si' ? 'ඔබට නැවත ඇතුල් විය යුතු වනු ඇත' : lang === 'ta' ? 'மீண்டும் உள்நுழைய வேண்டி வரும்' : 'You will need to sign in again'}
            </p>
            <div className="flex gap-3">
              <Button variant="secondary" fullWidth onClick={() => setShowLogoutConfirm(false)}>
                {lang === 'si' ? 'ඉන්න' : lang === 'ta' ? 'இரு' : 'Cancel'}
              </Button>
              <Button variant="red" fullWidth onClick={handleLogout}>
                {lang === 'si' ? 'පිටවෙන්න' : lang === 'ta' ? 'வெளியேறு' : 'Log Out'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
