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

type TabType = 'leaderboard' | 'pnodes' | 'stoinc' | 'xand';

export function Leaderboard({ selectedIds, onToggleSelect }: LeaderboardProps) {
  const [nodes, setNodes] = useState<PNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('leaderboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showCount, setShowCount] = useState(10);

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

  const displayNodes = activeTab === 'leaderboard' 
    ? filteredNodes.slice(0, showCount) 
    : filteredNodes.slice(0, 10);

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
    { id: 'leaderboard', label: 'Top Validators' },
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

  // Education content for tabs - ONLY VERIFIED INFO FROM OFFICIAL DOCS
  const renderEducationContent = () => {
    if (activeTab === 'pnodes') {
      return (
        <div className="p-6 border-b border-purple-500/15">
          <div className="grid grid-cols-2 gap-6">
            {/* Left: The Problem & Solution */}
            <div>
              <h3 className="text-base font-bold text-white mb-4">The Problem pNodes Solve</h3>
              <p className="text-sm text-zinc-400 mb-4">
                Solana stores ALL data on every validator (~2,000+ copies). Not scalable for large files or data-heavy dApps.
              </p>
              <div className="space-y-2">
                <div className="p-3 border border-purple-500/15">
                  <p className="text-xs text-zinc-500 uppercase mb-1">Without pNodes</p>
                  <p className="text-sm text-zinc-400">No decentralized video, no on-chain games with assets, no large file storage</p>
                </div>
                <div className="p-3 border border-emerald-500/20 bg-emerald-500/5">
                  <p className="text-xs text-emerald-400 uppercase mb-1">With pNodes</p>
                  <p className="text-sm text-zinc-300">Configurable redundancy — data stored on selected pNodes, not every validator</p>
                </div>
              </div>
              <a 
                href="https://www.xandeum.network/storage-layer" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block mt-3 text-xs text-purple-400 hover:text-purple-300"
              >
                Source: xandeum.network/storage-layer →
              </a>
            </div>

            {/* Right: How Credits Work */}
            <div>
              <h3 className="text-base font-bold text-white mb-4">How storageCredits Work</h3>
              <div className="p-4 border border-purple-500/15 mb-3">
                <p className="text-xs text-zinc-500 uppercase mb-2">Official Formula</p>
                <code className="text-sm text-purple-300 block">
                  storageCredits = pNodes × storage × performance × stake
                </code>
              </div>
              <div className="space-y-2">
                <div className="p-3 border border-purple-500/15 flex justify-between">
                  <span className="text-sm text-zinc-400">Performance Score</span>
                  <span className="text-sm text-white">0 to 1</span>
                </div>
                <div className="p-3 border border-purple-500/15 flex justify-between">
                  <span className="text-sm text-zinc-400">If any factor = 0</span>
                  <span className="text-sm text-amber-400">No rewards that epoch</span>
                </div>
              </div>
              <a 
                href="https://www.xandeum.network/stoinc" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block mt-3 text-xs text-purple-400 hover:text-purple-300"
              >
                Source: xandeum.network/stoinc →
              </a>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'stoinc') {
      return (
        <div className="p-6 border-b border-purple-500/15">
          <div className="grid grid-cols-2 gap-6">
            {/* Left: Distribution - VERIFIED */}
            <div>
              <h3 className="text-base font-bold text-white mb-4">STOINC Distribution</h3>
              <p className="text-sm text-zinc-400 mb-4">
                STOINC (Storage Income) = SOL fees from storage-enabled dApps (sedApps)
              </p>
              <div className="flex items-center gap-6">
                <div className="relative w-24 h-24">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="20" 
                      strokeDasharray="235.6 263.9" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#a855f7" strokeWidth="20" 
                      strokeDasharray="7.5 263.9" strokeDashoffset="-235.6" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#52525b" strokeWidth="20" 
                      strokeDasharray="7.5 263.9" strokeDashoffset="-243.1" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-emerald-500" />
                    <span className="text-sm text-zinc-300">94% pNode Operators</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-500" />
                    <span className="text-sm text-zinc-300">3% XAND DAO</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-zinc-600" />
                    <span className="text-sm text-zinc-300">3% Preferred Investors</span>
                  </div>
                </div>
              </div>
              <a 
                href="https://www.xandeum.network/stoinc" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block mt-3 text-xs text-purple-400 hover:text-purple-300"
              >
                Source: xandeum.network/stoinc →
              </a>
            </div>

            {/* Right: Your Earnings */}
            <div>
              <h3 className="text-base font-bold text-white mb-4">Your STOINC Calculation</h3>
              <div className="p-4 border border-purple-500/15 mb-3">
                <p className="text-xs text-zinc-500 uppercase mb-2">Official Formula</p>
                <code className="text-xs text-purple-300 block leading-relaxed">
                  yourSTOINC = totalFees × 0.94 × (yourBoostedCredits / totalBoostedCredits)
                </code>
              </div>
              <div className="grid grid-cols-2 gap-[1px] bg-purple-500/10">
                <div className="bg-black p-3 text-center">
                  <p className="text-sm font-mono font-bold text-white">~2 days</p>
                  <p className="text-[10px] text-zinc-500">Per Epoch</p>
                </div>
                <div className="bg-black p-3 text-center">
                  <p className="text-sm font-mono font-bold text-white">SOL</p>
                  <p className="text-[10px] text-zinc-500">Paid In</p>
                </div>
              </div>
              <p className="text-xs text-zinc-500 mt-3">
                Boost factors from NFTs (1.1x to 11x) or era purchases (1.25x to 16x) multiply your credits.
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'xand') {
      return (
        <div className="p-6 border-b border-purple-500/15">
          <div className="grid grid-cols-2 gap-6">
            {/* Left: What is XAND - VERIFIED */}
            <div>
              <h3 className="text-base font-bold text-white mb-4">What is XAND?</h3>
              <p className="text-sm text-zinc-400 mb-4">
                Governance token for the Xandeum network. Staking XAND to a pNode increases its storageCredits — which means more STOINC rewards.
              </p>
              <div className="space-y-2 mb-4">
                <div className="p-3 border border-purple-500/15 flex items-center justify-between">
                  <span className="text-sm text-zinc-400">Total Supply</span>
                  <span className="text-sm font-mono text-white">4.015B</span>
                </div>
                <div className="p-3 border border-purple-500/15 flex items-center justify-between">
                  <span className="text-sm text-zinc-400">Role in Formula</span>
                  <span className="text-sm text-emerald-400">Multiplies storageCredits</span>
                </div>
                <div className="p-3 border border-purple-500/15 flex items-center justify-between">
                  <span className="text-sm text-zinc-400">Rewards Paid In</span>
                  <span className="text-sm text-white">SOL (via STOINC)</span>
                </div>
              </div>
              <div className="flex gap-2">
                <a
                  href="https://jup.ag/swap/SOL-XAND"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 text-sm text-white bg-purple-600 hover:bg-purple-500 transition-colors"
                  style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}
                >
                  Buy on Jupiter
                </a>
                <a
                  href="https://www.xandeum.network/stoinc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 text-sm text-zinc-400 border border-purple-500/20 hover:border-purple-500/40 hover:text-white transition-colors"
                >
                  STOINC Details
                </a>
              </div>
            </div>

            {/* Right: How to Delegate - HONEST */}
            <div>
              <h3 className="text-base font-bold text-white mb-4">How to Delegate to pNodes</h3>
              <div className="p-4 border border-amber-500/20 bg-amber-500/5 mb-4">
                <p className="text-xs text-amber-400 uppercase mb-2">Currently on DevNet</p>
                <p className="text-sm text-zinc-300 mb-2">
                  pNode delegation is coordinated through the Xandeum Foundation Delegation Program (XFDP).
                </p>
                <p className="text-xs text-zinc-500">
                  No public on-chain delegation UI yet. Join Discord to participate.
                </p>
              </div>
              <div className="space-y-2">
                <div className="p-3 border border-purple-500/15 flex items-center justify-between">
                  <span className="text-sm text-zinc-400">Mainnet Status</span>
                  <span className="text-sm text-cyan-400">Coming Soon</span>
                </div>
                <div className="p-3 border border-purple-500/15 flex items-center justify-between">
                  <span className="text-sm text-zinc-400">Current Access</span>
                  <span className="text-sm text-white">Via Discord/XFDP</span>
                </div>
              </div>
              <a 
                href="https://discord.com/invite/mGAxAuwnR9" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 text-sm text-white bg-[#5865F2] hover:bg-[#4752C4] transition-colors"
                style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}
              >
                Join Xandeum Discord
              </a>
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
      {activeTab === 'leaderboard' && (
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

                        {/* Stats Grid with explanations */}
                        <div className="grid grid-cols-4 gap-[1px] bg-purple-500/10 mb-4">
                          <div className="bg-black p-3">
                            <p className="text-[10px] text-zinc-600 uppercase">Rank</p>
                            <p className="text-lg font-mono font-bold text-white">#{node.rank}</p>
                            <p className="text-[10px] text-zinc-600 mt-1">
                              {node.rank <= 10 ? '🏆 Top performer' : node.rank <= 50 ? 'Strong validator' : 'Active validator'}
                            </p>
                          </div>
                          <div className="bg-black p-3">
                            <p className="text-[10px] text-cyan-400 uppercase">Credits</p>
                            <p className="text-lg font-mono font-bold text-cyan-400">{node.credits.toLocaleString()}</p>
                            <p className="text-[10px] text-zinc-600 mt-1">Proof of activity (real data)</p>
                          </div>
                          <div className="bg-black p-3">
                            <p className="text-[10px] text-zinc-600 uppercase">vs Top Node</p>
                            <p className="text-lg font-mono font-bold text-white">{activityPercent.toFixed(1)}%</p>
                            <p className="text-[10px] text-zinc-600 mt-1">
                              {activityPercent >= 90 ? 'Near leader' : activityPercent >= 70 ? 'Competitive' : 'Room to grow'}
                            </p>
                          </div>
                          <div className="bg-black p-3">
                            <p className="text-[10px] text-purple-400 uppercase">Reward Share</p>
                            <p className="text-lg font-mono font-bold text-purple-400">
                              {((node.credits / nodes.reduce((a, n) => a + n.credits, 0)) * 100).toFixed(3)}%
                            </p>
                            <p className="text-[10px] text-zinc-600 mt-1">Of 94% STOINC pool</p>
                          </div>
                        </div>

                        {/* Data Source Notice */}
                        <div className="p-3 border border-zinc-800 bg-zinc-900/50 mb-4">
                          <p className="text-xs text-zinc-500">
                            <strong className="text-zinc-400">Data from:</strong> podcredits.xandeum.network API • 
                            Credits = successful challenge responses (proves node is online & storing data)
                          </p>
                        </div>

                        {/* Stake Calculator */}
                        <StakeCalculator 
                          nodeCredits={node.credits} 
                          totalNetworkCredits={nodes.reduce((a, n) => a + n.credits, 0)}
                          nodeCount={nodes.length}
                        />

                        {/* Actions */}
                        <div className="flex gap-2 mt-4">
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

          {/* Footer with Load More */}
          <div className="px-4 py-3 border-t border-purple-500/10">
            <div className="flex items-center justify-between">
              <p className="text-xs text-zinc-600">
                Showing {displayNodes.length} of {nodes.length} validators
              </p>
              {showCount < nodes.length && (
                <button
                  onClick={() => setShowCount(prev => Math.min(prev + 15, nodes.length))}
                  className="px-4 py-2 text-xs text-purple-400 border border-purple-500/20 hover:border-purple-500/40 hover:text-white transition-colors"
                >
                  Load More ({Math.min(15, nodes.length - showCount)} more)
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Node Performance Details Component
function StakeCalculator({ nodeCredits, totalNetworkCredits, nodeCount }: { nodeCredits: number; totalNetworkCredits: number; nodeCount: number }) {
  const poolNetworkShare = (nodeCredits / totalNetworkCredits) * 100;
  const avgCredits = totalNetworkCredits / nodeCount;
  const vsAverage = (nodeCredits / avgCredits) * 100;

  return (
    <div className="p-4 border border-purple-500/15 bg-[#080808]">
      <div className="grid grid-cols-2 gap-6">
        {/* Left: Performance Metrics */}
        <div>
          <p className="text-xs text-purple-400 uppercase mb-3">Performance Metrics</p>
          <div className="space-y-2">
            <div className="p-3 border border-purple-500/10">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-zinc-500">Credits Earned</span>
                <span className="text-sm font-mono text-cyan-400">{nodeCredits.toLocaleString()}</span>
              </div>
              <p className="text-[10px] text-zinc-600">Storage work completed this epoch</p>
            </div>
            <div className="p-3 border border-purple-500/10">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-zinc-500">Network Share</span>
                <span className="text-sm font-mono text-purple-400">{poolNetworkShare.toFixed(3)}%</span>
              </div>
              <p className="text-[10px] text-zinc-600">This node's portion of total rewards</p>
            </div>
            <div className="p-3 border border-purple-500/10">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-zinc-500">vs Average</span>
                <span className={`text-sm font-mono ${vsAverage >= 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {vsAverage >= 100 ? '+' : ''}{(vsAverage - 100).toFixed(0)}%
                </span>
              </div>
              <p className="text-[10px] text-zinc-600">Compared to network average ({Math.round(avgCredits).toLocaleString()} credits)</p>
            </div>
          </div>
        </div>

        {/* Right: Coming with Mainnet */}
        <div>
          <p className="text-xs text-cyan-400 uppercase mb-3">Coming with Mainnet</p>
          <div className="space-y-2">
            <div className="p-3 border border-cyan-500/10 bg-cyan-500/5">
              <span className="text-sm text-zinc-400">Pool total stake</span>
            </div>
            <div className="p-3 border border-cyan-500/10 bg-cyan-500/5">
              <span className="text-sm text-zinc-400">Number of delegators</span>
            </div>
            <div className="p-3 border border-cyan-500/10 bg-cyan-500/5">
              <span className="text-sm text-zinc-400">Your projected share calculator</span>
            </div>
            <div className="p-3 border border-cyan-500/10 bg-cyan-500/5">
              <span className="text-sm text-zinc-400">Historical rewards tracking</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 border-l-2 border-purple-500 bg-purple-500/5">
        <p className="text-xs text-zinc-400">
          <strong className="text-purple-400">Ready to delegate?</strong> Join the Xandeum Discord to coordinate with the Foundation Delegation Program.
        </p>
      </div>
    </div>
  );
}
