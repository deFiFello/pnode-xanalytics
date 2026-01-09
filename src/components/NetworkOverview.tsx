'use client';

import { useState, useEffect } from 'react';

interface NetworkStats {
  activeNodes: number;
  totalCredits: number;
  xandPrice: number;
  priceChange: number;
  marketCap: number;
  epoch: number;
  // pRPC stats
  totalStorage: string;
  totalStorageUsed: string;
  avgUptime: string;
  avgActivityRate: string;
  latestVersion: string | null;
  onLatestVersion: number;
  prpcSource: string;
  countryCount: number;
}

export function NetworkOverview() {
  const [stats, setStats] = useState<NetworkStats>({
    activeNodes: 0,
    totalCredits: 0,
    xandPrice: 0,
    priceChange: 0,
    marketCap: 0,
    epoch: 0,
    totalStorage: '—',
    totalStorageUsed: '—',
    avgUptime: '—',
    avgActivityRate: '—',
    latestVersion: null,
    onLatestVersion: 0,
    prpcSource: 'loading',
    countryCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        // Default to mainnet
        const nodesRes = await fetch('/api/pnodes?network=mainnet');
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
          // pRPC stats
          totalStorage: nodesData.stats?.totalStorageFormatted || '—',
          totalStorageUsed: nodesData.stats?.totalStorageUsedFormatted || '—',
          avgUptime: nodesData.stats?.avgUptimeFormatted || '—',
          avgActivityRate: nodesData.stats?.avgActivityRateFormatted || '—',
          latestVersion: nodesData.stats?.latestVersion || null,
          onLatestVersion: nodesData.stats?.onLatestVersion || 0,
          prpcSource: nodesData.stats?.prpcSource || 'unavailable',
          countryCount: nodesData.stats?.countryCount || 0,
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
    <div className="border border-purple-500/15 bg-[#080808]">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-purple-500/10">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-[-0.02em] mb-2">
              Pnode Xanalytics
            </h1>
            <p className="text-sm md:text-base text-zinc-400 max-w-xl">
              Analytics dashboard for Xandeum's pNode storage network. Stake XAND. Earn SOL.
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <a
              href="https://docs.xandeum.network"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-xs text-zinc-400 border border-purple-500/20 hover:border-purple-500/40 hover:text-white transition-colors"
              style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}
            >
              Docs
            </a>
            <a
              href="https://discord.com/invite/mGAxAuwnR9"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-xs text-white bg-purple-600 hover:bg-purple-500 transition-colors"
              style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}
            >
              Join Discord
            </a>
          </div>
        </div>
      </div>

      {/* Main Stats - Two Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-purple-500/10">
        {/* Left: Network Stats */}
        <div className="bg-[#080808] p-4 md:p-5">
          <div className="flex items-center gap-2 mb-3">
            <p className="text-[10px] uppercase tracking-wider text-purple-400">Network</p>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-[9px] text-emerald-400 uppercase">Live</span>
            </span>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {/* pNodes */}
            <div>
              {loading ? (
                <div className="h-7 w-12 bg-zinc-900 animate-pulse" />
              ) : (
                <p className="text-xl md:text-2xl font-mono font-bold text-white">{stats.activeNodes}</p>
              )}
              <p className="text-[10px] text-zinc-500 mt-0.5">pNodes</p>
            </div>

            {/* Storage */}
            <div>
              {loading ? (
                <div className="h-7 w-16 bg-zinc-900 animate-pulse" />
              ) : (
                <p className="text-xl md:text-2xl font-mono font-bold text-cyan-400">{stats.totalStorage}</p>
              )}
              <p className="text-[10px] text-zinc-500 mt-0.5">Storage</p>
            </div>

            {/* Uptime */}
            <div>
              {loading ? (
                <div className="h-7 w-12 bg-zinc-900 animate-pulse" />
              ) : (
                <p className="text-xl md:text-2xl font-mono font-bold text-emerald-400">{stats.avgUptime}</p>
              )}
              <p className="text-[10px] text-zinc-500 mt-0.5">Avg Uptime</p>
            </div>
          </div>

          {/* Epoch Info */}
          <div className="mt-4 pt-3 border-t border-purple-500/10">
            <p className="text-xs text-zinc-500">
              Epoch <span className="text-white font-mono">{stats.epoch}</span>
              <span className="text-zinc-600 mx-2">•</span>
              Rewards every ~2 days
              {stats.countryCount > 0 && (
                <>
                  <span className="text-zinc-600 mx-2">•</span>
                  <span className="text-zinc-400">{stats.countryCount} countries</span>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Right: Token Stats */}
        <div className="bg-[#080808] p-4 md:p-5">
          <p className="text-[10px] uppercase tracking-wider text-purple-400 mb-3">XAND Token</p>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Price */}
            <div>
              {loading ? (
                <div className="h-7 w-20 bg-zinc-900 animate-pulse" />
              ) : (
                <p className="text-xl md:text-2xl font-mono font-bold text-white">${stats.xandPrice.toFixed(4)}</p>
              )}
              <p className={`text-xs font-mono mt-0.5 ${stats.priceChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {stats.priceChange >= 0 ? '↑' : '↓'} {Math.abs(stats.priceChange).toFixed(2)}% 24h
              </p>
            </div>

            {/* Market Cap */}
            <div>
              {loading ? (
                <div className="h-7 w-16 bg-zinc-900 animate-pulse" />
              ) : (
                <p className="text-xl md:text-2xl font-mono font-bold text-white">${formatNumber(stats.marketCap)}</p>
              )}
              <p className="text-[10px] text-zinc-500 mt-0.5">Market Cap</p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Source - Mobile */}
      <div className="md:hidden p-3 border-t border-purple-500/10 flex items-center justify-between text-[10px] text-zinc-600">
        <span>
          {stats.prpcSource === 'live' && <span className="text-emerald-400">● Live data</span>}
          {stats.prpcSource !== 'live' && <span>Credits API</span>}
        </span>
        <span>Real-time updates</span>
      </div>
    </div>
  );
}
