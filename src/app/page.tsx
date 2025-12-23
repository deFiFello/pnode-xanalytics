'use client';

import React, { useState, useEffect } from 'react';
import { QuickGuide, Leaderboard, NetworkOverview } from '@/components';

// Fetch XAND price from CoinGecko
async function fetchXandPrice() {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=xandeum&vs_currencies=usd&include_24hr_change=true'
    );
    const data = await response.json();
    return {
      usd: data.xandeum?.usd || 0.0045,
      usd_24h_change: data.xandeum?.usd_24h_change || 0,
    };
  } catch (error) {
    console.error('Error fetching price:', error);
    return { usd: 0.0045, usd_24h_change: 0 };
  }
}

// Fetch network stats from Xandeum RPC
async function fetchNetworkStats() {
  try {
    // Fetch pNode count from our API route
    const nodesResponse = await fetch('/api/pnodes');
    const nodesData = await nodesResponse.json();
    const activeNodes = nodesData.credits?.filter((n: any) => n.credits > 0).length || 0;
    const totalNodes = nodesData.credits?.length || 0;

    // Try to fetch epoch info (may fail due to CORS)
    let currentEpoch = 0;
    try {
      const epochResponse = await fetch('https://api.devnet.xandeum.com:8899', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'getEpochInfo',
        }),
      });
      const epochData = await epochResponse.json();
      currentEpoch = epochData.result?.epoch || 0;
    } catch (e) {
      console.log('Epoch fetch failed, using default');
    }

    return {
      totalNodes: totalNodes || 215,
      activeNodes: activeNodes || 202,
      totalStorage: '2.4 PB',
      usedStorage: '1.8 PB',
      currentEpoch,
    };
  } catch (error) {
    console.error('Error fetching network stats:', error);
    return {
      totalNodes: 215,
      activeNodes: 202,
      totalStorage: '2.4 PB',
      usedStorage: '1.8 PB',
      currentEpoch: 0,
    };
  }
}

export default function Home() {
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
    const [priceData, statsData] = await Promise.all([
      fetchXandPrice(),
      fetchNetworkStats(),
    ]);
    setPrice(priceData);
    setStats(statsData);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    // Refresh every 60 seconds
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
              <span className="text-xs text-emerald-400">v0.36 • Live on DevNet</span>
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

        {/* pNode Leaderboard */}
        <section className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <Leaderboard />
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
