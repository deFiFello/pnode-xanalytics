'use client';

import { useState, useEffect } from 'react';
import { X, Globe, Trophy, ExternalLink } from 'lucide-react';

interface PNode {
  id: string;
  credits: number;
  rank: number;
}

interface ComparisonToolProps {
  selectedIds: string[];
  onRemove: (id: string) => void;
  onClear: () => void;
}

export function ComparisonTool({ selectedIds, onRemove, onClear }: ComparisonToolProps) {
  const [nodes, setNodes] = useState<PNode[]>([]);
  const [allNodes, setAllNodes] = useState<PNode[]>([]);

  useEffect(() => {
    async function fetchNodes() {
      try {
        const res = await fetch('/api/pnodes');
        const data = await res.json();
        
        if (data.success && data.nodes) {
          const cleanNodes = data.nodes.map((node: any, index: number) => ({
            id: node.id,
            credits: node.credits,
            rank: index + 1,
          }));
          setAllNodes(cleanNodes);
        }
      } catch (error) {
        console.error('Failed to fetch:', error);
      }
    }

    fetchNodes();
  }, []);

  useEffect(() => {
    const selected = allNodes.filter(n => selectedIds.includes(n.id));
    setNodes(selected);
  }, [selectedIds, allNodes]);

  if (selectedIds.length === 0) {
    return null;
  }

  const maxCredits = Math.max(...nodes.map(n => n.credits), 1);
  const bestNode = nodes.reduce((best, node) => 
    node.credits > best.credits ? node : best
  , nodes[0]);

  return (
    <div className="bg-zinc-900/50 border border-violet-500/30 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-zinc-800/50 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-zinc-100">Compare pNodes</h3>
          <p className="text-sm text-zinc-500">{nodes.length} selected • Based on activity credits</p>
        </div>
        <button
          onClick={onClear}
          className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          Clear all
        </button>
      </div>

      {/* Comparison Grid */}
      <div className="p-4">
        <div className={`grid gap-3 ${
          nodes.length === 2 ? 'grid-cols-2' :
          nodes.length === 3 ? 'grid-cols-3' :
          nodes.length === 4 ? 'grid-cols-2 lg:grid-cols-4' :
          'grid-cols-2 lg:grid-cols-5'
        }`}>
          {nodes.map((node) => {
            const isBest = node.id === bestNode?.id && nodes.length > 1;
            const creditRatio = (node.credits / maxCredits) * 100;

            return (
              <div
                key={node.id}
                className={`relative bg-zinc-800/30 border rounded-xl p-4 ${
                  isBest ? 'border-amber-500/50 ring-1 ring-amber-500/20' : 'border-zinc-700/30'
                }`}
              >
                {/* Remove Button */}
                <button
                  onClick={() => onRemove(node.id)}
                  className="absolute top-2 right-2 p-1 hover:bg-zinc-700/50 rounded transition-colors"
                >
                  <X className="h-4 w-4 text-zinc-500" />
                </button>

                {/* Best Badge */}
                {isBest && (
                  <div className="absolute -top-2 left-3 flex items-center gap-1 px-2 py-0.5 bg-amber-500 text-black text-xs font-bold rounded">
                    <Trophy className="h-3 w-3" />
                    BEST
                  </div>
                )}

                {/* Node Icon */}
                <div className="flex items-center gap-2 mb-3 mt-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-zinc-700/50 flex items-center justify-center">
                    <Globe className="h-4 w-4 text-cyan-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-mono text-xs text-zinc-400 truncate">
                      {node.id.slice(0, 8)}...{node.id.slice(-4)}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-3">
                  {/* Rank */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-500">Rank</span>
                    <span className={`font-mono font-bold ${
                      node.rank <= 3 ? 'text-amber-400' :
                      node.rank <= 10 ? 'text-zinc-200' : 'text-zinc-400'
                    }`}>
                      #{node.rank}
                    </span>
                  </div>

                  {/* Credits */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-zinc-500">Credits</span>
                      <span className="font-mono font-bold text-cyan-400">
                        {node.credits.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cyan-500 rounded-full transition-all"
                        style={{ width: `${creditRatio}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Action */}
                <a
                  href={`https://explorer.xandeum.com/address/${node.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex items-center justify-center gap-1 w-full py-2 bg-zinc-700/30 hover:bg-zinc-700/50 rounded-lg text-xs text-zinc-400 transition-colors"
                >
                  <ExternalLink className="h-3 w-3" />
                  Explorer
                </a>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary */}
      {nodes.length > 1 && (
        <div className="px-6 py-4 border-t border-zinc-800/50 bg-zinc-800/20">
          <div className="flex items-center gap-4 text-sm">
            <span className="text-zinc-500">Recommendation:</span>
            <span className="text-zinc-200">
              <strong className="text-amber-400">{bestNode?.id.slice(0, 8)}...</strong> has the highest activity credits ({bestNode?.credits.toLocaleString()})
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
