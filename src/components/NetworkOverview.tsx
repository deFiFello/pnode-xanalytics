'use client';

import React from 'react';
import { TrendingUp, TrendingDown, RefreshCw, Database, Coins, Activity, Server, Calendar } from 'lucide-react';

interface NetworkOverviewProps {
  stats: {
    totalNodes: number;
    activeNodes: number;
    currentEpoch: number;
  };
  price: {
    usd: number;
    usd_24h_change: number;
    market_cap?: number;
  };
  loading?: boolean;
  onRefresh?: () => void;
}

export function NetworkOverview({ stats, price, loading, onRefresh }: NetworkOverviewProps) {
  const priceUp = price.usd_24h_change >= 0;
  const marketCap = price.market_cap || 2400000; // Fallback estimate

  return (
    <div className="space-y-4">
      {/* Main Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Active Pools */}
        <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Server className="h-4 w-4 text-zinc-500" />
            <p className="text-xs text-zinc-500 uppercase tracking-wide">Active Pools</p>
          </div>
          {loading ? (
            <div className="h-7 bg-zinc-800 rounded w-16 animate-pulse" />
          ) : (
            <p className="text-2xl font-bold text-zinc-100">{stats.activeNodes}</p>
          )}
          <p className="text-xs text-zinc-600">pNodes earning rewards</p>
        </div>

        {/* Network Storage */}
        <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Database className="h-4 w-4 text-zinc-500" />
            <p className="text-xs text-zinc-500 uppercase tracking-wide">Network Capacity</p>
          </div>
          {loading ? (
            <div className="h-7 bg-zinc-800 rounded w-20 animate-pulse" />
          ) : (
            <p className="text-2xl font-bold text-zinc-100">2.4 PB</p>
          )}
          <p className="text-xs text-zinc-500">
            Across {stats.activeNodes} active pNodes
          </p>
        </div>

        {/* XAND Price + Market Cap */}
        <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Coins className="h-4 w-4 text-zinc-500" />
            <p className="text-xs text-zinc-500 uppercase tracking-wide">XAND</p>
          </div>
          {loading ? (
            <div className="h-7 bg-zinc-800 rounded w-20 animate-pulse" />
          ) : (
            <p className="text-2xl font-bold text-zinc-100">${price.usd.toFixed(4)}</p>
          )}
          <p className={`text-xs flex items-center gap-1 ${priceUp ? 'text-emerald-500' : 'text-red-400'}`}>
            {priceUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {priceUp ? '+' : ''}{price.usd_24h_change.toFixed(2)}%
            <span className="text-zinc-600 ml-1">• ${(marketCap / 1000000).toFixed(1)}M cap</span>
          </p>
        </div>

        {/* Total Network Credits */}
        <div className="bg-zinc-900/50 border border-cyan-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="h-4 w-4 text-cyan-500" />
            <p className="text-xs text-cyan-500 uppercase tracking-wide">Network Activity</p>
          </div>
          {loading ? (
            <div className="h-7 bg-zinc-800 rounded w-20 animate-pulse" />
          ) : (
            <p className="text-2xl font-bold text-cyan-400">12.8M</p>
          )}
          <p className="text-xs text-zinc-500">Total credits earned</p>
        </div>

        {/* Network Age */}
        <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-zinc-500" />
              <p className="text-xs text-zinc-500 uppercase tracking-wide">Epoch</p>
            </div>
            {onRefresh && (
              <button 
                onClick={onRefresh}
                className="p-1 hover:bg-zinc-800 rounded transition-colors"
                disabled={loading}
              >
                <RefreshCw className={`h-3 w-3 text-zinc-500 ${loading ? 'animate-spin' : ''}`} />
              </button>
            )}
          </div>
          {loading ? (
            <div className="h-7 bg-zinc-800 rounded w-12 animate-pulse" />
          ) : (
            <p className="text-2xl font-bold text-zinc-100">{stats.currentEpoch}</p>
          )}
          <div className="mt-1">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-zinc-600">Progress</span>
              <span className="text-emerald-400">73%</span>
            </div>
            <div className="h-1.5 bg-zinc-700 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '73%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Value Proposition Banner */}
      <div className="bg-gradient-to-r from-violet-500/5 via-zinc-900/50 to-emerald-500/5 border border-zinc-800/50 rounded-xl p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-zinc-100 mb-1">Earn SOL by Staking XAND</h3>
            <p className="text-sm text-zinc-400">
              pNodes earn <span className="text-emerald-400 font-medium">STOINC</span> (Storage Income) 
              from dApp storage fees—paid in SOL, not inflationary tokens.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center px-4 py-2 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
              <p className="text-xl font-bold text-emerald-400">94%</p>
              <p className="text-[10px] text-zinc-500 uppercase">To Stakers</p>
            </div>
            <div className="text-center px-4 py-2 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
              <p className="text-xl font-bold text-zinc-100">0%</p>
              <p className="text-[10px] text-zinc-500 uppercase">Lockup</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
