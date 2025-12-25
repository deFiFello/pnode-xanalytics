'use client';

import { useState, useEffect } from 'react';
import { Database, TrendingUp, Coins, Clock, ExternalLink } from 'lucide-react';

interface NetworkStats {
  activeNodes: number;
  totalCredits: number;
  xandPrice: number;
  priceChange: number;
  marketCap: number;
  epoch: number;
}

export function NetworkOverview() {
  const [stats, setStats] = useState<NetworkStats>({
    activeNodes: 0,
    totalCredits: 0,
    xandPrice: 0,
    priceChange: 0,
    marketCap: 0,
    epoch: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const nodesRes = await fetch('/api/pnodes');
        const nodesData = await nodesRes.json();
        
        const priceRes = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=xandeum&vs_currencies=usd&include_24hr_change=true&include_market_cap=true'
        );
        const priceData = await priceRes.json();

        const totalCredits = nodesData.nodes?.reduce((sum: number, n: any) => sum + n.credits, 0) || 0;

        setStats({
          activeNodes: nodesData.count || 0,
          totalCredits,
          xandPrice: priceData.xandeum?.usd || 0,
          priceChange: priceData.xandeum?.usd_24h_change || 0,
          marketCap: priceData.xandeum?.usd_market_cap || 0,
          epoch: nodesData.epoch || 0,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const formatMarketCap = (cap: number) => {
    if (cap >= 1e9) return `$${(cap / 1e9).toFixed(2)}B`;
    if (cap >= 1e6) return `$${(cap / 1e6).toFixed(2)}M`;
    return `$${cap.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold text-zinc-100">
          Pnode Xanalytics
        </h1>
        <p className="text-zinc-400 max-w-2xl mx-auto">
          Explore the Xandeum pNode network — decentralized storage for Solana programs
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Active pNodes */}
        <div className="bg-zinc-900/50 border border-violet-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Database className="h-4 w-4 text-violet-400" />
            <p className="text-xs text-violet-400 uppercase tracking-wide">pNodes</p>
          </div>
          {loading ? (
            <div className="h-7 bg-zinc-800 rounded w-16 animate-pulse" />
          ) : (
            <p className="text-2xl font-bold text-zinc-100">{stats.activeNodes}</p>
          )}
          <p className="text-xs text-zinc-500">Active on network</p>
        </div>

        {/* Total Credits */}
        <div className="bg-zinc-900/50 border border-cyan-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-4 w-4 text-cyan-400" />
            <p className="text-xs text-cyan-400 uppercase tracking-wide">Credits</p>
          </div>
          {loading ? (
            <div className="h-7 bg-zinc-800 rounded w-20 animate-pulse" />
          ) : (
            <p className="text-2xl font-bold text-cyan-400">
              {(stats.totalCredits / 1000000).toFixed(1)}M
            </p>
          )}
          <p className="text-xs text-zinc-500">Network activity</p>
        </div>

        {/* XAND Price */}
        <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Coins className="h-4 w-4 text-zinc-500" />
            <p className="text-xs text-zinc-500 uppercase tracking-wide">XAND</p>
          </div>
          {loading ? (
            <div className="h-7 bg-zinc-800 rounded w-20 animate-pulse" />
          ) : (
            <p className="text-2xl font-bold text-zinc-100">
              ${stats.xandPrice.toFixed(4)}
            </p>
          )}
          <p className={`text-xs ${stats.priceChange >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
            {stats.priceChange >= 0 ? '+' : ''}{stats.priceChange.toFixed(2)}%
          </p>
        </div>

        {/* Market Cap */}
        <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Coins className="h-4 w-4 text-zinc-500" />
            <p className="text-xs text-zinc-500 uppercase tracking-wide">Market Cap</p>
          </div>
          {loading ? (
            <div className="h-7 bg-zinc-800 rounded w-20 animate-pulse" />
          ) : (
            <p className="text-2xl font-bold text-zinc-100">
              {formatMarketCap(stats.marketCap)}
            </p>
          )}
          <p className="text-xs text-zinc-500">Fully diluted</p>
        </div>

        {/* Epoch */}
        <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-4 w-4 text-zinc-500" />
            <p className="text-xs text-zinc-500 uppercase tracking-wide">Epoch</p>
          </div>
          {loading ? (
            <div className="h-7 bg-zinc-800 rounded w-16 animate-pulse" />
          ) : (
            <p className="text-2xl font-bold text-zinc-100">{stats.epoch}</p>
          )}
          <p className="text-xs text-zinc-500">Current</p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="flex flex-wrap justify-center gap-3">
        <a
          href="https://docs.xandeum.network"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 hover:bg-zinc-700/50 border border-zinc-700/50 rounded-lg text-sm text-zinc-300 transition-colors"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Docs
        </a>
        <a
          href="https://discord.gg/xandeum"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-lg text-sm text-white font-medium transition-colors"
        >
          Join Discord
        </a>
        <a
          href="https://explorer.xandeum.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 hover:bg-zinc-700/50 border border-zinc-700/50 rounded-lg text-sm text-zinc-300 transition-colors"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Explorer
        </a>
      </div>
    </div>
  );
}
