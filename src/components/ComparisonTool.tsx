'use client';

import React, { useMemo } from 'react';
import { X, Scale, Trophy, Globe } from 'lucide-react';
import { PNode } from '@/types';

interface ComparisonToolProps {
  nodes: PNode[];
  selectedIds: string[];
  onRemove: (id: string) => void;
  onClear: () => void;
}

export function ComparisonTool({ nodes, selectedIds, onRemove, onClear }: ComparisonToolProps) {
  const selectedNodes = useMemo(() => 
    nodes.filter(n => selectedIds.includes(n.id)).sort((a, b) => b.score - a.score),
    [nodes, selectedIds]
  );

  if (selectedIds.length === 0) return null;

  // Find best in each category
  const bestScore = Math.max(...selectedNodes.map(n => n.score));
  const bestUptime = Math.max(...selectedNodes.map(n => n.uptime));
  const bestCredits = Math.max(...selectedNodes.map(n => n.credits || 0));
  const lowestFee = Math.min(...selectedNodes.map(n => n.fee));

  return (
    <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-violet-500/10 border border-violet-500/20">
            <Scale className="h-5 w-5 text-violet-400" />
          </div>
          <div>
            <h3 className="font-semibold text-zinc-100">Compare pNodes</h3>
            <p className="text-sm text-zinc-500">{selectedIds.length} selected • Best highlighted with ★</p>
          </div>
        </div>
        <button
          onClick={onClear}
          className="text-sm text-zinc-400 hover:text-zinc-200 px-3 py-1.5 rounded-lg border border-zinc-700 hover:border-zinc-600 transition-colors"
        >
          Clear All
        </button>
      </div>

      {/* Cards Grid */}
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {selectedNodes.map((node, index) => {
          const isWinner = index === 0;
          
          return (
            <div 
              key={node.id}
              className={`rounded-xl border p-4 relative ${
                isWinner 
                  ? 'bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/30' 
                  : 'bg-zinc-800/50 border-zinc-700/50'
              }`}
            >
              {/* Remove button */}
              <button
                onClick={() => onRemove(node.id)}
                className="absolute top-2 right-2 p-1 rounded-full hover:bg-zinc-700/50 text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Winner badge or rank */}
              <div className="flex items-center gap-2 mb-3">
                {isWinner ? (
                  <>
                    <Trophy className="h-5 w-5 text-amber-400" />
                    <span className="text-sm font-semibold text-amber-400">Best</span>
                  </>
                ) : (
                  <span className="text-sm text-zinc-500">#{index + 1}</span>
                )}
              </div>

              {/* Node identity */}
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600/20 to-cyan-600/20 border border-zinc-700 flex items-center justify-center">
                  <Globe className="h-4 w-4 text-cyan-400" />
                </div>
                <div>
                  <p className="font-medium text-zinc-100 text-sm">{node.name}</p>
                  <p className="text-xs text-zinc-500 font-mono">{node.shortKey}</p>
                </div>
              </div>

              {/* Metrics */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-zinc-500">Score</span>
                  <span className={`font-mono text-sm ${node.score === bestScore ? 'text-amber-400 font-semibold' : 'text-zinc-300'}`}>
                    {node.score.toFixed(1)}
                    {node.score === bestScore && <span className="ml-1">★</span>}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-zinc-500">Uptime</span>
                  <span className={`font-mono text-sm ${node.uptime === bestUptime ? 'text-emerald-400 font-semibold' : 'text-zinc-300'}`}>
                    {node.uptime.toFixed(1)}%
                    {node.uptime === bestUptime && <span className="ml-1">★</span>}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-zinc-500">Credits</span>
                  <span className={`font-mono text-sm ${node.credits === bestCredits ? 'text-cyan-400 font-semibold' : 'text-zinc-300'}`}>
                    {(node.credits || 0).toLocaleString()}
                    {node.credits === bestCredits && <span className="ml-1">★</span>}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-zinc-500">Fee</span>
                  <span className={`font-mono text-sm ${node.fee === lowestFee ? 'text-amber-400 font-semibold' : 'text-zinc-300'}`}>
                    {node.fee.toFixed(1)}%
                    {node.fee === lowestFee && <span className="ml-1">★</span>}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="px-5 py-3 bg-zinc-900/50 border-t border-zinc-800">
        <p className="text-xs text-zinc-500 text-center">
          ★ = Best in category • Winner = Highest overall score
        </p>
      </div>
    </div>
  );
}
