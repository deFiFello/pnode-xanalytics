'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Leaderboard, NetworkOverview, ComparisonTool, StakingInfo, Footer } from '@/components';
import { PNode } from '@/types';
import { ChevronDown, ChevronUp } from 'lucide-react';

async function fetchXandPrice() {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=xandeum&vs_currencies=usd&include_24hr_change=true&include_market_cap=true'
    );
    const data = await response.json();
    return {
      usd: data.xandeum?.usd || 0.0024,
      usd_24h_change: data.xandeum?.usd_24h_change || 0,
      market_cap: data.xandeum?.usd_market_cap || 2400000,
    };
  } catch (error) {
    console.error('Error fetching price:', error);
    return { usd: 0.0024, usd_24h_change: -1.4, market_cap: 2400000 };
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
  const [showStakingInfo, setShowStakingInfo] = useState(false);
  const [expandedNodeId, setExpandedNodeId] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalNodes: 0,
    activeNodes: 0,
    currentEpoch: 0,
  });
  const [price, setPrice] = useState({ usd: 0.0024, usd_24h_change: 0, market_cap: 2400000 });
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

  // Handle selecting a node from comparison tool - scroll to leaderboard and expand
  const handleComparisonSelect = useCallback((nodeId: string) => {
    setExpandedNodeId(nodeId);
    // Scroll to leaderboard section
    const leaderboard = document.getElementById('leaderboard-section');
    if (leaderboard) {
      leaderboard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
              <h1 className="text-2xl font-bold text-zinc-100">pNode Xanalytics</h1>
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
              <a
                href="https://stakexand.xandeum.network"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Stake Now
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

        {/* Staking Info - Collapsible */}
        <section className="mb-6">
          <button
            onClick={() => setShowStakingInfo(!showStakingInfo)}
            className="w-full bg-zinc-900/50 border border-zinc-800/50 rounded-xl px-5 py-4 flex items-center justify-between hover:bg-zinc-800/30 transition-colors"
          >
            <div className="text-left">
              <h3 className="font-medium text-zinc-100">New to pNode Staking?</h3>
              <p className="text-sm text-zinc-500">Learn how it works, the risks, and what to expect</p>
            </div>
            {showStakingInfo ? (
              <ChevronUp className="h-5 w-5 text-zinc-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-zinc-500" />
            )}
          </button>
          {showStakingInfo && (
            <div className="mt-4">
              <StakingInfo />
            </div>
          )}
        </section>

        {/* Comparison Tool */}
        {selectedIds.length > 0 && (
          <section className="mb-6">
            <ComparisonTool
              nodes={nodes}
              selectedIds={selectedIds}
              onRemove={(id) => setSelectedIds(prev => prev.filter(i => i !== id))}
              onClear={() => setSelectedIds([])}
              onSelect={handleComparisonSelect}
              userStake={10000}
            />
          </section>
        )}

        {/* Leaderboard */}
        <section id="leaderboard-section" className="mb-6">
          <Leaderboard
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            onNodesLoaded={handleNodesLoaded}
            userStake={10000}
            expandedNodeId={expandedNodeId}
            onExpandedChange={setExpandedNodeId}
          />
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </main>
  );
}
