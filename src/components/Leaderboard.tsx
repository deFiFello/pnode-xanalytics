'use client';

import { useState, useEffect } from 'react';
import { Globe, Search, Copy, ExternalLink, ChevronDown, ChevronUp, Trophy, Check } from 'lucide-react';

interface PNode {
  id: string;
  credits: number;
  rank: number;
}

interface LeaderboardProps {
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
}

export function Leaderboard({ selectedIds, onToggleSelect }: LeaderboardProps) {
  const [nodes, setNodes] = useState<PNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(20);

  useEffect(() => {
    async function fetchNodes() {
      try {
        const res = await fetch('/api/pnodes');
        const data = await res.json();
        
        if (data.success && data.nodes) {
          // Only keep real data: id, credits, and calculate rank
          const cleanNodes = data.nodes.map((node: any, index: number) => ({
            id: node.id,
            credits: node.credits,
            rank: index + 1,
          }));
          setNodes(cleanNodes);
        }
      } catch (error) {
        console.error('Failed to fetch nodes:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchNodes();
  }, []);

  const filteredNodes = nodes.filter(node =>
    node.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const visibleNodes = filteredNodes.slice(0, visibleCount);
  const maxCredits = nodes.length > 0 ? nodes[0].credits : 1;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatCredits = (credits: number) => {
    if (credits >= 1000000) return `${(credits / 1000000).toFixed(2)}M`;
    if (credits >= 1000) return `${(credits / 1000).toFixed(1)}K`;
    return credits.toString();
  };

  const getActivityLevel = (credits: number) => {
    const ratio = credits / maxCredits;
    if (ratio >= 0.8) return { label: 'Very High', color: 'text-emerald-400', bg: 'bg-emerald-500' };
    if (ratio >= 0.5) return { label: 'High', color: 'text-cyan-400', bg: 'bg-cyan-500' };
    if (ratio >= 0.2) return { label: 'Medium', color: 'text-amber-400', bg: 'bg-amber-500' };
    return { label: 'Low', color: 'text-zinc-400', bg: 'bg-zinc-500' };
  };

  if (loading) {
    return (
      <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-8">
        <div className="flex items-center justify-center gap-3">
          <div className="w-5 h-5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-400">Loading pNodes from network...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top 3 */}
      {nodes.length >= 3 && (
        <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-800/50">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-400" />
              <h3 className="font-semibold text-zinc-100">Top Performers</h3>
            </div>
            <p className="text-sm text-zinc-500 mt-1">Highest activity credits on the network</p>
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            {nodes.slice(0, 3).map((node, i) => {
              const activity = getActivityLevel(node.credits);
              return (
                <div
                  key={node.id}
                  className="bg-zinc-800/30 border border-zinc-700/30 rounded-xl p-4 hover:border-violet-500/30 transition-colors cursor-pointer"
                  onClick={() => setExpandedId(expandedId === node.id ? null : node.id)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`px-2 py-0.5 rounded text-xs font-bold ${
                      i === 0 ? 'bg-amber-500/20 text-amber-400' :
                      i === 1 ? 'bg-zinc-500/20 text-zinc-300' :
                      'bg-orange-500/20 text-orange-400'
                    }`}>
                      #{i + 1}
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-zinc-700/50 flex items-center justify-center">
                      <Globe className="h-4 w-4 text-cyan-400" />
                    </div>
                  </div>
                  <p className="font-mono text-sm text-zinc-300 truncate mb-2">
                    {node.id.slice(0, 8)}...{node.id.slice(-4)}
                  </p>
                  <div>
                    <p className="text-2xl font-bold text-cyan-400">{formatCredits(node.credits)}</p>
                    <p className="text-xs text-zinc-500">credits</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Leaderboard */}
      <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800/50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-zinc-100">All pNodes</h2>
              <p className="text-sm text-zinc-500">
                {filteredNodes.length} nodes • Ranked by activity credits
                {selectedIds.length > 0 && (
                  <span className="ml-2 text-violet-400">• {selectedIds.length} selected for comparison</span>
                )}
              </p>
            </div>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search by address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-64 pl-10 pr-4 py-2 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-violet-500/50"
              />
            </div>
          </div>
        </div>

        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-zinc-800/30 text-xs text-zinc-500 uppercase tracking-wide">
          <div className="col-span-1">Rank</div>
          <div className="col-span-1">Select</div>
          <div className="col-span-5">pNode Address</div>
          <div className="col-span-3 text-right">Credits</div>
          <div className="col-span-2 text-right">Activity</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-zinc-800/50">
          {visibleNodes.map((node) => {
            const isExpanded = expandedId === node.id;
            const isSelected = selectedIds.includes(node.id);
            const activity = getActivityLevel(node.credits);
            const creditRatio = (node.credits / maxCredits) * 100;

            return (
              <div key={node.id}>
                {/* Main Row */}
                <div
                  className={`grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-zinc-800/20 transition-colors cursor-pointer ${
                    isSelected ? 'bg-violet-500/5 border-l-2 border-violet-500' : ''
                  }`}
                  onClick={() => setExpandedId(isExpanded ? null : node.id)}
                >
                  {/* Rank */}
                  <div className="col-span-2 md:col-span-1">
                    <span className={`font-mono font-bold ${
                      node.rank <= 3 ? 'text-amber-400' : 
                      node.rank <= 10 ? 'text-zinc-200' : 'text-zinc-500'
                    }`}>
                      #{node.rank}
                    </span>
                  </div>

                  {/* Checkbox */}
                  <div className="col-span-2 md:col-span-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSelect(node.id);
                      }}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-violet-500 border-violet-500'
                          : 'border-zinc-600 hover:border-violet-500'
                      }`}
                    >
                      {isSelected && <Check className="h-3 w-3 text-white" />}
                    </button>
                  </div>

                  {/* Address */}
                  <div className="col-span-8 md:col-span-5 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-zinc-700/50 flex items-center justify-center flex-shrink-0">
                      <Globe className="h-4 w-4 text-cyan-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-mono text-sm text-zinc-200 truncate">
                        {node.id.slice(0, 12)}...{node.id.slice(-6)}
                      </p>
                    </div>
                  </div>

                  {/* Credits */}
                  <div className="hidden md:block col-span-3 text-right">
                    <p className="font-mono text-lg font-bold text-cyan-400">
                      {node.credits.toLocaleString()}
                    </p>
                  </div>

                  {/* Activity Bar */}
                  <div className="hidden md:flex col-span-2 items-center gap-2 justify-end">
                    <div className="w-20 h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${activity.bg} rounded-full`}
                        style={{ width: `${creditRatio}%` }}
                      />
                    </div>
                    <span className={`text-xs font-medium ${activity.color}`}>
                      {activity.label}
                    </span>
                  </div>
                </div>

                {/* Expanded Detail */}
                {isExpanded && (
                  <div className="px-6 pb-6 bg-zinc-800/20">
                    <div className="bg-zinc-900/50 border border-zinc-700/30 rounded-xl p-5 space-y-4">
                      {/* Full Address */}
                      <div>
                        <p className="text-xs text-zinc-500 uppercase tracking-wide mb-2">Full Address</p>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 font-mono text-sm text-zinc-300 bg-zinc-800/50 px-3 py-2 rounded-lg break-all">
                            {node.id}
                          </code>
                          <button
                            onClick={() => copyToClipboard(node.id, node.id)}
                            className="p-2 hover:bg-zinc-700/50 rounded-lg transition-colors"
                          >
                            {copiedId === node.id ? (
                              <Check className="h-4 w-4 text-emerald-400" />
                            ) : (
                              <Copy className="h-4 w-4 text-zinc-500" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-zinc-800/30 rounded-lg p-3">
                          <p className="text-xs text-zinc-500 mb-1">Rank</p>
                          <p className="text-xl font-bold text-zinc-100">#{node.rank}</p>
                        </div>
                        <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-3">
                          <p className="text-xs text-cyan-400 mb-1">Credits</p>
                          <p className="text-xl font-bold text-cyan-400">{node.credits.toLocaleString()}</p>
                        </div>
                        <div className="bg-zinc-800/30 rounded-lg p-3">
                          <p className="text-xs text-zinc-500 mb-1">Activity Level</p>
                          <p className={`text-xl font-bold ${activity.color}`}>{activity.label}</p>
                        </div>
                        <div className="bg-zinc-800/30 rounded-lg p-3">
                          <p className="text-xs text-zinc-500 mb-1">Network Share</p>
                          <p className="text-xl font-bold text-zinc-100">{creditRatio.toFixed(1)}%</p>
                        </div>
                      </div>

                      {/* What Credits Mean */}
                      <div className="bg-violet-500/10 border border-violet-500/20 rounded-lg p-4">
                        <p className="text-sm text-violet-300">
                          <strong>Credits</strong> represent storage work completed. Higher credits indicate a more active and reliable node that has earned more STOINC rewards.
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-3">
                        <a
                          href={`https://explorer.xandeum.com/address/${node.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-zinc-700/50 hover:bg-zinc-600/50 rounded-lg text-sm text-zinc-200 transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                          View on Explorer
                        </a>
                        <a
                          href="https://discord.gg/xandeum"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-lg text-sm text-white font-medium transition-colors"
                        >
                          Delegate via Discord
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Load More */}
        {visibleCount < filteredNodes.length && (
          <div className="px-6 py-4 border-t border-zinc-800/50">
            <button
              onClick={() => setVisibleCount(prev => prev + 20)}
              className="w-full py-2 text-sm text-violet-400 hover:text-violet-300 transition-colors"
            >
              Load more ({filteredNodes.length - visibleCount} remaining)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
