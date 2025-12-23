'use client';

import React from 'react';
import { 
  Server, 
  HardDrive, 
  TrendingUp, 
  TrendingDown,
  Clock,
  RefreshCw,
} from 'lucide-react';

interface NetworkOverviewProps {
  stats: {
    totalNodes: number;
    activeNodes: number;
    totalStorage: string;
    usedStorage: string;
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
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Server className="h-4 w-4 text-violet-400" />
          <span className="text-xs text-zinc-500 uppercase tracking-wide">Active pNodes</span>
        </div>
        {loading ? (
          <div className="h-7 bg-zinc-800 rounded animate-pulse w-16" />
        ) : (
          <p className="text-2xl font-bold text-zinc-100">{stats.activeNodes}</p>
        )}
        <p className="text-xs text-zinc-500 mt-1">{stats.totalNodes} total</p>
      </div>

      {/* Network Storage */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <HardDrive className="h-4 w-4 text-cyan-400" />
          <span className="text-xs text-zinc-500 uppercase tracking-wide">Storage</span>
        </div>
        {loading ? (
          <div className="h-7 bg-zinc-800 rounded animate-pulse w-20" />
        ) : (
          <p className="text-2xl font-bold text-zinc-100">{stats.usedStorage}</p>
        )}
        <p className="text-xs text-zinc-500 mt-1">of {stats.totalStorage}</p>
      </div>

      {/* XAND Price */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          {priceUp ? (
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-400" />
          )}
          <span className="text-xs text-zinc-500 uppercase tracking-wide">XAND Price</span>
        </div>
        {loading ? (
          <div className="h-7 bg-zinc-800 rounded animate-pulse w-16" />
        ) : (
          <p className="text-2xl font-bold text-zinc-100">${price.usd.toFixed(4)}</p>
        )}
        <p className={`text-xs mt-1 ${priceUp ? 'text-emerald-400' : 'text-red-400'}`}>
          {priceUp ? '+' : ''}{price.usd_24h_change.toFixed(2)}% 24h
        </p>
      </div>

      {/* Current Epoch */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-400" />
            <span className="text-xs text-zinc-500 uppercase tracking-wide">Epoch</span>
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
          <div className="h-7 bg-zinc-800 rounded animate-pulse w-12" />
        ) : (
          <p className="text-2xl font-bold text-zinc-100">{stats.currentEpoch}</p>
        )}
        <p className="text-xs text-zinc-500 mt-1">DevNet</p>
      </div>
    </div>
  );
}
