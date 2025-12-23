'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Globe, 
  ChevronDown, 
  ChevronUp, 
  Trophy, 
  Search,
  Calculator,
  Copy,
  ExternalLink,
  ArrowUpDown,
} from 'lucide-react';
import { PNode } from '@/types';
import { SmartCalculator } from './SmartCalculator';

// Fetch real data from our API route (proxies to podcredits)
async function fetchPNodeData(): Promise<PNode[]> {
  try {
    const response = await fetch('/api/pnodes');
    const data = await response.json();
    
    if (!data.success || !data.nodes || !Array.isArray(data.nodes)) {
      throw new Error('Invalid data format');
    }
    
    return data.nodes;
  } catch (error) {
    console.error('Error fetching pNode data:', error);
    return [];
  }
}

interface LeaderboardProps {
  initialNodes?: PNode[];
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  onNodesLoaded?: (nodes: PNode[]) => void;
}

export function Leaderboard({ initialNodes, selectedIds = [], onSelectionChange, onNodesLoaded }: LeaderboardProps) {
  const [nodes, setNodes] = useState<PNode[]>(initialNodes || []);
  const [loading, setLoading] = useState(!initialNodes);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showCalculator, setShowCalculator] = useState(false);
  const [selectedNode, setSelectedNode] = useState<PNode | null>(null);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<'score' | 'uptime' | 'fee' | 'credits'>('score');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    if (!initialNodes) {
      fetchPNodeData().then((data) => {
        setNodes(data);
        setLoading(false);
        onNodesLoaded?.(data);
      });
    }
  }, [initialNodes, onNodesLoaded]);

  const toggleSelection = (id: string) => {
    if (!onSelectionChange) return;
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter(i => i !== id));
    } else if (selectedIds.length < 5) {
      onSelectionChange([...selectedIds, id]);
    }
  };

  const filteredNodes = useMemo(() => {
    let result = nodes.filter(node => 
      node.name.toLowerCase().includes(search.toLowerCase()) ||
      node.fullKey.toLowerCase().includes(search.toLowerCase())
    );

    result.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (sortDir === 'asc') {
        return aVal - bVal;
      }
      return bVal - aVal;
    });

    return result;
  }, [nodes, search, sortKey, sortDir]);

  const handleSort = (key: typeof sortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const getBadge = (node: PNode, rank: number) => {
    if (rank === 0) return { label: 'Most Active', color: 'bg-pink-500/20 text-pink-300 border border-pink-500/30' };
    if (rank === 1) return { label: 'Best Uptime', color: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' };
    if (rank === 2) return { label: 'Lowest Fee', color: 'bg-amber-500/20 text-amber-300 border border-amber-500/30' };
    return null;
  };

  const getRankIcon = (rank: number) => {
    if (rank < 3) {
      return (
        <div className="w-6 h-6 flex items-center justify-center">
          <Trophy className={`h-5 w-5 ${rank === 0 ? 'text-amber-400' : rank === 1 ? 'text-zinc-400' : 'text-amber-600'}`} />
        </div>
      );
    }
    return <span className="text-zinc-500 text-sm">#{rank + 1}</span>;
  };

  const handleCalculatorOpen = (node: PNode) => {
    setSelectedNode(node);
    setShowCalculator(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (loading) {
    return (
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-800">
          <div className="h-6 bg-zinc-800 rounded w-48 animate-pulse" />
        </div>
        <div className="divide-y divide-zinc-800/50">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="px-5 py-4 flex items-center gap-4">
              <div className="w-6 h-6 bg-zinc-800 rounded animate-pulse" />
              <div className="w-12 h-6 bg-zinc-800 rounded animate-pulse" />
              <div className="flex-1">
                <div className="h-5 bg-zinc-800 rounded w-32 animate-pulse mb-1" />
                <div className="h-3 bg-zinc-800 rounded w-24 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-violet-500/10 border border-violet-500/20">
            <Trophy className="h-5 w-5 text-violet-400" />
          </div>
          <div>
            <h2 className="font-semibold text-zinc-100">pNode Leaderboard</h2>
            <p className="text-sm text-zinc-500">
              {filteredNodes.length} nodes • Top 3 highlighted
              {selectedIds.length > 0 && (
                <span className="ml-2 text-violet-400">• {selectedIds.length}/5 selected</span>
              )}
            </p>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search pNodes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/50 w-full sm:w-48"
          />
        </div>
      </div>

      {/* Table Header - Desktop */}
      <div className="hidden lg:grid grid-cols-12 gap-4 px-5 py-3 border-b border-zinc-800 bg-zinc-900/50 text-xs font-medium text-zinc-500 uppercase tracking-wide">
        <div className="col-span-1 flex items-center gap-2">
          <div className="w-5" /> {/* Checkbox space */}
          Rank
        </div>
        <button 
          onClick={() => handleSort('score')}
          className="col-span-2 flex items-center gap-1 hover:text-zinc-300 transition-colors"
        >
          Score
          <ArrowUpDown className={`h-3 w-3 ${sortKey === 'score' ? 'text-violet-400' : ''}`} />
        </button>
        <div className="col-span-4">pNode</div>
        <button 
          onClick={() => handleSort('uptime')}
          className="col-span-2 text-right flex items-center justify-end gap-1 hover:text-zinc-300 transition-colors"
        >
          Uptime
          <ArrowUpDown className={`h-3 w-3 ${sortKey === 'uptime' ? 'text-violet-400' : ''}`} />
        </button>
        <button 
          onClick={() => handleSort('fee')}
          className="col-span-2 text-right flex items-center justify-end gap-1 hover:text-zinc-300 transition-colors"
        >
          Fee
          <ArrowUpDown className={`h-3 w-3 ${sortKey === 'fee' ? 'text-violet-400' : ''}`} />
        </button>
        <div className="col-span-1"></div>
      </div>

      {/* Nodes */}
      <div className="divide-y divide-zinc-800/50">
        {filteredNodes.slice(0, 100).map((node, index) => {
          const badge = getBadge(node, index);
          const isExpanded = expandedId === node.id;
          const isSelected = selectedIds.includes(node.id);
          
          return (
            <div key={node.id} className={`${index < 3 ? 'bg-violet-500/[0.02]' : ''} ${isSelected ? 'bg-violet-500/[0.05]' : ''}`}>
              {/* Main Row */}
              <div 
                className="px-5 py-4 flex items-center lg:grid lg:grid-cols-12 gap-4 cursor-pointer hover:bg-zinc-800/30 transition-colors"
                onClick={() => setExpandedId(isExpanded ? null : node.id)}
              >
                {/* Checkbox + Rank */}
                <div className="lg:col-span-1 flex items-center gap-2 w-12">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSelection(node.id);
                    }}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      isSelected 
                        ? 'bg-violet-600 border-violet-600 text-white' 
                        : 'border-zinc-600 hover:border-violet-500'
                    }`}
                  >
                    {isSelected && (
                      <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </button>
                  {getRankIcon(index)}
                </div>

                {/* Score */}
                <div className="lg:col-span-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="font-semibold text-zinc-100">{node.score.toFixed(1)}</span>
                </div>

                {/* pNode Identity - GLOBE ICON */}
                <div className="lg:col-span-4 flex items-center gap-3 flex-1 lg:flex-none">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-600/20 to-cyan-600/20 border border-zinc-700 flex items-center justify-center flex-shrink-0">
                    <Globe className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-zinc-100 truncate">{node.name}</span>
                      {badge && (
                        <span className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${badge.color}`}>
                          {badge.label}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-zinc-500 font-mono">{node.shortKey}</span>
                  </div>
                </div>

                {/* Uptime - Desktop */}
                <div className="lg:col-span-2 text-right hidden lg:block">
                  <span className="font-mono text-zinc-300">{node.uptime.toFixed(1)}%</span>
                </div>

                {/* Fee - Desktop */}
                <div className="lg:col-span-2 text-right hidden lg:block">
                  <span className="font-mono text-zinc-300">{node.fee.toFixed(1)}%</span>
                </div>

                {/* Expand */}
                <div className="lg:col-span-1 flex justify-end">
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-zinc-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-zinc-500" />
                  )}
                </div>
              </div>

              {/* Expanded Row Detail */}
              {isExpanded && (
                <div className="px-5 pb-5">
                  <div className="bg-zinc-800/30 border border-zinc-700/50 rounded-xl p-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      
                      {/* STATUS Section */}
                      <div>
                        <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-3">Status</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-zinc-400">Online</span>
                            <span className={`flex items-center gap-1.5 text-sm ${node.isOnline ? 'text-emerald-400' : 'text-red-400'}`}>
                              <span className={`w-2 h-2 rounded-full ${node.isOnline ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
                              {node.isOnline ? 'Online' : 'Offline'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-zinc-400">Version</span>
                            <span className="text-sm text-zinc-300 font-mono">{node.version}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-zinc-400">Credits</span>
                            <span className="text-sm text-cyan-400 font-semibold">{node.credits.toLocaleString()}</span>
                          </div>
                          
                          {/* Performance Hint */}
                          <div className="mt-4 p-3 bg-zinc-900/50 rounded-lg border border-zinc-700/30">
                            <p className="text-xs text-zinc-500">
                              <span className="text-emerald-400">✓</span> {node.credits > 52000 ? 'High activity - earning strong STOINC' : 'Moderate activity'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* DELEGATION Section */}
                      <div>
                        <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-3">Delegation</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-zinc-400">Operator Fee</span>
                            <span className="text-sm text-amber-400 font-semibold">{node.fee}%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-zinc-400">Total Stake</span>
                            <span className="text-sm text-zinc-300">{(node.totalStake / 1000).toFixed(2)}K XAND</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-zinc-400">Delegators</span>
                            <span className="text-sm text-zinc-300">{node.delegators}</span>
                          </div>

                          {/* Pool Insight */}
                          <div className="mt-4 p-3 bg-zinc-900/50 rounded-lg border border-zinc-700/30">
                            <p className="text-xs text-zinc-500">
                              <span className="text-violet-400">ℹ</span> {node.totalStake < 30000 
                                ? 'Smaller pool = larger reward share' 
                                : 'Popular pool - more competition'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* IDENTITY Section */}
                      <div>
                        <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-3">Identity</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-zinc-400">Key</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-zinc-300 font-mono">{node.shortKey}</span>
                              <button 
                                onClick={(e) => { e.stopPropagation(); copyToClipboard(node.fullKey); }}
                                className="p-1 hover:bg-zinc-700 rounded transition-colors"
                              >
                                <Copy className="h-3 w-3 text-zinc-500" />
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-zinc-400">Location</span>
                            <span className="text-sm text-zinc-300">{node.location}</span>
                          </div>
                        </div>

                        {/* Explorer Link */}
                        <a 
                          href={`https://explorer.xandeum.com/address/${node.fullKey}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="mt-4 w-full flex items-center justify-center gap-2 px-3 py-2 bg-zinc-700/50 hover:bg-zinc-700 border border-zinc-600/50 rounded-lg text-xs text-zinc-300 transition-colors"
                        >
                          <ExternalLink className="h-3 w-3" />
                          View on Explorer
                        </a>
                      </div>

                      {/* 30-DAY PERFORMANCE */}
                      <div>
                        <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-3">30-Day Performance</h4>
                        
                        {/* Mini Sparkline Chart */}
                        <div className="h-20 bg-zinc-900/50 rounded-lg border border-zinc-700/30 p-3 mb-3">
                          <svg className="w-full h-full" viewBox="0 0 200 50" preserveAspectRatio="none">
                            {/* Grid lines */}
                            <line x1="0" y1="12.5" x2="200" y2="12.5" stroke="#27272a" strokeWidth="1" />
                            <line x1="0" y1="25" x2="200" y2="25" stroke="#27272a" strokeWidth="1" />
                            <line x1="0" y1="37.5" x2="200" y2="37.5" stroke="#27272a" strokeWidth="1" />
                            
                            {/* Performance line */}
                            <polyline
                              fill="none"
                              stroke="#22c55e"
                              strokeWidth="2"
                              points={node.performanceHistory.map((v, i) => `${i * 28},${50 - (v - 85) * 3.3}`).join(' ')}
                            />
                            
                            {/* Uptime line */}
                            <polyline
                              fill="none"
                              stroke="#8b5cf6"
                              strokeWidth="2"
                              strokeDasharray="4,2"
                              points={node.uptimeHistory.map((v, i) => `${i * 28},${50 - (v - 95) * 10}`).join(' ')}
                            />
                          </svg>
                        </div>
                        
                        {/* Legend */}
                        <div className="flex items-center gap-4 text-xs text-zinc-500 mb-4">
                          <div className="flex items-center gap-1.5">
                            <span className="w-3 h-0.5 bg-emerald-500"></span>
                            <span>Score</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-3 h-0.5 bg-violet-500"></span>
                            <span>Uptime</span>
                          </div>
                        </div>

                        {/* Calculate Button */}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCalculatorOpen(node);
                          }}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-500 rounded-lg text-sm font-medium text-white transition-colors"
                        >
                          <Calculator className="h-4 w-4" />
                          Calculate My Returns
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredNodes.length === 0 && (
        <div className="px-5 py-12 text-center">
          <p className="text-zinc-500">No nodes found matching &quot;{search}&quot;</p>
        </div>
      )}

      {/* Smart Calculator Modal */}
      {showCalculator && selectedNode && (
        <SmartCalculator 
          node={selectedNode} 
          onClose={() => setShowCalculator(false)} 
        />
      )}
    </div>
  );
}
