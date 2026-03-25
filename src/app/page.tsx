import Link from 'next/link';
import { ArrowRight, Building2, Car, CheckCircle2, Search, ShieldCheck } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-1">
      <section className="bg-gradient-to-b from-orange to-orange-2 px-6 pt-10 pb-14 rounded-b-[44px]">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 text-white text-xs font-semibold mb-5">
            <CheckCircle2 size={14} />
            Verified parking across Sri Lanka
          </div>
          <h1 className="text-4xl md:text-5xl font-black leading-tight text-white">
            Park smarter with ParkShare
          </h1>
          <p className="text-white/85 mt-4 text-base md:text-lg max-w-xl">
            Find trusted parking spaces, book quickly, and manage every trip in one app.
          </p>
        </div>
      </section>

      <main className="max-w-3xl mx-auto px-6 -mt-8 pb-10">
        <div className="bg-white rounded-3xl p-5 shadow-card">
          <p className="text-sm font-semibold text-gray-5 mb-4">Get started</p>
          <div className="grid sm:grid-cols-2 gap-3">
            <Link
              href="/login"
              className="rounded-2xl bg-orange text-white px-4 py-4 font-semibold flex items-center justify-between"
            >
              Continue as User
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/register"
              className="rounded-2xl border border-gray-2 px-4 py-4 font-semibold text-gray-7 flex items-center justify-between"
            >
              Create Account
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/admin/login"
              className="rounded-2xl border border-gray-2 px-4 py-4 font-semibold text-gray-7 flex items-center justify-between"
            >
              Admin Portal
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/search"
              className="rounded-2xl border border-gray-2 px-4 py-4 font-semibold text-gray-7 flex items-center justify-between"
            >
              Browse as Guest
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        <div className="mt-5 bg-white rounded-3xl p-5 shadow-card">
          <h2 className="font-bold text-gray-7 mb-3">How it works</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="rounded-2xl bg-gray-1 p-4">
              <Search size={18} className="text-orange mb-2" />
              <p className="font-semibold text-gray-7">Find</p>
              <p className="text-xs text-gray-4 mt-1">Search parking by area, price, and availability.</p>
            </div>
            <div className="rounded-2xl bg-gray-1 p-4">
              <Car size={18} className="text-orange mb-2" />
              <p className="font-semibold text-gray-7">Book</p>
              <p className="text-xs text-gray-4 mt-1">Reserve your spot in seconds and avoid last-minute stress.</p>
            </div>
            <div className="rounded-2xl bg-gray-1 p-4">
              <Building2 size={18} className="text-orange mb-2" />
              <p className="font-semibold text-gray-7">Park</p>
              <p className="text-xs text-gray-4 mt-1">Arrive confidently with clear location and booking details.</p>
            </div>
          </div>
        </div>

        <div className="mt-5 bg-white rounded-3xl p-5 shadow-card">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck size={18} className="text-green" />
            <h2 className="font-bold text-gray-7">Why ParkShare</h2>
          </div>
          <ul className="text-sm text-gray-5 space-y-2">
            <li>- Verified spaces and transparent pricing</li>
            <li>- Fast booking flow with wallet support</li>
            <li>- Driver, owner, and admin workflows in one app</li>
          </ul>
        </div>

        <div className="mt-6 text-center text-sm text-gray-4">
          <p>
            Already have an account?{' '}
            <Link href="/login" className="text-orange font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
