'use client';

import { useState } from 'react';
import { NetworkOverview, Leaderboard, ComparisonTool, Footer } from '@/components';

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
    <main className="min-h-screen bg-black">
      <div className="max-w-6xl mx-auto px-3 md:px-4 py-4 md:py-8 space-y-4 md:space-y-6">
        {/* Network Stats */}
        <NetworkOverview />

        {/* Comparison Tool (shows when nodes selected) */}
        <ComparisonTool
          selectedIds={selectedIds}
          onRemove={(id) => setSelectedIds(prev => prev.filter(i => i !== id))}
          onClear={() => setSelectedIds([])}
        />

        {/* Main Leaderboard (includes education tabs) */}
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
