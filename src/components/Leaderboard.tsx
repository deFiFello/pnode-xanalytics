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
            {/* Left: Simple explanation */}
            <div>
              <h3 className="text-base font-bold text-white mb-4">What is a pNode?</h3>
              <p className="text-sm text-zinc-400 mb-4">
                A storage server that earns SOL by hosting data for Solana apps.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 border border-purple-500/15">
                  <span className="text-purple-400 font-mono">1</span>
                  <span className="text-sm text-zinc-300">Stores encrypted data for dApps</span>
                </div>
                <div className="flex items-center gap-3 p-3 border border-purple-500/15">
                  <span className="text-purple-400 font-mono">2</span>
                  <span className="text-sm text-zinc-300">Proves it still has the data (earns credits)</span>
                </div>
                <div className="flex items-center gap-3 p-3 border border-purple-500/15">
                  <span className="text-purple-400 font-mono">3</span>
                  <span className="text-sm text-zinc-300">Gets paid SOL based on credits earned</span>
                </div>
              </div>
            </div>

            {/* Right: Why stake */}
            <div>
              <h3 className="text-base font-bold text-white mb-4">Why Delegate XAND?</h3>
              <p className="text-sm text-zinc-400 mb-4">
                Your XAND stake boosts the node's earning power. You share in their SOL rewards.
              </p>
              <div className="p-4 border border-emerald-500/20 bg-emerald-500/5">
                <p className="text-xs text-emerald-400 uppercase mb-2">The Formula</p>
                <code className="text-sm text-white block mb-2">
                  earnings = nodes × storage × performance × <span className="text-emerald-400">stake</span>
                </code>
                <p className="text-xs text-zinc-500">Higher stake = higher earnings for everyone in the pool</p>
              </div>
              <a 
                href="https://www.xandeum.network/stoinc" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block mt-4 text-xs text-purple-400 hover:text-purple-300"
              >
                Learn more at xandeum.network/stoinc →
              </a>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'stoinc') {
      return (
        <div className="p-6 border-b border-purple-500/15">
          <div className="grid grid-cols-2 gap-8">
            {/* Left: Distribution */}
            <div>
              <h3 className="text-base font-bold text-white mb-4">STOINC = Storage Income</h3>
              <p className="text-sm text-zinc-400 mb-6">
                SOL fees from storage-enabled dApps, distributed every ~2 days.
              </p>
              
              <div className="flex items-center gap-6 mb-4">
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
                    <span className="text-sm text-zinc-300">94% pNode Operators + Delegators</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-500" />
                    <span className="text-sm text-zinc-300">3% XAND DAO</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-zinc-600" />
                    <span className="text-sm text-zinc-300">3% Investors</span>
                  </div>
                </div>
              </div>
              
              <a 
                href="https://www.xandeum.network/stoinc" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block text-xs text-purple-400 hover:text-purple-300"
              >
                Source: xandeum.network/stoinc →
              </a>
            </div>

            {/* Right: How to Earn */}
            <div>
              <h3 className="text-base font-bold text-white mb-4">How Rewards Work</h3>
              
              <div className="space-y-3 mb-6">
                <div className="p-4 border border-purple-500/15">
                  <p className="text-[10px] text-zinc-500 uppercase mb-1">Epoch Length</p>
                  <p className="text-lg font-mono font-bold text-white">~2 days</p>
                </div>
                <div className="p-4 border border-purple-500/15">
                  <p className="text-[10px] text-zinc-500 uppercase mb-1">Paid In</p>
                  <p className="text-lg font-mono font-bold text-emerald-400">SOL</p>
                </div>
              </div>

              <div className="p-4 border border-emerald-500/20 bg-emerald-500/5">
                <p className="text-xs text-emerald-400 uppercase mb-2">Your Share</p>
                <p className="text-sm text-zinc-300">
                  (your stake ÷ pool stake) × (pool credits ÷ network credits) × 94%
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'xand') {
      return (
        <div className="p-6 border-b border-purple-500/15">
          <div className="grid grid-cols-2 gap-8">
            {/* Left: Token Info */}
            <div>
              <h3 className="text-base font-bold text-white mb-4">XAND Token</h3>
              <p className="text-sm text-zinc-400 mb-6">
                Governance token for Xandeum. Stake to pNodes to boost their earnings and share SOL rewards.
              </p>
              
              {/* Supply Stats */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-4 border border-purple-500/15">
                  <p className="text-[10px] text-zinc-500 uppercase mb-1">Total Supply</p>
                  <p className="text-lg font-mono font-bold text-white">4.015B</p>
                </div>
                <div className="p-4 border border-purple-500/15">
                  <p className="text-[10px] text-zinc-500 uppercase mb-1">Circulating</p>
                  <p className="text-lg font-mono font-bold text-emerald-400">1.3B</p>
                  <p className="text-[10px] text-zinc-600">~32%</p>
                </div>
              </div>

              {/* Role */}
              <div className="p-4 border border-emerald-500/20 bg-emerald-500/5 mb-4">
                <p className="text-xs text-emerald-400 uppercase mb-1">Your stake multiplies node earnings</p>
                <p className="text-sm text-zinc-300">Rewards paid in SOL every ~2 days</p>
              </div>

              <div className="flex gap-3">
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
                  href="https://www.xandeum.network/xand-tokenomics"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 text-sm text-zinc-400 border border-purple-500/20 hover:border-purple-500/40 hover:text-white transition-colors"
                >
                  Tokenomics
                </a>
              </div>
            </div>

            {/* Right: How to Delegate */}
            <div>
              <h3 className="text-base font-bold text-white mb-4">How to Delegate</h3>
              
              <div className="p-4 border border-cyan-500/20 bg-cyan-500/5 mb-6">
                <p className="text-xs text-cyan-400 uppercase mb-2">Currently on DevNet</p>
                <p className="text-sm text-zinc-300">
                  Delegation is coordinated through Discord and the Xandeum Foundation Delegation Program (XFDP).
                </p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 p-3 border border-purple-500/15">
                  <span className="text-purple-400 font-mono">1</span>
                  <span className="text-sm text-zinc-300">Buy XAND on Jupiter</span>
                </div>
                <div className="flex items-center gap-3 p-3 border border-purple-500/15">
                  <span className="text-purple-400 font-mono">2</span>
                  <span className="text-sm text-zinc-300">Join Xandeum Discord</span>
                </div>
                <div className="flex items-center gap-3 p-3 border border-purple-500/15">
                  <span className="text-purple-400 font-mono">3</span>
                  <span className="text-sm text-zinc-300">Coordinate delegation with XFDP team</span>
                </div>
              </div>

              <a 
                href="https://discord.com/invite/mGAxAuwnR9" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm text-white bg-[#5865F2] hover:bg-[#4752C4] transition-colors"
                style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}
              >
                Join Discord
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

      {/* Leaderboard Header */}
      {activeTab === 'leaderboard' && (
        <div className="px-4 py-3 border-b border-purple-500/10 bg-black/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-300">
                <span className="text-cyan-400 font-medium">Credits</span> = storage work completed. 
                <span className="text-zinc-500 ml-1">Higher credits = more active node = larger reward share.</span>
              </p>
            </div>
            <p className="text-[10px] text-zinc-600">Click row to expand • Check to compare</p>
          </div>
        </div>
      )}

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
