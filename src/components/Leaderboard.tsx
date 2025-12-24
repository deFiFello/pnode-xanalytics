'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Check,
  AlertCircle,
  Info,
  ExternalLink,
  Copy,
  TrendingUp,
  Globe,
  Award,
} from 'lucide-react';
import { PNode } from '@/types';

// Fetch from our API route
async function fetchPNodeData(): Promise<PNode[]> {
  try {
    const response = await fetch('/api/pnodes');
    const data = await response.json();
    if (!data.success || !data.nodes) return [];
    return data.nodes;
  } catch (error) {
    console.error('Error fetching pNode data:', error);
    return [];
  }
}

interface LeaderboardProps {
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  onNodesLoaded?: (nodes: PNode[]) => void;
  userStake?: number;
}

export function Leaderboard({ 
  selectedIds = [], 
  onSelectionChange, 
  onNodesLoaded,
  userStake = 10000 
}: LeaderboardProps) {
  const [nodes, setNodes] = useState<PNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(10);
  const [stakeInput, setStakeInput] = useState(userStake || 10000);

  useEffect(() => {
    fetchPNodeData().then((data) => {
      setNodes(data);
      setLoading(false);
      onNodesLoaded?.(data);
    });
  }, [onNodesLoaded]);

  // Calculate average fee and pool size for context
  const avgFee = useMemo(() => {
    if (nodes.length === 0) return 5;
    return nodes.reduce((sum, n) => sum + n.fee, 0) / nodes.length;
  }, [nodes]);

  const avgPoolSize = useMemo(() => {
    if (nodes.length === 0) return 40000;
    return nodes.reduce((sum, n) => sum + n.totalStake, 0) / nodes.length;
  }, [nodes]);

  const toggleSelection = (id: string) => {
    if (!onSelectionChange) return;
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter(i => i !== id));
    } else if (selectedIds.length < 5) {
      onSelectionChange([...selectedIds, id]);
    }
  };

  const getUptimeStatus = (uptime: number) => {
    if (uptime >= 99) return { color: 'text-emerald-400', bg: 'bg-emerald-400', label: 'Excellent' };
    if (uptime >= 98) return { color: 'text-amber-400', bg: 'bg-amber-400', label: 'Good' };
    return { color: 'text-red-400', bg: 'bg-red-400', label: 'Poor' };
  };

  const getFeeContext = (fee: number) => {
    if (fee <= avgFee - 1) return { color: 'text-emerald-400', label: 'Below avg' };
    if (fee >= avgFee + 1) return { color: 'text-amber-400', label: 'Above avg' };
    return { color: 'text-zinc-400', label: 'Average' };
  };

  const getPoolContext = (poolSize: number) => {
    if (poolSize <= avgPoolSize * 0.7) return { color: 'text-emerald-400', label: 'Small pool' };
    if (poolSize >= avgPoolSize * 1.3) return { color: 'text-amber-400', label: 'Large pool' };
    return { color: 'text-zinc-400', label: 'Medium' };
  };

  const calculateYourShare = (poolSize: number) => {
    return ((stakeInput / (poolSize + stakeInput)) * 100).toFixed(1);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (loading) {
    return (
      <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-zinc-800/50">
          <div className="h-6 bg-zinc-800 rounded w-48 animate-pulse" />
        </div>
        <div className="divide-y divide-zinc-800/30">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="px-6 py-4">
              <div className="h-5 bg-zinc-800 rounded w-full animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const visibleNodes = nodes.slice(0, visibleCount);

  // Identify top performers for badges
  const topByUptime = nodes.length > 0 ? nodes.reduce((a, b) => a.uptime > b.uptime ? a : b).id : null;
  const topByFee = nodes.length > 0 ? nodes.reduce((a, b) => a.fee < b.fee ? a : b).id : null;
  const topByCredits = nodes.length > 0 ? nodes[0]?.id : null; // Already sorted by credits

  const getBadge = (nodeId: string) => {
    if (nodeId === topByCredits) return { label: 'Top Performer', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
    if (nodeId === topByUptime) return { label: 'Best Uptime', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
    if (nodeId === topByFee) return { label: 'Lowest Fee', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' };
    return null;
  };

  return (
    <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-zinc-800/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-100">pNode Leaderboard</h2>
            <p className="text-sm text-zinc-500">
              Showing {Math.min(visibleCount, nodes.length)} of {nodes.length} nodes
              {selectedIds.length > 0 && (
                <span className="ml-2 text-violet-400">• {selectedIds.length} selected</span>
              )}
            </p>
          </div>
          
          {/* Stake Input */}
          <div className="flex items-center gap-2">
            <div className="text-right">
              <span className="text-sm text-zinc-500">Your stake:</span>
              <p className="text-[10px] text-zinc-600">Enter amount to see your share</p>
            </div>
            <div className="relative">
              <input
                type="number"
                value={stakeInput}
                onChange={(e) => setStakeInput(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-28 px-3 py-1.5 bg-zinc-800/50 border border-zinc-700 rounded-lg text-sm text-zinc-100 font-mono focus:outline-none focus:border-violet-500/50"
                placeholder="10000"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500">XAND</span>
            </div>
          </div>
        </div>
      </div>

      {/* Column Headers with Definitions */}
      <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-3 border-b border-zinc-800/50 bg-zinc-900/30">
        <div className="col-span-1 text-xs font-medium text-zinc-500 uppercase tracking-wide">
          <span className="flex items-center gap-1">
            <input type="checkbox" className="opacity-0 w-4" disabled />
            #
          </span>
        </div>
        <div className="col-span-3 text-xs font-medium text-zinc-500 uppercase tracking-wide">
          pNode
        </div>
        <div className="col-span-2 text-xs font-medium text-zinc-500 uppercase tracking-wide">
          <span className="flex items-center gap-1">
            Uptime
            <span className="text-zinc-600 font-normal normal-case">• reliability</span>
          </span>
        </div>
        <div className="col-span-2 text-xs font-medium text-zinc-500 uppercase tracking-wide">
          <span className="flex items-center gap-1">
            Fee
            <span className="text-zinc-600 font-normal normal-case">• operator cut</span>
          </span>
        </div>
        <div className="col-span-2 text-xs font-medium text-zinc-500 uppercase tracking-wide">
          <span className="flex items-center gap-1">
            Pool
            <span className="text-zinc-600 font-normal normal-case">• total staked</span>
          </span>
        </div>
        <div className="col-span-2 text-xs font-medium text-zinc-500 uppercase tracking-wide">
          <span className="flex items-center gap-1 text-violet-400">
            Your Share
            <span className="text-violet-400/60 font-normal normal-case">• % of rewards</span>
          </span>
        </div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-zinc-800/30">
        {visibleNodes.map((node, index) => {
          const isExpanded = expandedId === node.id;
          const isSelected = selectedIds.includes(node.id);
          const uptimeStatus = getUptimeStatus(node.uptime);
          const feeContext = getFeeContext(node.fee);
          const poolContext = getPoolContext(node.totalStake);
          const yourShare = calculateYourShare(node.totalStake);
          const badge = getBadge(node.id);

          return (
            <div key={node.id} className={isSelected ? 'bg-violet-500/[0.03]' : ''}>
              {/* Main Row */}
              <div 
                className="px-6 py-4 flex items-center lg:grid lg:grid-cols-12 gap-4 cursor-pointer hover:bg-zinc-800/20 transition-colors"
                onClick={() => setExpandedId(isExpanded ? null : node.id)}
              >
                {/* Checkbox + Rank */}
                <div className="col-span-1 flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSelection(node.id);
                    }}
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                      isSelected 
                        ? 'bg-violet-600 border-violet-600' 
                        : 'border-zinc-600 hover:border-zinc-500'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </button>
                  <span className="text-sm text-zinc-500 font-mono w-6">{index + 1}</span>
                </div>

                {/* pNode Name + Badge */}
                <div className="col-span-3 flex items-center gap-3 flex-1 lg:flex-none">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-zinc-700/50 flex items-center justify-center">
                    <Globe className="h-4 w-4 text-cyan-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-zinc-100 truncate">{node.name}</p>
                      {badge && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${badge.color}`}>
                          {badge.label}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-600 font-mono">{node.shortKey}</p>
                  </div>
                </div>

                {/* Uptime */}
                <div className="col-span-2 hidden lg:flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${uptimeStatus.bg}`} />
                  <span className={`font-mono text-sm ${uptimeStatus.color}`}>
                    {node.uptime.toFixed(1)}%
                  </span>
                </div>

                {/* Fee */}
                <div className="col-span-2 hidden lg:block">
                  <span className={`font-mono text-sm ${feeContext.color}`}>
                    {node.fee.toFixed(1)}%
                  </span>
                  <span className="text-xs text-zinc-600 ml-1.5">{feeContext.label}</span>
                </div>

                {/* Pool Size */}
                <div className="col-span-2 hidden lg:block">
                  <span className="font-mono text-sm text-zinc-300">
                    {(node.totalStake / 1000).toFixed(1)}K
                  </span>
                  <span className={`text-xs ml-1.5 ${poolContext.color}`}>{poolContext.label}</span>
                </div>

                {/* Your Share - THE KEY METRIC */}
                <div className="col-span-2 hidden lg:flex items-center justify-between">
                  <div>
                    <span className="font-mono text-sm font-semibold text-violet-400">
                      {yourShare}%
                    </span>
                    <span className="text-xs text-zinc-600 ml-1">of rewards</span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-zinc-500" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-zinc-500" />
                  )}
                </div>

                {/* Mobile: Show key stats */}
                <div className="flex lg:hidden items-center gap-4 ml-auto">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-violet-400">{yourShare}%</p>
                    <p className="text-xs text-zinc-600">your share</p>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-zinc-500" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-zinc-500" />
                  )}
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="px-6 pb-6">
                  <div className="bg-zinc-800/30 border border-zinc-700/30 rounded-xl p-5">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      
                      {/* Your Share Calculator */}
                      <div className="lg:col-span-2 space-y-4">
                        <h4 className="text-sm font-medium text-zinc-300">Your Potential Returns</h4>
                        
                        {/* Big Share Display */}
                        <div className="bg-zinc-900/50 rounded-xl p-5 border border-zinc-700/30">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <p className="text-4xl font-bold text-violet-400">{yourShare}%</p>
                              <p className="text-sm text-zinc-500 mt-1">of this pool's rewards</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-zinc-400">Your stake</p>
                              <p className="text-lg font-mono text-zinc-200">{stakeInput.toLocaleString()} XAND</p>
                            </div>
                          </div>
                          
                          {/* Visual breakdown */}
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between text-xs text-zinc-500 mb-1">
                                <span>Pool composition after your stake</span>
                                <span>{(node.totalStake + stakeInput).toLocaleString()} XAND total</span>
                              </div>
                              <div className="h-3 bg-zinc-700 rounded-full overflow-hidden flex">
                                <div 
                                  className="h-full bg-violet-500"
                                  style={{ width: `${yourShare}%` }}
                                />
                                <div 
                                  className="h-full bg-zinc-600"
                                  style={{ width: `${100 - parseFloat(yourShare)}%` }}
                                />
                              </div>
                              <div className="flex justify-between text-xs mt-1">
                                <span className="text-violet-400">You: {yourShare}%</span>
                                <span className="text-zinc-500">Others: {(100 - parseFloat(yourShare)).toFixed(1)}%</span>
                              </div>
                            </div>

                            <div className="pt-3 border-t border-zinc-700/50">
                              <div className="flex justify-between text-sm mb-2">
                                <span className="text-zinc-400">After {node.fee}% operator fee:</span>
                                <span className="text-zinc-200">You receive {(parseFloat(yourShare) * (100 - node.fee) / 100).toFixed(2)}% of STOINC</span>
                              </div>
                              <p className="text-xs text-zinc-500">
                                <Info className="inline h-3 w-3 mr-1" />
                                STOINC is paid in SOL from storage fees. Your stake increases this pNode's storageCredits.
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Quick comparison hint */}
                        <div className="flex items-start gap-2 text-xs text-zinc-500">
                          <TrendingUp className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <p>
                            {node.totalStake < avgPoolSize * 0.7 
                              ? "Small pool = bigger share of rewards. Good choice if uptime stays high."
                              : node.totalStake > avgPoolSize * 1.3
                              ? "Popular pool means more competition. Your share is smaller but the node is trusted."
                              : "Average-sized pool. Balanced between share size and trust."}
                          </p>
                        </div>
                      </div>

                      {/* Node Stats */}
                      <div className="space-y-4">
                        <h4 className="text-sm font-medium text-zinc-300">Node Details</h4>
                        
                        <div className="space-y-3">
                          {/* Uptime */}
                          <div className="flex items-center justify-between py-2 border-b border-zinc-700/30">
                            <div>
                              <p className="text-sm text-zinc-400">Uptime</p>
                              <p className="text-xs text-zinc-600">Last 30 days</p>
                            </div>
                            <div className="text-right">
                              <p className={`font-mono font-semibold ${uptimeStatus.color}`}>
                                {node.uptime.toFixed(1)}%
                              </p>
                              <p className={`text-xs ${uptimeStatus.color}`}>{uptimeStatus.label}</p>
                            </div>
                          </div>

                          {/* Credits */}
                          <div className="flex items-center justify-between py-2 border-b border-zinc-700/30">
                            <div>
                              <p className="text-sm text-zinc-400">Credits</p>
                              <p className="text-xs text-zinc-600">Storage challenges passed</p>
                            </div>
                            <div className="text-right">
                              <p className="font-mono text-zinc-200">{node.credits.toLocaleString()}</p>
                              <p className="text-xs text-zinc-500">higher = more active</p>
                            </div>
                          </div>

                          {/* Delegators */}
                          <div className="flex items-center justify-between py-2 border-b border-zinc-700/30">
                            <div>
                              <p className="text-sm text-zinc-400">Delegators</p>
                              <p className="text-xs text-zinc-600">People staking here</p>
                            </div>
                            <div className="text-right">
                              <p className="font-mono text-zinc-200">{node.delegators}</p>
                            </div>
                          </div>

                          {/* Version */}
                          <div className="flex items-center justify-between py-2">
                            <div>
                              <p className="text-sm text-zinc-400">Software</p>
                            </div>
                            <p className="font-mono text-xs text-zinc-500">v{node.version}</p>
                          </div>
                        </div>

                        {/* Identity */}
                        <div className="pt-3 border-t border-zinc-700/30">
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-zinc-500 font-mono truncate flex-1 mr-2">
                              {node.fullKey}
                            </p>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(node.fullKey);
                              }}
                              className="p-1.5 hover:bg-zinc-700/50 rounded transition-colors"
                            >
                              <Copy className="h-3.5 w-3.5 text-zinc-500" />
                            </button>
                          </div>
                          <a
                            href={`https://explorer.xandeum.com/address/${node.fullKey}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="mt-2 flex items-center justify-center gap-2 px-3 py-2 bg-zinc-700/30 hover:bg-zinc-700/50 border border-zinc-600/30 rounded-lg text-xs text-zinc-400 transition-colors"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            View on Explorer
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Load More */}
      {visibleCount < nodes.length && (
        <div className="px-6 py-4 border-t border-zinc-800/50">
          <button
            onClick={() => setVisibleCount(prev => Math.min(prev + 10, nodes.length))}
            className="w-full py-2.5 text-sm font-medium text-violet-400 hover:text-violet-300 hover:bg-violet-500/5 rounded-lg transition-colors"
          >
            Load More ({Math.min(10, nodes.length - visibleCount)} more)
          </button>
        </div>
      )}

      {/* Bottom hint */}
      <div className="px-6 py-3 bg-zinc-900/30 border-t border-zinc-800/50">
        <p className="text-xs text-zinc-600 text-center">
          💡 Select up to 5 nodes to compare side-by-side
        </p>
      </div>
    </div>
  );
}
