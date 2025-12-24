'use client';

import React from 'react';
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';

interface NetworkOverviewProps {
  stats: {
    totalNodes: number;
    activeNodes: number;
    currentEpoch: number;
  };
  price: {
    usd: number;
    usd_24h_change: number;
  };
  loading?: boolean;
  onRefresh?: () => void;
}

export function NetworkOverview({ stats, price, loading, onRefresh }: NetworkOverviewProps) {
  const priceUp = price.usd_24h_change >= 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {/* Active pNodes */}
      <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-4">
        <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Active pNodes</p>
        {loading ? (
          <div className="h-8 bg-zinc-800 rounded w-16 animate-pulse" />
        ) : (
          <p className="text-2xl font-bold text-zinc-100">{stats.activeNodes}</p>
        )}
        <p className="text-xs text-zinc-600 mt-0.5">{stats.totalNodes} total</p>
      </div>

      {/* XAND Price */}
      <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-4">
        <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">XAND Price</p>
        {loading ? (
          <div className="h-8 bg-zinc-800 rounded w-20 animate-pulse" />
        ) : (
          <p className="text-2xl font-bold text-zinc-100">${price.usd.toFixed(4)}</p>
        )}
        <p className={`text-xs mt-0.5 flex items-center gap-1 ${priceUp ? 'text-emerald-400' : 'text-red-400'}`}>
          {priceUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {priceUp ? '+' : ''}{price.usd_24h_change.toFixed(2)}% 24h
        </p>
      </div>

      {/* Epoch */}
      <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Epoch</p>
          {onRefresh && (
            <button 
              onClick={onRefresh}
              className="p-1 hover:bg-zinc-800 rounded transition-colors -mt-1"
              disabled={loading}
            >
              <RefreshCw className={`h-3 w-3 text-zinc-500 ${loading ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>
        {loading ? (
          <div className="h-8 bg-zinc-800 rounded w-12 animate-pulse" />
        ) : (
          <p className="text-2xl font-bold text-zinc-100">{stats.currentEpoch}</p>
        )}
        <p className="text-xs text-zinc-600 mt-0.5">DevNet</p>
      </div>

      {/* Network Status */}
      <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-4">
        <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Network</p>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <p className="text-lg font-semibold text-emerald-400">Online</p>
        </div>
        <p className="text-xs text-zinc-600 mt-0.5">All systems operational</p>
      </div>
    </div>
  );
}
