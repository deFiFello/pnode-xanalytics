'use client';

import { NetworkOverview, Leaderboard, Footer } from '@/components';

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <div className="max-w-6xl mx-auto px-3 md:px-4 py-4 md:py-8 space-y-4 md:space-y-6">
        {/* Network Stats */}
        <NetworkOverview />

        {/* Main Leaderboard (includes education tabs) */}
        <Leaderboard />

        {/* Footer */}
        <Footer />
      </div>
    </main>
  );
}
