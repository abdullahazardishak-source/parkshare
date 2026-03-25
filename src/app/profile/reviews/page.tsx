'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Star } from 'lucide-react';
import { BottomNav } from '@/components/layout';
import { Card, Badge } from '@/components/ui';

const demoReviews = [
  { id: 'r1', title: 'Colombo City Centre', rating: 5, body: 'Easy access and very secure.', time: '2w' },
  { id: 'r2', title: 'Galle Face Hotel', rating: 4, body: 'Great location, slightly busy.', time: '1mo' },
];

export default function ProfileReviewsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-1 pb-20">
      <header className="sticky top-0 z-50 bg-gray-1/92 backdrop-blur-xl border-b border-gray-6/10 px-5 h-12 flex items-center gap-3">
        <button
          type="button"
          onClick={() => {
            if (typeof window !== 'undefined' && window.history.length > 1) router.back();
            else router.push('/profile');
          }}
          className="p-2 -ml-2 rounded-xl text-gray-7"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-bold text-base text-gray-7">My reviews</h1>
      </header>

      <div className="px-5 py-5 space-y-3">
        {demoReviews.map((r) => (
          <Card key={r.id}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold text-gray-7 truncate">{r.title}</p>
                <p className="text-sm text-gray-4 mt-1">{r.body}</p>
              </div>
              <Badge variant="orange">{r.time}</Badge>
            </div>
            <div className="flex items-center gap-1 mt-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={i < r.rating ? 'text-yellow fill-yellow' : 'text-gray-3'}
                />
              ))}
            </div>
          </Card>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}

