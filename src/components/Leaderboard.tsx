'use client';

import { useState, useEffect } from 'react';
import { Copy, ExternalLink, Check } from 'lucide-react';

interface PNode {
  id: string;
  credits: number;
  rank: number;
}

interface LeaderboardProps {
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
}

type TabType = 'all' | 'top10' | 'pnodes' | 'stoinc' | 'xand';

export function Leaderboard({ selectedIds, onToggleSelect }: LeaderboardProps) {
  const [nodes, setNodes] = useState<PNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNodes() {
      try {
        const res = await fetch('/api/pnodes');
        const data = await res.json();
        
        if (data.success && data.nodes) {
          setNodes(data.nodes.map((node: any, index: number) => ({
            id: node.id,
            credits: node.credits,
            rank: index + 1,
          })));
        }
      } catch (error) {
        console.error('Failed to fetch nodes:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchNodes();
  }, []);

  const maxCredits = nodes.length > 0 ? nodes[0].credits : 1;

  const filteredNodes = nodes.filter(node =>
    node.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayNodes = activeTab === 'top10' 
    ? filteredNodes.slice(0, 10) 
    : filteredNodes;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getActivityBar = (credits: number) => {
    const ratio = (credits / maxCredits) * 100;
    return ratio;
  };

  const tabs: { id: TabType; label: string }[] = [
    { id: 'all', label: 'All Nodes' },
    { id: 'top10', label: 'Top 10' },
    { id: 'pnodes', label: 'What is a pNode?' },
    { id: 'stoinc', label: 'STOINC' },
    { id: 'xand', label: 'XAND' },
  ];

  if (loading) {
    return (
      <div className="border border-purple-500/15 bg-[#080808]">
        <div className="p-8 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <span className="ml-3 text-zinc-500 text-sm">Loading pNodes from network...</span>
        </div>
      </div>
    );
  }

  // Education content for tabs
  const renderEducationContent = () => {
    if (activeTab === 'pnodes') {
      return (
        <div className="p-6 border-b border-purple-500/15">
          <div className="max-w-3xl">
            <h3 className="text-lg font-bold text-white mb-3">What is a pNode?</h3>
            <p className="text-sm text-zinc-400 leading-relaxed mb-4">
              A <span className="text-purple-400 font-medium">pNode</span> (Provider Node) is a decentralized storage server on the Xandeum network. 
              pNodes store encrypted data chunks for Solana smart contracts, earning rewards for their service.
            </p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 border border-purple-500/15">
                <p className="text-xl font-mono font-bold text-white">4MB</p>
                <p className="text-[10px] text-zinc-500 uppercase">Page Size</p>
              </div>
              <div className="p-3 border border-purple-500/15">
                <p className="text-xl font-mono font-bold text-white">3x</p>
                <p className="text-[10px] text-zinc-500 uppercase">Redundancy</p>
              </div>
              <div className="p-3 border border-purple-500/15">
                <p className="text-xl font-mono font-bold text-white">~2 days</p>
                <p className="text-[10px] text-zinc-500 uppercase">Epoch Length</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'stoinc') {
      return (
        <div className="p-6 border-b border-purple-500/15">
          <div className="max-w-3xl">
            <h3 className="text-lg font-bold text-white mb-3">What is STOINC?</h3>
            <p className="text-sm text-zinc-400 leading-relaxed mb-4">
              <span className="text-emerald-400 font-medium">STOINC</span> (Storage Income) is the reward distributed to pNode operators and delegators. 
              Paid in SOL, it's calculated from storage work (credits) completed each epoch.
            </p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 border border-emerald-500/20 bg-emerald-500/5">
                <p className="text-xl font-mono font-bold text-emerald-400">94%</p>
                <p className="text-[10px] text-zinc-500 uppercase">To Operators</p>
              </div>
              <div className="p-3 border border-purple-500/15">
                <p className="text-xl font-mono font-bold text-white">3%</p>
                <p className="text-[10px] text-zinc-500 uppercase">To DAO</p>
              </div>
              <div className="p-3 border border-purple-500/15">
                <p className="text-xl font-mono font-bold text-white">3%</p>
                <p className="text-[10px] text-zinc-500 uppercase">To Investors</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'xand') {
      return (
        <div className="p-6 border-b border-purple-500/15">
          <div className="max-w-3xl">
            <h3 className="text-lg font-bold text-white mb-3">What is XAND?</h3>
            <p className="text-sm text-zinc-400 leading-relaxed mb-4">
              <span className="text-purple-400 font-medium">XAND</span> is the native token of Xandeum. 
              Staking XAND to pNodes boosts their storage credits, increasing their share of STOINC rewards. More stake = more earnings.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border border-purple-500/15">
                <p className="text-xs text-zinc-500 uppercase mb-2">How Credits Work</p>
                <code className="text-xs text-purple-300 bg-purple-500/10 px-2 py-1 block">
                  credits = pNodes × storage × performance × stake
                </code>
              </div>
              <div className="p-4 border border-purple-500/15">
                <p className="text-xs text-zinc-500 uppercase mb-2">Your Share</p>
                <code className="text-xs text-purple-300 bg-purple-500/10 px-2 py-1 block">
                  share = yourCredits / totalNetworkCredits
                </code>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="border border-purple-500/15 bg-[#080808]">
      {/* Tabs */}
      <div className="flex border-b border-purple-500/15">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-medium transition-colors relative ${
              activeTab === tab.id
                ? 'text-white bg-purple-600'
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-purple-500/5'
            }`}
            style={activeTab === tab.id ? {
              clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)'
            } : undefined}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-purple-400" />
            )}
          </button>
        ))}
        
        {/* Search - right aligned */}
        <div className="ml-auto flex items-center px-4">
          <input
            type="text"
            placeholder="Search address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-48 px-3 py-1.5 text-xs bg-black border border-purple-500/20 text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-purple-500/40"
          />
        </div>
      </div>

      {/* Education Content */}
      {renderEducationContent()}

      {/* Table Header */}
      {(activeTab === 'all' || activeTab === 'top10') && (
        <>
          <div className="grid grid-cols-12 gap-4 px-4 py-2 text-[10px] uppercase tracking-wider text-zinc-600 border-b border-purple-500/10">
            <div className="col-span-1">#</div>
            <div className="col-span-1"></div>
            <div className="col-span-5">Address</div>
            <div className="col-span-3 text-right">Credits</div>
            <div className="col-span-2 text-right">Activity</div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-purple-500/10">
            {displayNodes.map((node) => {
              const isExpanded = expandedId === node.id;
              const isSelected = selectedIds.includes(node.id);
              const activityPercent = getActivityBar(node.credits);

              return (
                <div key={node.id}>
                  {/* Main Row */}
                  <div
                    className={`grid grid-cols-12 gap-4 px-4 py-3 items-center cursor-pointer transition-colors ${
                      isSelected 
                        ? 'bg-purple-500/10 border-l-2 border-purple-500' 
                        : 'hover:bg-purple-500/5 hover:border-l-2 hover:border-purple-500/50'
                    }`}
                    onClick={() => setExpandedId(isExpanded ? null : node.id)}
                  >
                    {/* Rank */}
                    <div className="col-span-1">
                      <span className={`font-mono text-sm ${
                        node.rank <= 3 ? 'text-amber-400 font-bold' : 
                        node.rank <= 10 ? 'text-white' : 'text-zinc-500'
                      }`}>
                        {node.rank}
                      </span>
                    </div>

                    {/* Checkbox */}
                    <div className="col-span-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleSelect(node.id);
                        }}
                        className={`w-4 h-4 border flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'bg-purple-600 border-purple-600'
                            : 'border-zinc-700 hover:border-purple-500'
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3 text-white" />}
                      </button>
                    </div>

                    {/* Address */}
                    <div className="col-span-5">
                      <span className="font-mono text-sm text-zinc-300">
                        {node.id.slice(0, 8)}...{node.id.slice(-6)}
                      </span>
                    </div>

                    {/* Credits */}
                    <div className="col-span-3 text-right">
                      <span className="font-mono text-sm font-bold text-cyan-400">
                        {node.credits.toLocaleString()}
                      </span>
                    </div>

                    {/* Activity Bar */}
                    <div className="col-span-2 flex items-center gap-2 justify-end">
                      <div className="w-16 h-1.5 bg-zinc-900 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-600 to-cyan-400"
                          style={{ width: `${activityPercent}%` }}
                        />
                      </div>
                      <span className="font-mono text-[10px] text-zinc-500 w-8 text-right">
                        {activityPercent.toFixed(0)}%
                      </span>
                    </div>
                  </div>

                  {/* Expanded Detail */}
                  {isExpanded && (
                    <div className="px-4 pb-4 bg-black/50">
                      <div className="border border-purple-500/20 p-4">
                        {/* Full Address */}
                        <div className="mb-4">
                          <p className="text-[10px] uppercase tracking-wider text-zinc-600 mb-2">Full Address</p>
                          <div className="flex items-center gap-2">
                            <code className="flex-1 font-mono text-xs text-zinc-400 bg-black px-3 py-2 border border-purple-500/10 break-all">
                              {node.id}
                            </code>
                            <button
                              onClick={() => copyToClipboard(node.id, node.id)}
                              className="p-2 border border-purple-500/20 hover:border-purple-500/40 transition-colors"
                            >
                              {copiedId === node.id ? (
                                <Check className="h-3.5 w-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="h-3.5 w-3.5 text-zinc-500" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-4 gap-[1px] bg-purple-500/10 mb-4">
                          <div className="bg-black p-3">
                            <p className="text-[10px] text-zinc-600 uppercase">Rank</p>
                            <p className="text-lg font-mono font-bold text-white">#{node.rank}</p>
                          </div>
                          <div className="bg-black p-3">
                            <p className="text-[10px] text-cyan-400 uppercase">Credits</p>
                            <p className="text-lg font-mono font-bold text-cyan-400">{node.credits.toLocaleString()}</p>
                          </div>
                          <div className="bg-black p-3">
                            <p className="text-[10px] text-zinc-600 uppercase">Activity</p>
                            <p className="text-lg font-mono font-bold text-white">{activityPercent.toFixed(1)}%</p>
                          </div>
                          <div className="bg-black p-3">
                            <p className="text-[10px] text-zinc-600 uppercase">Network Share</p>
                            <p className="text-lg font-mono font-bold text-purple-400">
                              {((node.credits / nodes.reduce((a, n) => a + n.credits, 0)) * 100).toFixed(3)}%
                            </p>
                          </div>
                        </div>

                        {/* Info Box */}
                        <div className="p-3 border-l-2 border-cyan-500 bg-cyan-500/5 mb-4">
                          <p className="text-xs text-zinc-400">
                            <strong className="text-cyan-400">Credits</strong> measure storage work completed. 
                            Higher credits = more active node = more STOINC rewards earned.
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <a
                            href={`https://explorer.xandeum.com/address/${node.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-2 text-xs text-zinc-400 border border-purple-500/20 hover:border-purple-500/40 hover:text-white transition-colors"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            Explorer
                          </a>
                          <a
                            href="https://discord.gg/xandeum"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-2 text-xs text-white bg-purple-600 hover:bg-purple-500 transition-colors"
                            style={{ clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))' }}
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

          {/* Footer */}
          <div className="px-4 py-3 border-t border-purple-500/10 flex items-center justify-between">
            <p className="text-xs text-zinc-600">
              Showing {displayNodes.length} of {nodes.length} nodes • Data from pRPC
            </p>
            <p className="text-xs text-zinc-600">
              {selectedIds.length > 0 && (
                <span className="text-purple-400">{selectedIds.length} selected for comparison</span>
              )}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
