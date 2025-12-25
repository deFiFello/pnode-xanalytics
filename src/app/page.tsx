'use client';

import { useState } from 'react';
import { NetworkOverview, StakingInfo, Leaderboard, ComparisonTool, Footer } from '@/components';

export default function Home() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(i => i !== id);
      }
      if (prev.length >= 5) {
        return prev;
      }
      return [...prev, id];
    });
  };

  return (
    <main className="min-h-screen bg-zinc-950">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Network Stats */}
        <NetworkOverview />

        {/* Educational Content */}
        <StakingInfo />

        {/* Comparison Tool (shows when nodes selected) */}
        <ComparisonTool
          selectedIds={selectedIds}
          onRemove={(id) => setSelectedIds(prev => prev.filter(i => i !== id))}
          onClear={() => setSelectedIds([])}
        />

        {/* Main Leaderboard */}
        <Leaderboard
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
        />

        {/* Footer */}
        <Footer />
      </div>
    </main>
  );
}
