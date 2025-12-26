'use client';

import { useState, useEffect, useMemo } from 'react';
import { Copy, ExternalLink, Check, ChevronUp, ChevronDown } from 'lucide-react';

interface PNode {
  id: string;
  credits: number;
  rank: number;
  ip: string | null;
  version: string | null;
  uptime: number | null;
  uptimeFormatted: string | null;
  storage_committed: number | null;
  storage_committed_formatted: string | null;
  storage_used: number | null;
  storage_used_formatted: string | null;
  last_seen_ago: string | null;
  activityRate: number | null;
  hasStats: boolean;
}

type TabType = 'leaderboard' | 'pnodes' | 'stoinc' | 'xand';
type SortColumn = 'rank' | 'credits' | 'activity' | 'version' | 'uptime';
type SortDirection = 'asc' | 'desc';

export function Leaderboard() {
  const [nodes, setNodes] = useState<PNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('leaderboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showCount, setShowCount] = useState(10);
  const [stats, setStats] = useState<any>(null);
  const [sortColumn, setSortColumn] = useState<SortColumn>('rank');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

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
            ip: node.ip || null,
            version: node.version || null,
            uptime: node.uptime || null,
            uptimeFormatted: node.uptimeFormatted || null,
            storage_committed: node.storage_committed || null,
            storage_committed_formatted: node.storage_committed_formatted || null,
            storage_used: node.storage_used || null,
            storage_used_formatted: node.storage_used_formatted || null,
            last_seen_ago: node.last_seen_ago || null,
            activityRate: node.activityRate || null,
            hasStats: node.hasStats || false,
          })));
          
          if (data.stats) {
            setStats(data.stats);
          }
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

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      // Default directions: rank asc, others desc (highest first)
      setSortDirection(column === 'rank' ? 'asc' : 'desc');
    }
  };

  const sortedNodes = useMemo(() => {
    const filtered = nodes.filter(node =>
      node.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return [...filtered].sort((a, b) => {
      let aVal: number;
      let bVal: number;

      switch (sortColumn) {
        case 'rank':
          aVal = a.rank;
          bVal = b.rank;
          break;
        case 'credits':
          aVal = a.credits;
          bVal = b.credits;
          break;
        case 'activity':
          aVal = a.activityRate || 0;
          bVal = b.activityRate || 0;
          break;
        case 'version':
          // Sort by version string numerically
          aVal = parseFloat(a.version?.replace('v', '') || '0');
          bVal = parseFloat(b.version?.replace('v', '') || '0');
          break;
        case 'uptime':
          aVal = a.uptime || 0;
          bVal = b.uptime || 0;
          break;
        default:
          aVal = a.rank;
          bVal = b.rank;
      }

      if (sortDirection === 'asc') {
        return aVal - bVal;
      } else {
        return bVal - aVal;
      }
    });
  }, [nodes, searchQuery, sortColumn, sortDirection]);

  const displayNodes = activeTab === 'leaderboard' 
    ? sortedNodes.slice(0, showCount) 
    : sortedNodes.slice(0, 10);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getActivityBar = (credits: number) => {
    const ratio = (credits / maxCredits) * 100;
    return ratio;
  };

  const SortIcon = ({ column }: { column: SortColumn }) => {
    if (sortColumn !== column) {
      return <ChevronDown className="h-3 w-3 text-zinc-700" />;
    }
    return sortDirection === 'asc' 
      ? <ChevronUp className="h-3 w-3 text-purple-400" />
      : <ChevronDown className="h-3 w-3 text-purple-400" />;
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
        <div className="p-4 md:p-6 border-b border-purple-500/15">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Simple explanation */}
            <div>
              <h3 className="text-base font-bold text-white mb-3 md:mb-4">What is a pNode?</h3>
              <p className="text-sm text-zinc-400 mb-4">
                pNodes are Xandeum's decentralized storage layer — adding the "hard drive" to Solana's world computer.
              </p>
              <div className="space-y-2 md:space-y-3">
                <div className="flex items-center gap-3 p-2 md:p-3 border border-purple-500/15">
                  <span className="text-purple-400 font-mono">1</span>
                  <span className="text-xs md:text-sm text-zinc-300">Stores encrypted data for dApps</span>
                </div>
                <div className="flex items-center gap-3 p-2 md:p-3 border border-purple-500/15">
                  <span className="text-purple-400 font-mono">2</span>
                  <span className="text-xs md:text-sm text-zinc-300">Proves it still has the data (earns credits)</span>
                </div>
                <div className="flex items-center gap-3 p-2 md:p-3 border border-purple-500/15">
                  <span className="text-purple-400 font-mono">3</span>
                  <span className="text-xs md:text-sm text-zinc-300">Gets paid SOL based on credits earned</span>
                </div>
              </div>
              
              {/* Network milestone */}
              <div className="mt-4 p-3 border border-emerald-500/20 bg-emerald-500/5">
                <p className="text-xs text-emerald-400">✓ 300 pNodes sold out</p>
                <p className="text-[10px] text-zinc-500 mt-1">Strong early demand from operators</p>
              </div>
            </div>

            {/* Right: Why stake */}
            <div>
              <h3 className="text-base font-bold text-white mb-3 md:mb-4">Why Delegate XAND?</h3>
              <p className="text-sm text-zinc-400 mb-4">
                Your XAND stake boosts the node's earning power. You share in their SOL rewards.
              </p>
              <div className="p-3 md:p-4 border border-emerald-500/20 bg-emerald-500/5">
                <p className="text-xs text-emerald-400 uppercase mb-2">The Formula</p>
                <code className="text-xs md:text-sm text-white block mb-2">
                  earnings = nodes × storage × performance × <span className="text-emerald-400">stake</span>
                </code>
                <p className="text-xs text-zinc-500">Higher stake = higher earnings for everyone in the pool</p>
              </div>
              <a 
                href="https://www.xandeum.network/stoinc" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block mt-3 md:mt-4 text-xs text-purple-400 hover:text-purple-300"
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
        <div className="p-4 md:p-6 border-b border-purple-500/15">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Left: Distribution */}
            <div>
              <h3 className="text-base font-bold text-white mb-3 md:mb-4">STOINC = Storage Income</h3>
              <p className="text-sm text-zinc-400 mb-4 md:mb-6">
                SOL fees from storage-enabled dApps, distributed every ~2 days.
              </p>
              
              <div className="flex items-center gap-4 md:gap-6 mb-4">
                <div className="relative w-20 h-20 md:w-24 md:h-24">
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
                    <span className="text-xs md:text-sm text-zinc-300">94% Operators + Delegators</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-500" />
                    <span className="text-xs md:text-sm text-zinc-300">3% XAND DAO</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-zinc-600" />
                    <span className="text-xs md:text-sm text-zinc-300">3% Investors</span>
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
              <h3 className="text-base font-bold text-white mb-3 md:mb-4">How Rewards Work</h3>
              
              <div className="grid grid-cols-2 gap-2 md:gap-3 mb-4 md:mb-6">
                <div className="p-3 md:p-4 border border-purple-500/15">
                  <p className="text-[10px] text-zinc-500 uppercase mb-1">Epoch</p>
                  <p className="text-base md:text-lg font-mono font-bold text-white">~2 days</p>
                </div>
                <div className="p-3 md:p-4 border border-purple-500/15">
                  <p className="text-[10px] text-zinc-500 uppercase mb-1">Paid In</p>
                  <p className="text-base md:text-lg font-mono font-bold text-emerald-400">SOL</p>
                </div>
              </div>

              <div className="p-3 md:p-4 border border-emerald-500/20 bg-emerald-500/5">
                <p className="text-xs text-emerald-400 uppercase mb-2">Your Share</p>
                <p className="text-xs md:text-sm text-zinc-300">
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
        <div className="p-4 md:p-6 border-b border-purple-500/15">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Left: Token Info */}
            <div>
              <h3 className="text-base font-bold text-white mb-3 md:mb-4">XAND Token</h3>
              <p className="text-sm text-zinc-400 mb-4 md:mb-6">
                Governance token for Xandeum DAO. Stake to pNodes to boost their earnings and share SOL rewards.
              </p>
              
              {/* Supply Stats */}
              <div className="grid grid-cols-2 gap-2 md:gap-3 mb-4 md:mb-6">
                <div className="p-3 md:p-4 border border-purple-500/15">
                  <p className="text-[10px] text-zinc-500 uppercase mb-1">Total Supply</p>
                  <p className="text-base md:text-lg font-mono font-bold text-white">4.015B</p>
                </div>
                <div className="p-3 md:p-4 border border-purple-500/15">
                  <p className="text-[10px] text-zinc-500 uppercase mb-1">Circulating</p>
                  <p className="text-base md:text-lg font-mono font-bold text-emerald-400">1.3B</p>
                  <p className="text-[10px] text-zinc-600">~32%</p>
                </div>
              </div>

              {/* Verified Project Stats */}
              <div className="grid grid-cols-2 gap-2 md:gap-3 mb-4 md:mb-6">
                <div className="p-3 md:p-4 border border-purple-500/15">
                  <p className="text-[10px] text-zinc-500 uppercase mb-1">Raised</p>
                  <p className="text-base font-mono font-bold text-purple-400">$2.8M</p>
                </div>
                <div className="p-3 md:p-4 border border-purple-500/15">
                  <p className="text-[10px] text-zinc-500 uppercase mb-1">DevNet TXs</p>
                  <p className="text-base font-mono font-bold text-cyan-400">4B+</p>
                </div>
              </div>

              {/* Role */}
              <div className="p-3 md:p-4 border border-emerald-500/20 bg-emerald-500/5 mb-4">
                <p className="text-xs text-emerald-400 uppercase mb-1">Your stake multiplies node earnings</p>
                <p className="text-xs md:text-sm text-zinc-300">Rewards paid in SOL every ~2 days</p>
              </div>

              <div className="flex flex-wrap gap-2 md:gap-3">
                <a
                  href="https://jup.ag/swap/SOL-XAND"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 md:px-4 py-2 text-xs md:text-sm text-white bg-purple-600 hover:bg-purple-500 transition-colors"
                  style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}
                >
                  Buy on Jupiter
                </a>
                <a
                  href="https://www.xandeum.network/xand-tokenomics"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 md:px-4 py-2 text-xs md:text-sm text-zinc-400 border border-purple-500/20 hover:border-purple-500/40 hover:text-white transition-colors"
                >
                  Tokenomics
                </a>
              </div>
            </div>

            {/* Right: How to Delegate */}
            <div>
              <h3 className="text-base font-bold text-white mb-3 md:mb-4">How to Delegate</h3>
              
              <div className="p-3 md:p-4 border border-cyan-500/20 bg-cyan-500/5 mb-4 md:mb-6">
                <p className="text-xs text-cyan-400 uppercase mb-2">Before Mainnet</p>
                <p className="text-xs md:text-sm text-zinc-300">
                  Delegation coordinated through Discord and the Foundation Delegation Program (XFDP). Public staking coming with mainnet.
                </p>
              </div>

              <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                <div className="flex items-center gap-3 p-2 md:p-3 border border-purple-500/15">
                  <span className="text-purple-400 font-mono">1</span>
                  <span className="text-xs md:text-sm text-zinc-300">Buy XAND on Jupiter</span>
                </div>
                <div className="flex items-center gap-3 p-2 md:p-3 border border-purple-500/15">
                  <span className="text-purple-400 font-mono">2</span>
                  <span className="text-xs md:text-sm text-zinc-300">Join Xandeum Discord</span>
                </div>
                <div className="flex items-center gap-3 p-2 md:p-3 border border-purple-500/15">
                  <span className="text-purple-400 font-mono">3</span>
                  <span className="text-xs md:text-sm text-zinc-300">Coordinate with XFDP team</span>
                </div>
              </div>

              <a 
                href="https://discord.com/invite/mGAxAuwnR9" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 md:px-4 py-2 text-xs md:text-sm text-white bg-[#5865F2] hover:bg-[#4752C4] transition-colors"
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
      {/* Tabs - scrollable on mobile */}
      <div className="flex border-b border-purple-500/15 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm font-medium transition-colors relative whitespace-nowrap ${
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
        
        {/* Search - right aligned, hidden on mobile */}
        <div className="hidden md:flex ml-auto items-center px-4">
          <input
            type="text"
            placeholder="Search address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-48 px-3 py-1.5 text-xs bg-black border border-purple-500/20 text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-purple-500/40"
          />
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden p-3 border-b border-purple-500/10">
        <input
          type="text"
          placeholder="Search address..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 text-xs bg-black border border-purple-500/20 text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-purple-500/40"
        />
      </div>

      {/* Education Content */}
      {renderEducationContent()}

      {/* Leaderboard Header */}
      {activeTab === 'leaderboard' && (
        <div className="px-3 md:px-4 py-2 md:py-3 border-b border-purple-500/10 bg-black/30">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 md:gap-0">
            <div>
              <p className="text-xs md:text-sm text-zinc-300">
                <span className="text-cyan-400 font-medium">Credits</span> = storage proofs verified. 
                <span className="text-zinc-500 ml-1 hidden md:inline">Higher credits = more work done = larger reward share.</span>
              </p>
            </div>
            <p className="text-[10px] text-zinc-600">Click headers to sort • Click row for details</p>
          </div>
        </div>
      )}

      {/* Table Header */}
      {activeTab === 'leaderboard' && (
        <>
          <div className="grid grid-cols-12 gap-2 md:gap-4 px-3 md:px-4 py-2 text-[10px] uppercase tracking-wider text-zinc-600 border-b border-purple-500/10">
            <button 
              onClick={() => handleSort('rank')}
              className="col-span-2 md:col-span-1 flex items-center gap-1 hover:text-zinc-400 transition-colors"
            >
              <span>#</span>
              <SortIcon column="rank" />
            </button>
            <div className="col-span-5 md:col-span-4">Address</div>
            <button 
              onClick={() => handleSort('credits')}
              className="col-span-5 md:col-span-2 flex items-center justify-end gap-1 hover:text-zinc-400 transition-colors"
            >
              <span>Credits</span>
              <span className="hidden md:inline text-zinc-700 normal-case">work done</span>
              <SortIcon column="credits" />
            </button>
            <button 
              onClick={() => handleSort('activity')}
              className="col-span-2 hidden md:flex items-center justify-end gap-1 hover:text-zinc-400 transition-colors"
            >
              <span>Activity</span>
              <span className="text-zinc-700 normal-case">/day</span>
              <SortIcon column="activity" />
            </button>
            <button 
              onClick={() => handleSort('version')}
              className="col-span-1 hidden md:flex items-center justify-end gap-1 hover:text-zinc-400 transition-colors"
            >
              <span>Version</span>
              <SortIcon column="version" />
            </button>
            <button 
              onClick={() => handleSort('uptime')}
              className="col-span-2 hidden md:flex items-center justify-end gap-1 hover:text-zinc-400 transition-colors"
            >
              <span>Uptime</span>
              <SortIcon column="uptime" />
            </button>
          </div>

          {/* Rows */}
          <div className="divide-y divide-purple-500/10">
            {displayNodes.map((node) => {
              const isExpanded = expandedId === node.id;
              const activityPercent = getActivityBar(node.credits);

              return (
                <div key={node.id}>
                  {/* Main Row */}
                  <div
                    className={`grid grid-cols-12 gap-2 md:gap-4 px-3 md:px-4 py-2 md:py-3 items-center cursor-pointer transition-colors ${
                      isExpanded 
                        ? 'bg-purple-500/10 border-l-2 border-purple-500' 
                        : 'hover:bg-purple-500/5 hover:border-l-2 hover:border-purple-500/50'
                    }`}
                    onClick={() => setExpandedId(isExpanded ? null : node.id)}
                  >
                    {/* Rank */}
                    <div className="col-span-2 md:col-span-1">
                      <span className={`font-mono text-xs md:text-sm ${
                        node.rank <= 3 ? 'text-amber-400 font-bold' : 
                        node.rank <= 10 ? 'text-white' : 'text-zinc-500'
                      }`}>
                        {node.rank}
                      </span>
                    </div>

                    {/* Address */}
                    <div className="col-span-5 md:col-span-4">
                      <span className="font-mono text-xs md:text-sm text-zinc-300">
                        <span className="md:hidden">{node.id.slice(0, 4)}...{node.id.slice(-4)}</span>
                        <span className="hidden md:inline">{node.id.slice(0, 8)}...{node.id.slice(-4)}</span>
                      </span>
                    </div>

                    {/* Credits */}
                    <div className="col-span-5 md:col-span-2 text-right">
                      <span className="font-mono text-xs md:text-sm font-bold text-cyan-400">
                        {node.credits.toLocaleString()}
                      </span>
                    </div>

                    {/* Activity Rate - desktop only */}
                    <div className="col-span-2 hidden md:block text-right">
                      <span className={`font-mono text-xs ${node.activityRate ? 'text-purple-400' : 'text-zinc-600'}`}>
                        {node.activityRate ? `${node.activityRate.toLocaleString()}/d` : '—'}
                      </span>
                    </div>

                    {/* Version - desktop only */}
                    <div className="col-span-1 hidden md:block text-right">
                      <span className={`font-mono text-xs ${node.version ? 'text-zinc-300' : 'text-zinc-600'}`}>
                        {node.version ? node.version.split('-')[0] : '—'}
                      </span>
                    </div>

                    {/* Uptime - desktop only */}
                    <div className="col-span-2 hidden md:block text-right">
                      <span className={`font-mono text-xs ${node.uptimeFormatted ? 'text-emerald-400' : 'text-zinc-600'}`}>
                        {node.uptimeFormatted || '—'}
                      </span>
                    </div>
                  </div>

                  {/* Expanded Detail */}
                  {isExpanded && (
                    <div className="px-3 md:px-4 pb-3 md:pb-4 bg-black/50">
                      <div className="border border-purple-500/20 p-3 md:p-4">
                        {/* Full Address + IP */}
                        <div className="mb-3 md:mb-4">
                          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
                            <p className="text-[10px] uppercase tracking-wider text-zinc-600">Full Address</p>
                            {node.ip && (
                              <span className="text-[10px] text-zinc-500">
                                IP: <span className="font-mono text-zinc-400">{node.ip}</span>
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <code className="flex-1 font-mono text-[10px] md:text-xs text-zinc-400 bg-black px-2 md:px-3 py-2 border border-purple-500/10 break-all">
                              {node.id}
                            </code>
                            <button
                              onClick={() => copyToClipboard(node.id, node.id)}
                              className="p-2 border border-purple-500/20 hover:border-purple-500/40 transition-colors flex-shrink-0"
                            >
                              {copiedId === node.id ? (
                                <Check className="h-3.5 w-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="h-3.5 w-3.5 text-zinc-500" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Performance Overview */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-[1px] bg-purple-500/10 mb-3 md:mb-4">
                          <div className="bg-black p-2 md:p-3">
                            <p className="text-[10px] text-zinc-600 uppercase">Rank</p>
                            <p className="text-base md:text-lg font-mono font-bold text-white">#{node.rank}</p>
                            <p className="text-[10px] text-zinc-500 mt-1">
                              {node.rank <= 3 ? 'Top 3 — highest performers' : node.rank <= 10 ? 'Top 10 — excellent track record' : `#${node.rank} of ${nodes.length}`}
                            </p>
                          </div>
                          <div className="bg-black p-2 md:p-3">
                            <p className="text-[10px] text-cyan-400 uppercase">Credits</p>
                            <p className="text-base md:text-lg font-mono font-bold text-cyan-400">{node.credits.toLocaleString()}</p>
                            <p className="text-[10px] text-zinc-500 mt-1">Work verified = rewards earned</p>
                          </div>
                          <div className="bg-black p-2 md:p-3">
                            <p className="text-[10px] text-emerald-400 uppercase">Uptime</p>
                            <p className={`text-base md:text-lg font-mono font-bold ${node.uptimeFormatted ? 'text-emerald-400' : 'text-zinc-600'}`}>
                              {node.uptimeFormatted || '—'}
                            </p>
                            <p className="text-[10px] text-zinc-500 mt-1">
                              {node.uptime && node.uptime > 86400 * 7 ? 'Reliable — 7+ days continuously' : node.uptime ? 'Time continuously online' : 'Connecting...'}
                            </p>
                          </div>
                          <div className="bg-black p-2 md:p-3">
                            <p className="text-[10px] text-purple-400 uppercase">Network Share</p>
                            <p className="text-base md:text-lg font-mono font-bold text-purple-400">
                              {((node.credits / nodes.reduce((a, n) => a + n.credits, 0)) * 100).toFixed(3)}%
                            </p>
                            <p className="text-[10px] text-zinc-500 mt-1">This node's cut of rewards</p>
                          </div>
                        </div>

                        {/* Additional Stats (if available) */}
                        {node.hasStats && (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-[1px] bg-purple-500/10 mb-3 md:mb-4">
                            <div className="bg-black p-2 md:p-3">
                              <p className="text-[10px] text-zinc-600 uppercase">Activity Rate</p>
                              <p className="text-sm font-mono text-purple-400">
                                {node.activityRate ? `${node.activityRate.toLocaleString()}/d` : '—'}
                              </p>
                              <p className="text-[9px] text-zinc-500 mt-0.5">Higher = earning faster</p>
                            </div>
                            <div className="bg-black p-2 md:p-3">
                              <p className="text-[10px] text-zinc-600 uppercase">Version</p>
                              <p className="text-sm font-mono text-zinc-300">{node.version?.split('-')[0] || '—'}</p>
                              <p className="text-[9px] text-zinc-500 mt-0.5">Latest = well maintained</p>
                            </div>
                            <div className="bg-black p-2 md:p-3">
                              <p className="text-[10px] text-zinc-600 uppercase">Storage</p>
                              <p className="text-sm font-mono text-zinc-300">{node.storage_committed_formatted || '—'}</p>
                              <p className="text-[9px] text-zinc-500 mt-0.5">Capacity they contribute</p>
                            </div>
                            <div className="bg-black p-2 md:p-3">
                              <p className="text-[10px] text-zinc-600 uppercase">Last Seen</p>
                              <p className={`text-sm font-mono ${
                                node.last_seen_ago?.includes('Just') || node.last_seen_ago?.includes('m ago')
                                  ? 'text-emerald-400'
                                  : node.last_seen_ago?.includes('h ago')
                                    ? 'text-yellow-400'
                                    : 'text-zinc-500'
                              }`}>
                                {node.last_seen_ago || '—'}
                              </p>
                              <p className="text-[9px] text-zinc-500 mt-0.5">Recent = actively earning</p>
                            </div>
                          </div>
                        )}

                        {/* Stake Calculator */}
                        <StakeCalculator 
                          nodeCredits={node.credits} 
                          totalNetworkCredits={nodes.reduce((a, n) => a + n.credits, 0)}
                          nodeCount={nodes.length}
                        />

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2 mt-3 md:mt-4">
                          <a
                            href={`https://explorer.xandeum.com/address/${node.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-2 text-xs text-zinc-400 border border-purple-500/20 hover:border-purple-500/40 hover:text-white transition-colors"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            View on Explorer
                          </a>
                          <a
                            href="https://discord.gg/xandeum"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-2 text-xs text-white bg-purple-600 hover:bg-purple-500 transition-colors"
                            style={{ clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))' }}
                          >
                            Start Delegating →
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
                Showing {displayNodes.length} of {sortedNodes.length} validators
              </p>
              {showCount < sortedNodes.length && (
                <button
                  onClick={() => setShowCount(prev => Math.min(prev + 15, sortedNodes.length))}
                  className="px-4 py-2 text-xs text-purple-400 border border-purple-500/20 hover:border-purple-500/40 hover:text-white transition-colors"
                >
                  Load More ({Math.min(15, sortedNodes.length - showCount)} more)
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
  const avgCredits = totalNetworkCredits / nodeCount;
  const vsAverage = ((nodeCredits / avgCredits) - 1) * 100;

  return (
    <div className="p-3 md:p-4 border border-purple-500/15 bg-[#080808]">
      {/* vs Average highlight */}
      <div className="mb-3 md:mb-4 p-3 border border-purple-500/10 bg-purple-500/5">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-zinc-400">Performance vs Network</span>
            <p className="text-[10px] text-zinc-600 mt-0.5">
              {vsAverage >= 20 ? 'Outperforming most nodes' : vsAverage >= 0 ? 'Above average performer' : 'Below network average'}
            </p>
          </div>
          <span className={`text-lg font-mono font-bold ${vsAverage >= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
            {vsAverage >= 0 ? '+' : ''}{vsAverage.toFixed(0)}%
          </span>
        </div>
      </div>

      {/* What's Coming */}
      <div>
        <p className="text-[10px] text-cyan-400 uppercase mb-2">Coming with Mainnet</p>
        <p className="text-xs text-zinc-500 mb-3">These features unlock when public delegation goes live:</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          <div className="p-2 md:p-3 border border-zinc-800 bg-black/50">
            <span className="text-xs text-zinc-500">Pool stake total</span>
            <p className="text-[10px] text-zinc-600 mt-0.5">XAND delegated to this node</p>
          </div>
          <div className="p-2 md:p-3 border border-zinc-800 bg-black/50">
            <span className="text-xs text-zinc-500">Delegator count</span>
            <p className="text-[10px] text-zinc-600 mt-0.5">More = smaller individual share</p>
          </div>
          <div className="p-2 md:p-3 border border-zinc-800 bg-black/50">
            <span className="text-xs text-zinc-500">APY estimate</span>
            <p className="text-[10px] text-zinc-600 mt-0.5">Projected annual return</p>
          </div>
          <div className="p-2 md:p-3 border border-zinc-800 bg-black/50">
            <span className="text-xs text-zinc-500">Projected earnings</span>
            <p className="text-[10px] text-zinc-600 mt-0.5">Your share based on stake</p>
          </div>
          <div className="p-2 md:p-3 border border-zinc-800 bg-black/50">
            <span className="text-xs text-zinc-500">Reward history</span>
            <p className="text-[10px] text-zinc-600 mt-0.5">SOL distributions over time</p>
          </div>
          <div className="p-2 md:p-3 border border-zinc-800 bg-black/50">
            <span className="text-xs text-zinc-500">Operator fee</span>
            <p className="text-[10px] text-zinc-600 mt-0.5">% kept by node operator</p>
          </div>
        </div>
      </div>

      <div className="mt-3 md:mt-4 p-2 md:p-3 border-l-2 border-purple-500 bg-purple-500/5">
        <p className="text-xs text-zinc-400">
          <strong className="text-purple-400">Want early access?</strong> Join Discord to coordinate with the Foundation Delegation Program.
        </p>
      </div>
    </div>
  );
}
