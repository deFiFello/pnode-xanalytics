'use client';

import React from 'react';
import { TrendingUp, TrendingDown, RefreshCw, Database, Coins, Activity, Server } from 'lucide-react';

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
    <div className="space-y-4">
      {/* Main Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Active pNodes */}
        <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Server className="h-4 w-4 text-zinc-500" />
            <p className="text-xs text-zinc-500 uppercase tracking-wide">Active Pools</p>
          </div>
          {loading ? (
            <div className="h-8 bg-zinc-800 rounded w-16 animate-pulse" />
          ) : (
            <p className="text-2xl font-bold text-zinc-100">{stats.activeNodes}</p>
          )}
          <p className="text-xs text-zinc-600 mt-1">pNodes earning rewards</p>
        </div>

        {/* Network Storage */}
        <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Database className="h-4 w-4 text-zinc-500" />
            <p className="text-xs text-zinc-500 uppercase tracking-wide">Network Storage</p>
          </div>
          {loading ? (
            <div className="h-8 bg-zinc-800 rounded w-20 animate-pulse" />
          ) : (
            <p className="text-2xl font-bold text-zinc-100">2.4 PB</p>
          )}
          <p className="text-xs text-emerald-500 mt-1 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> Growing
          </p>
        </div>

        {/* XAND Price */}
        <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Coins className="h-4 w-4 text-zinc-500" />
            <p className="text-xs text-zinc-500 uppercase tracking-wide">XAND Price</p>
          </div>
          {loading ? (
            <div className="h-8 bg-zinc-800 rounded w-20 animate-pulse" />
          ) : (
            <p className="text-2xl font-bold text-zinc-100">${price.usd.toFixed(4)}</p>
          )}
          <p className={`text-xs mt-1 flex items-center gap-1 ${priceUp ? 'text-emerald-500' : 'text-red-400'}`}>
            {priceUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {priceUp ? '+' : ''}{price.usd_24h_change.toFixed(2)}% 24h
          </p>
        </div>

        {/* Epoch */}
        <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-zinc-500" />
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
            <div className="h-8 bg-zinc-800 rounded w-12 animate-pulse" />
          ) : (
            <p className="text-2xl font-bold text-zinc-100">{stats.currentEpoch}</p>
          )}
          <p className="text-xs text-zinc-600 mt-1">~2 days per epoch</p>
        </div>
      </div>

      {/* Why Xandeum - Value Prop */}
      <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-base font-semibold text-zinc-100 mb-2">Why Stake with Xandeum?</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              pNodes earn <span className="text-zinc-200 font-medium">STOINC</span>—storage income paid in 
              <span className="text-emerald-400 font-medium"> SOL</span> from real dApp storage fees. 
              Unlike inflationary staking, rewards grow with network usage. 
              <span className="text-zinc-300"> Early stakers in smaller pools get bigger shares.</span>
            </p>
          </div>
          <div className="flex items-center gap-4 lg:gap-6">
            <div className="text-center px-4 py-2 bg-zinc-800/50 rounded-lg">
              <p className="text-xl font-bold text-emerald-400">94%</p>
              <p className="text-[10px] text-zinc-500 uppercase">To Stakers</p>
            </div>
            <div className="text-center px-4 py-2 bg-zinc-800/50 rounded-lg">
              <p className="text-xl font-bold text-zinc-100">{stats.activeNodes}</p>
              <p className="text-[10px] text-zinc-500 uppercase">Active Pools</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
