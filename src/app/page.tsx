'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { QuickGuide, Leaderboard, NetworkOverview, ComparisonTool } from '@/components';
import { PNode } from '@/types';

// Fetch XAND price from CoinGecko
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
    return { usd: 0.0024, usd_24h_change: 0 };
  }
}

export default function Home() {
  const [nodes, setNodes] = useState<PNode[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [stats, setStats] = useState({
    totalNodes: 0,
    activeNodes: 0,
    totalStorage: '2.4 PB',
    usedStorage: '1.8 PB',
    currentEpoch: 0,
  });
  const [price, setPrice] = useState({ usd: 0, usd_24h_change: 0 });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const priceData = await fetchXandPrice();
    setPrice(priceData);
    setLoading(false);
  };

  const handleNodesLoaded = useCallback((loadedNodes: PNode[]) => {
    setNodes(loadedNodes);
    setStats(prev => ({
      ...prev,
      totalNodes: loadedNodes.length,
      activeNodes: loadedNodes.filter(n => n.isOnline).length,
    }));
  }, []);

  const handleClearSelection = () => {
    setSelectedIds([]);
  };

  const handleRemoveFromSelection = (id: string) => {
    setSelectedIds(prev => prev.filter(i => i !== id));
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-zinc-100">Pnode Xanalytics</h1>
            <p className="text-sm text-zinc-500">Find the best pNode for your XAND delegation</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
              <span className="text-xs text-emerald-400">v0.37 • Live on DevNet</span>
            </div>
          </div>
        </header>

        {/* Network Overview */}
        <section className="animate-fade-in">
          <NetworkOverview 
            stats={stats} 
            price={price} 
            loading={loading}
            onRefresh={fetchData}
          />
        </section>

        {/* Quick Guide - Educational Content */}
        <section className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <QuickGuide />
        </section>

        {/* Comparison Tool - Shows when nodes selected */}
        {selectedIds.length > 0 && (
          <section className="animate-fade-in">
            <ComparisonTool
              nodes={nodes}
              selectedIds={selectedIds}
              onRemove={handleRemoveFromSelection}
              onClear={handleClearSelection}
            />
          </section>
        )}

        {/* pNode Leaderboard */}
        <section className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <Leaderboard
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            onNodesLoaded={handleNodesLoaded}
          />
        </section>

        {/* Footer */}
        <footer className="pt-8 pb-4 border-t border-zinc-800 text-center">
          <p className="text-xs text-zinc-600">
            Pnode Xanalytics • Built for the Xandeum Community • 
            <a 
              href="https://github.com/deFiFello/pnode-xanalytics" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-violet-500 hover:text-violet-400 ml-1"
            >
              GitHub
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
