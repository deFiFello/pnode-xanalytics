'use client';

import React, { useMemo } from 'react';
import { X, Scale, Trophy, Globe } from 'lucide-react';
import { PNode } from '@/types';

interface ComparisonToolProps {
  nodes: PNode[];
  selectedIds: string[];
  onRemove: (id: string) => void;
  onClear: () => void;
  userStake?: number;
}

export function ComparisonTool({ 
  nodes, 
  selectedIds, 
  onRemove, 
  onClear,
  userStake = 10000 
}: ComparisonToolProps) {
  const selectedNodes = useMemo(() => 
    nodes.filter(n => selectedIds.includes(n.id)).sort((a, b) => {
      // Sort by your share (smaller pool = bigger share = better)
      const aShare = userStake / (a.totalStake + userStake);
      const bShare = userStake / (b.totalStake + userStake);
      return bShare - aShare;
    }),
    [nodes, selectedIds, userStake]
  );

  if (selectedIds.length === 0) return null;

  // Calculate metrics
  const getYourShare = (pool: number) => ((userStake / (pool + userStake)) * 100).toFixed(1);
  
  const bestUptime = Math.max(...selectedNodes.map(n => n.uptime));
  const lowestFee = Math.min(...selectedNodes.map(n => n.fee));
  const smallestPool = Math.min(...selectedNodes.map(n => n.totalStake));

  return (
    <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-zinc-800/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Scale className="h-5 w-5 text-violet-400" />
          <div>
            <h3 className="font-semibold text-zinc-100">Compare Pools</h3>
            <p className="text-xs text-zinc-500">{selectedIds.length} selected • Sorted by your share</p>
          </div>
        </div>
        <button
          onClick={onClear}
          className="text-sm text-zinc-400 hover:text-zinc-200 px-3 py-1.5 rounded-lg border border-zinc-700 hover:border-zinc-600 transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Comparison Cards */}
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        {selectedNodes.map((node, index) => {
          const yourShare = getYourShare(node.totalStake);
          const isWinner = index === 0;
          const hasBestUptime = node.uptime === bestUptime;
          const hasLowestFee = node.fee === lowestFee;
          const hasSmallestPool = node.totalStake === smallestPool;

          return (
            <div 
              key={node.id}
              className={`rounded-xl border p-4 relative ${
                isWinner 
                  ? 'bg-gradient-to-br from-violet-500/10 to-violet-600/5 border-violet-500/30' 
                  : 'bg-zinc-800/30 border-zinc-700/30'
              }`}
            >
              {/* Remove button */}
              <button
                onClick={() => onRemove(node.id)}
                className="absolute top-2 right-2 p-1 rounded-full hover:bg-zinc-700/50 text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>

              {/* Winner badge */}
              {isWinner && (
                <div className="flex items-center gap-1.5 mb-3">
                  <Trophy className="h-4 w-4 text-amber-400" />
                  <span className="text-xs font-semibold text-amber-400">Best Share</span>
                </div>
              )}
              {!isWinner && (
                <div className="mb-3">
                  <span className="text-xs text-zinc-500">#{index + 1}</span>
                </div>
              )}

              {/* Node name with Globe */}
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-zinc-700/50 flex items-center justify-center flex-shrink-0">
                  <Globe className="h-3.5 w-3.5 text-cyan-400" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-zinc-100 text-sm truncate">{node.name}</p>
                  <p className="text-xs text-zinc-600 font-mono">{node.shortKey}</p>
                </div>
              </div>

              {/* Your Share - Hero metric */}
              <div className="bg-zinc-900/50 rounded-lg p-3 mb-3">
                <p className="text-xs text-zinc-500 mb-1">Your share of rewards</p>
                <p className={`text-2xl font-bold ${isWinner ? 'text-violet-400' : 'text-zinc-200'}`}>
                  {yourShare}%
                </p>
              </div>

              {/* Other metrics */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Uptime</span>
                  <span className={hasBestUptime ? 'text-emerald-400 font-medium' : 'text-zinc-300'}>
                    {node.uptime.toFixed(1)}%
                    {hasBestUptime && ' ✓'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Fee</span>
                  <span className={hasLowestFee ? 'text-emerald-400 font-medium' : 'text-zinc-300'}>
                    {node.fee.toFixed(1)}%
                    {hasLowestFee && ' ✓'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Pool</span>
                  <span className={hasSmallestPool ? 'text-emerald-400 font-medium' : 'text-zinc-300'}>
                    {(node.totalStake / 1000).toFixed(1)}K
                    {hasSmallestPool && ' ✓'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="px-6 py-3 bg-zinc-900/30 border-t border-zinc-800/50">
        <p className="text-xs text-zinc-500 text-center">
          ✓ Best in category • Sorted by your share (highest first)
        </p>
      </div>
    </div>
  );
}
