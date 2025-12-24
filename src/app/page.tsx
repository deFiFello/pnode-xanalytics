'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Leaderboard, NetworkOverview, ComparisonTool, QuickGuide, Footer } from '@/components';
import { PNode } from '@/types';

async function fetchXandPrice() {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=xandeum&vs_currencies=usd&include_24hr_change=true'
    );
    const data = await response.json();
    return {
      usd: data.xandeum?.usd || 0.0024,
      usd_24h_change: data.xandeum?.usd_24h_change || 0,
    };
  } catch (error) {
    console.error('Error fetching price:', error);
    return { usd: 0.0024, usd_24h_change: -5.27 };
  }
}

async function fetchEpoch() {
  try {
    const response = await fetch('/api/pnodes');
    const data = await response.json();
    return data.epoch || 0;
  } catch {
    return 0;
  }
}

export default function Home() {
  const [nodes, setNodes] = useState<PNode[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [userStake, setUserStake] = useState(10000);
  const [stats, setStats] = useState({
    totalNodes: 0,
    activeNodes: 0,
    currentEpoch: 0,
  });
  const [price, setPrice] = useState({ usd: 0.0024, usd_24h_change: 0 });
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [priceData, epoch] = await Promise.all([
      fetchXandPrice(),
      fetchEpoch(),
    ]);
    setPrice(priceData);
    setStats(prev => ({ ...prev, currentEpoch: epoch }));
    setLoading(false);
  }, []);

  const handleNodesLoaded = useCallback((loadedNodes: PNode[]) => {
    setNodes(loadedNodes);
    setStats(prev => ({
      ...prev,
      totalNodes: loadedNodes.length,
      activeNodes: loadedNodes.filter(n => n.isOnline).length,
    }));
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return (
    <main className="min-h-screen bg-zinc-950">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-zinc-100">Pnode Xanalytics</h1>
              <p className="text-zinc-500">Explore STOINC reward pools and find your best opportunity</p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="https://raydium.io/swap/?inputMint=sol&outputMint=XANDuUoVoUqniKkpcKhrxmvYJybpJvUxJLr21Gaj3Hx"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Buy XAND
              </a>
              <div className="px-3 py-2 bg-zinc-800/50 border border-zinc-700/50 rounded-lg">
                <span className="text-xs text-zinc-400">DevNet</span>
              </div>
            </div>
          </div>
        </header>

        {/* Network Overview */}
        <section className="mb-6">
          <NetworkOverview 
            stats={stats} 
            price={price} 
            loading={loading}
            onRefresh={fetchData}
          />
        </section>

        {/* Quick Guide */}
        <section className="mb-6">
          <QuickGuide />
        </section>

        {/* Comparison Tool */}
        {selectedIds.length > 0 && (
          <section className="mb-6">
            <ComparisonTool
              nodes={nodes}
              selectedIds={selectedIds}
              onRemove={(id) => setSelectedIds(prev => prev.filter(i => i !== id))}
              onClear={() => setSelectedIds([])}
              userStake={userStake}
            />
          </section>
        )}

        {/* Leaderboard */}
        <section className="mb-6">
          <Leaderboard
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            onNodesLoaded={handleNodesLoaded}
            userStake={userStake}
          />
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </main>
  );
}
