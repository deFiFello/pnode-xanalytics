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
          <div className="max-w-4xl">
            <h3 className="text-lg font-bold text-white mb-3">What is a pNode?</h3>
            <p className="text-sm text-zinc-400 leading-relaxed mb-6">
              A <span className="text-purple-400 font-medium">pNode</span> is a storage server that earns rewards by storing data for Solana apps. 
              As a staker, you delegate XAND tokens to pNodes to boost their earnings — and share in the rewards.
            </p>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="p-4 border border-purple-500/15 bg-purple-500/5">
                <p className="text-xs text-zinc-500 uppercase mb-2">Why it matters to you</p>
                <p className="text-sm text-zinc-300">pNodes with more credits earn more SOL rewards. Pick active nodes.</p>
              </div>
              <div className="p-4 border border-purple-500/15 bg-purple-500/5">
                <p className="text-xs text-zinc-500 uppercase mb-2">What to look for</p>
                <p className="text-sm text-zinc-300">High credits = reliable. Network share shows their slice of total rewards.</p>
              </div>
              <div className="p-4 border border-purple-500/15 bg-purple-500/5">
                <p className="text-xs text-zinc-500 uppercase mb-2">How to delegate</p>
                <p className="text-sm text-zinc-300">Join Discord, find a node address here, coordinate delegation with the team.</p>
              </div>
            </div>

            <div className="p-4 border-l-2 border-cyan-500 bg-cyan-500/5">
              <p className="text-xs text-cyan-400 font-medium mb-1">Key Insight</p>
              <p className="text-sm text-zinc-400">
                Credits are the <strong className="text-white">only real metric</strong> from the network API. 
                Higher credits = more storage work done = more STOINC rewards earned.
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'stoinc') {
      return (
        <div className="p-6 border-b border-purple-500/15">
          <div className="max-w-4xl">
            <h3 className="text-lg font-bold text-white mb-3">How STOINC Rewards Work</h3>
            <p className="text-sm text-zinc-400 leading-relaxed mb-6">
              <span className="text-emerald-400 font-medium">STOINC</span> (Storage Income) is paid in SOL every ~2 days (each epoch). 
              Your share depends on how many credits your chosen pNode earns.
            </p>
            
            {/* Pie Chart */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="p-4 border border-purple-500/15">
                <p className="text-xs text-zinc-500 uppercase mb-4">Reward Distribution</p>
                <div className="flex items-center gap-6">
                  {/* Simple visual pie */}
                  <div className="relative w-32 h-32">
                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                      {/* 94% - Operators */}
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="20" 
                        strokeDasharray="235.6 263.9" />
                      {/* 3% - DAO */}
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#a855f7" strokeWidth="20" 
                        strokeDasharray="7.5 263.9" strokeDashoffset="-235.6" />
                      {/* 3% - Investors */}
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#71717a" strokeWidth="20" 
                        strokeDasharray="7.5 263.9" strokeDashoffset="-243.1" />
                    </svg>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-emerald-500" />
                      <span className="text-zinc-300">94% to Operators & Delegators</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-500" />
                      <span className="text-zinc-300">3% to XAND DAO</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-zinc-500" />
                      <span className="text-zinc-300">3% to Investors</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-purple-500/15">
                <p className="text-xs text-zinc-500 uppercase mb-4">Your Share Calculation</p>
                <div className="space-y-3">
                  <div className="p-3 bg-black border border-purple-500/10">
                    <code className="text-xs text-purple-300">
                      yourShare = (yourStake / poolTotalStake) × poolCredits / networkCredits
                    </code>
                  </div>
                  <p className="text-xs text-zinc-500">
                    Example: If you stake 10,000 XAND to a pool with 100,000 total, you get 10% of that pool's rewards.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 border-l-2 border-emerald-500 bg-emerald-500/5">
              <p className="text-xs text-emerald-400 font-medium mb-1">Bottom Line</p>
              <p className="text-sm text-zinc-400">
                Pick nodes with <strong className="text-white">high credits</strong> (they earn more). 
                Your STOINC = your share of that node's total earnings.
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'xand') {
      return (
        <div className="p-6 border-b border-purple-500/15">
          <div className="max-w-4xl">
            <h3 className="text-lg font-bold text-white mb-3">XAND Token & Staking</h3>
            <p className="text-sm text-zinc-400 leading-relaxed mb-6">
              <span className="text-purple-400 font-medium">XAND</span> is the network token. 
              Staking XAND to a pNode increases its credit multiplier, meaning more rewards for everyone in that pool.
            </p>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="p-4 border border-purple-500/15">
                <p className="text-xs text-zinc-500 uppercase mb-2">No Lockup</p>
                <p className="text-2xl font-bold text-white mb-1">0 days</p>
                <p className="text-xs text-zinc-500">Withdraw anytime</p>
              </div>
              <div className="p-4 border border-purple-500/15">
                <p className="text-xs text-zinc-500 uppercase mb-2">No Minimum</p>
                <p className="text-2xl font-bold text-white mb-1">Any amount</p>
                <p className="text-xs text-zinc-500">Stake what you want</p>
              </div>
              <div className="p-4 border border-purple-500/15">
                <p className="text-xs text-zinc-500 uppercase mb-2">Reward Frequency</p>
                <p className="text-2xl font-bold text-white mb-1">~2 days</p>
                <p className="text-xs text-zinc-500">Per epoch</p>
              </div>
            </div>

            <div className="flex gap-3">
              <a
                href="https://www.mexc.com/exchange/XAND_USDT"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-sm text-white bg-purple-600 hover:bg-purple-500 transition-colors"
                style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}
              >
                Buy XAND on MEXC
              </a>
              <a
                href="https://www.xandeum.network/xand-tokenomics"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-sm text-zinc-400 border border-purple-500/20 hover:border-purple-500/40 hover:text-white transition-colors"
              >
                View Tokenomics
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

                        {/* Stats Grid with explanations */}
                        <div className="grid grid-cols-4 gap-[1px] bg-purple-500/10 mb-4">
                          <div className="bg-black p-3">
                            <p className="text-[10px] text-zinc-600 uppercase">Rank</p>
                            <p className="text-lg font-mono font-bold text-white">#{node.rank}</p>
                            <p className="text-[10px] text-zinc-600 mt-1">Position by credits</p>
                          </div>
                          <div className="bg-black p-3">
                            <p className="text-[10px] text-cyan-400 uppercase">Credits</p>
                            <p className="text-lg font-mono font-bold text-cyan-400">{node.credits.toLocaleString()}</p>
                            <p className="text-[10px] text-zinc-600 mt-1">Storage work done</p>
                          </div>
                          <div className="bg-black p-3">
                            <p className="text-[10px] text-zinc-600 uppercase">Activity</p>
                            <p className="text-lg font-mono font-bold text-white">{activityPercent.toFixed(1)}%</p>
                            <p className="text-[10px] text-zinc-600 mt-1">vs top node ({maxCredits.toLocaleString()})</p>
                          </div>
                          <div className="bg-black p-3">
                            <p className="text-[10px] text-zinc-600 uppercase">Network Share</p>
                            <p className="text-lg font-mono font-bold text-purple-400">
                              {((node.credits / nodes.reduce((a, n) => a + n.credits, 0)) * 100).toFixed(3)}%
                            </p>
                            <p className="text-[10px] text-zinc-600 mt-1">of total {(nodes.reduce((a, n) => a + n.credits, 0) / 1000000).toFixed(1)}M credits</p>
                          </div>
                        </div>

                        {/* Stake Calculator */}
                        <StakeCalculator 
                          nodeCredits={node.credits} 
                          totalNetworkCredits={nodes.reduce((a, n) => a + n.credits, 0)}
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

// Stake Calculator Component
function StakeCalculator({ nodeCredits, totalNetworkCredits }: { nodeCredits: number; totalNetworkCredits: number }) {
  const [stakeAmount, setStakeAmount] = useState(10000);
  
  // Simulated pool total stake (we don't have real data, so this is illustrative)
  const estimatedPoolStake = 50000; // Assume 50K XAND already in pool
  
  // Calculate what share you'd get
  const yourShareOfPool = (stakeAmount / (estimatedPoolStake + stakeAmount)) * 100;
  const poolNetworkShare = (nodeCredits / totalNetworkCredits) * 100;
  const yourNetworkShare = (yourShareOfPool / 100) * poolNetworkShare;

  return (
    <div className="p-4 border border-emerald-500/20 bg-emerald-500/5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-emerald-400 font-medium uppercase">Stake Calculator</p>
        <span className="text-[10px] px-2 py-0.5 bg-amber-500/20 text-amber-400">ILLUSTRATIVE</span>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Input */}
        <div>
          <p className="text-[10px] text-zinc-500 uppercase mb-2">If you stake</p>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full px-3 py-2 text-sm font-mono bg-black border border-purple-500/20 text-white focus:outline-none focus:border-purple-500/40"
            />
            <span className="text-xs text-zinc-500">XAND</span>
          </div>
          <div className="flex gap-2 mt-2">
            {[1000, 10000, 50000, 100000].map(amount => (
              <button
                key={amount}
                onClick={() => setStakeAmount(amount)}
                className={`px-2 py-1 text-[10px] border transition-colors ${
                  stakeAmount === amount 
                    ? 'border-purple-500 text-purple-400' 
                    : 'border-purple-500/20 text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {amount >= 1000 ? `${amount/1000}K` : amount}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-500">Your pool share:</span>
            <span className="text-sm font-mono text-white">{yourShareOfPool.toFixed(2)}%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-500">This pool's network share:</span>
            <span className="text-sm font-mono text-purple-400">{poolNetworkShare.toFixed(3)}%</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-emerald-500/20">
            <span className="text-[10px] text-emerald-400">Your effective network share:</span>
            <span className="text-sm font-mono font-bold text-emerald-400">{yourNetworkShare.toFixed(4)}%</span>
          </div>
        </div>
      </div>

      <p className="text-[10px] text-zinc-600 mt-3">
        * Pool stake (50K XAND) is estimated. Real delegation data not available via API. 
        Your actual share depends on total stake in the pool.
      </p>
    </div>
  );
}
