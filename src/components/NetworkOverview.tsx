'use client';

import { useState, useEffect } from 'react';

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

        setStats({
          activeNodes: nodesData.count || 0,
          totalCredits: nodesData.totalCredits || 0,
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

  const formatNumber = (num: number) => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toLocaleString();
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Pnode Xanalytics
          </h1>
          <p className="text-xs md:text-sm text-zinc-500">
            Earn Solana for strengthening Xandeum's Storage Network
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href="https://docs.xandeum.network"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 text-xs text-zinc-400 border border-purple-500/20 hover:border-purple-500/40 hover:text-white transition-colors"
            style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}
          >
            Docs
          </a>
          <a
            href="https://discord.gg/xandeum"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 text-xs text-white bg-purple-600 hover:bg-purple-500 transition-colors"
            style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}
          >
            Discord
          </a>
        </div>
      </div>

      {/* Stats Grid - Responsive */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-[1px] bg-purple-500/10">
        {/* pNodes */}
        <div className="bg-black p-3 md:p-4">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-[10px] uppercase tracking-wider text-zinc-600">pNodes</p>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-[8px] text-emerald-400">LIVE</span>
            </span>
          </div>
          {loading ? (
            <div className="h-6 w-12 bg-zinc-900 animate-pulse" />
          ) : (
            <p className="text-lg md:text-xl font-mono font-bold text-white">{stats.activeNodes}</p>
          )}
          <p className="text-[10px] text-purple-400 mt-1">Active</p>
        </div>

        {/* Credits */}
        <div className="bg-black p-3 md:p-4">
          <p className="text-[10px] uppercase tracking-wider text-zinc-600 mb-1">Credits</p>
          {loading ? (
            <div className="h-6 w-16 bg-zinc-900 animate-pulse" />
          ) : (
            <p className="text-lg md:text-xl font-mono font-bold text-cyan-400">{formatNumber(stats.totalCredits)}</p>
          )}
          <p className="text-[10px] text-zinc-500 mt-1">Network total</p>
        </div>

        {/* XAND Price */}
        <div className="bg-black p-3 md:p-4">
          <p className="text-[10px] uppercase tracking-wider text-zinc-600 mb-1">XAND</p>
          {loading ? (
            <div className="h-6 w-16 bg-zinc-900 animate-pulse" />
          ) : (
            <p className="text-lg md:text-xl font-mono font-bold text-white">${stats.xandPrice.toFixed(4)}</p>
          )}
          <p className={`text-[10px] mt-1 font-mono ${stats.priceChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {stats.priceChange >= 0 ? '+' : ''}{stats.priceChange.toFixed(2)}%
          </p>
        </div>

        {/* Market Cap */}
        <div className="bg-black p-3 md:p-4">
          <p className="text-[10px] uppercase tracking-wider text-zinc-600 mb-1">Mkt Cap</p>
          {loading ? (
            <div className="h-6 w-16 bg-zinc-900 animate-pulse" />
          ) : (
            <p className="text-lg md:text-xl font-mono font-bold text-white">${formatNumber(stats.marketCap)}</p>
          )}
          <p className="text-[10px] text-zinc-500 mt-1">Circulating</p>
        </div>

        {/* Epoch - spans 2 cols on mobile to fill row */}
        <div className="bg-black p-3 md:p-4 col-span-2 md:col-span-1">
          <p className="text-[10px] uppercase tracking-wider text-zinc-600 mb-1">Epoch</p>
          {loading ? (
            <div className="h-6 w-12 bg-zinc-900 animate-pulse" />
          ) : (
            <p className="text-lg md:text-xl font-mono font-bold text-white">{stats.epoch}</p>
          )}
          <p className="text-[10px] text-zinc-500 mt-1">~2 days each</p>
        </div>
      </div>

      {/* Data Source - hidden on mobile, shown on md+ */}
      <div className="hidden md:flex items-center justify-between text-[10px] text-zinc-600 px-1">
        <span>Data: podcredits.xandeum.network • CoinGecko • DevNet RPC</span>
        <span>Updated in real-time</span>
      </div>
    </div>
  );
}
