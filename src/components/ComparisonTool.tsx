'use client';

import { useState, useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';

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
          setAllNodes(data.nodes.map((node: any, index: number) => ({
            id: node.id,
            credits: node.credits,
            rank: index + 1,
          })));
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
  const totalCredits = allNodes.reduce((sum, n) => sum + n.credits, 0);

  return (
    <div className="border border-purple-500/30 bg-[#080808]">
      {/* Header */}
      <div className="px-3 md:px-4 py-2 md:py-3 border-b border-purple-500/15 flex items-center justify-between">
        <div>
          <h3 className="text-xs md:text-sm font-bold text-white">Compare pNodes</h3>
          <p className="text-[10px] text-zinc-600">{nodes.length} selected</p>
        </div>
        <button
          onClick={onClear}
          className="text-[10px] text-zinc-500 hover:text-white transition-colors uppercase tracking-wider"
        >
          Clear
        </button>
      </div>

      {/* Comparison Grid - 2 cols on mobile */}
      <div className="p-3 md:p-4">
        <div className={`grid gap-[1px] bg-purple-500/10 grid-cols-2 ${
          nodes.length >= 3 ? 'md:grid-cols-3' : ''
        } ${
          nodes.length >= 4 ? 'lg:grid-cols-4' : ''
        } ${
          nodes.length >= 5 ? 'xl:grid-cols-5' : ''
        }`}>
          {nodes.map((node) => {
            const isBest = node.id === bestNode?.id && nodes.length > 1;
            const creditPercent = (node.credits / maxCredits) * 100;
            const networkShare = (node.credits / totalCredits) * 100;

            return (
              <div
                key={node.id}
                className={`bg-black p-2 md:p-4 relative ${isBest ? 'ring-1 ring-amber-500/50' : ''}`}
              >
                {/* Remove Button */}
                <button
                  onClick={() => onRemove(node.id)}
                  className="absolute top-1 right-1 md:top-2 md:right-2 p-1 text-zinc-600 hover:text-white transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>

                {/* Best Badge */}
                {isBest && (
                  <div className="absolute -top-px left-0 right-0 h-[2px] bg-amber-500" />
                )}

                {/* Content */}
                <div className="space-y-2 md:space-y-3">
                  {/* Address */}
                  <div>
                    <p className="font-mono text-[10px] md:text-xs text-zinc-500 truncate">
                      {node.id.slice(0, 4)}...{node.id.slice(-3)}
                    </p>
                    {isBest && (
                      <span className="text-[10px] text-amber-400 uppercase font-bold">Best</span>
                    )}
                  </div>

                  {/* Rank */}
                  <div>
                    <p className="text-[10px] text-zinc-600 uppercase">Rank</p>
                    <p className={`text-base md:text-lg font-mono font-bold ${
                      node.rank <= 3 ? 'text-amber-400' : 'text-white'
                    }`}>
                      #{node.rank}
                    </p>
                  </div>

                  {/* Credits */}
                  <div>
                    <p className="text-[10px] text-cyan-400 uppercase">Credits</p>
                    <p className="text-base md:text-lg font-mono font-bold text-cyan-400">
                      {node.credits.toLocaleString()}
                    </p>
                    <div className="mt-1 w-full h-1 bg-zinc-900">
                      <div
                        className="h-full bg-cyan-500"
                        style={{ width: `${creditPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Network Share */}
                  <div>
                    <p className="text-[10px] text-zinc-600 uppercase">Share</p>
                    <p className="text-xs md:text-sm font-mono text-purple-400">
                      {networkShare.toFixed(3)}%
                    </p>
                  </div>

                  {/* Action */}
                  <a
                    href={`https://explorer.xandeum.com/address/${node.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1 w-full py-1 md:py-1.5 text-[10px] text-zinc-500 border border-purple-500/20 hover:border-purple-500/40 hover:text-white transition-colors"
                  >
                    <ExternalLink className="h-3 w-3" />
                    View
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary */}
      {nodes.length > 1 && (
        <div className="px-3 md:px-4 py-2 md:py-3 border-t border-purple-500/15 bg-purple-500/5">
          <p className="text-[10px] md:text-xs text-zinc-400">
            <span className="text-amber-400 font-mono">{bestNode?.id.slice(0, 6)}...</span>
            {' '}has highest credits
          </p>
        </div>
      )}
    </div>
  );
}
