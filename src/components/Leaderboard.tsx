'use client';

import { useState, useMemo } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Search, 
  Filter,
  ExternalLink,
  Copy,
  Check,
  Server,
  Scale
} from 'lucide-react';
import type { PNode, SortField, SortDirection } from '@/types';
import { formatBytes, formatPercent, truncateKey, formatStake, getGradientColor } from '@/lib/utils';
import { PerformanceChart, generateHistoricalData } from './PerformanceChart';

interface LeaderboardProps {
  nodes: PNode[];
  loading?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
}

export function Leaderboard({ nodes, loading, selectedIds = [], onSelectionChange }: LeaderboardProps) {
  const [sortField, setSortField] = useState<SortField>('rank');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [search, setSearch] = useState('');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const toggleSelection = (id: string) => {
    if (!onSelectionChange) return;
    
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter(i => i !== id));
    } else if (selectedIds.length < 5) {
      onSelectionChange([...selectedIds, id]);
    }
  };

  const filteredNodes = nodes.filter((node) =>
    node.name?.toLowerCase().includes(search.toLowerCase()) ||
    node.publicKey.toLowerCase().includes(search.toLowerCase())
  );

  const sortedNodes = [...filteredNodes].sort((a, b) => {
    let aVal: number;
    let bVal: number;
    
    switch (sortField) {
      case 'rank':
        aVal = a.rank;
        bVal = b.rank;
        break;
      case 'performanceScore':
        aVal = a.performanceScore;
        bVal = b.performanceScore;
        break;
      case 'uptime':
        aVal = a.uptime;
        bVal = b.uptime;
        break;
      case 'storage':
        aVal = a.storage.dedicated;
        bVal = b.storage.dedicated;
        break;
      case 'fee':
        aVal = a.fee;
        bVal = b.fee;
        break;
      case 'stake':
        aVal = a.totalStake;
        bVal = b.totalStake;
        break;
      default:
        aVal = a.rank;
        bVal = b.rank;
    }
    
    return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-xand-text">pNode Leaderboard</h2>
          <p className="text-sm text-xand-text-dim">
            {filteredNodes.length} nodes ranked by performance
            {selectedIds.length > 0 && (
              <span className="ml-2 text-xand-purple">• {selectedIds.length} selected for comparison</span>
            )}
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-2">
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 bg-xand-purple/10 border border-xand-purple/30 rounded-lg">
              <Scale className="h-4 w-4 text-xand-purple" />
              <span className="text-sm text-xand-purple font-medium">{selectedIds.length}/5</span>
            </div>
          )}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-xand-text-muted" />
            <input
              type="text"
              placeholder="Search nodes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 bg-xand-card border border-xand-border rounded-lg text-sm text-xand-text placeholder:text-xand-text-muted focus:outline-none focus:border-xand-teal/50 w-full sm:w-64"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 bg-xand-card border border-xand-border rounded-lg text-sm text-xand-text-dim hover:text-xand-text hover:border-xand-teal/50 transition-colors">
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-xand-card border border-xand-border rounded-xl p-0 overflow-hidden">
        {/* Mobile scroll hint */}
        <div className="lg:hidden px-4 py-2 bg-xand-dark/30 border-b border-xand-border text-xs text-xand-text-muted flex items-center gap-2">
          <span>←</span> Scroll to see all columns <span>→</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-xand-border bg-xand-dark/50">
                {onSelectionChange && (
                  <th className="text-left text-xs font-semibold text-xand-text-dim uppercase tracking-wider px-4 py-3 w-10">
                    <span className="sr-only">Select</span>
                  </th>
                )}
                <SortableHeader 
                  field="rank" 
                  currentField={sortField}
                  direction={sortDirection}
                  onSort={handleSort}
                >
                  Rank
                </SortableHeader>
                <SortableHeader 
                  field="performanceScore" 
                  currentField={sortField}
                  direction={sortDirection}
                  onSort={handleSort}
                >
                  Score
                </SortableHeader>
                <th className="text-left text-xs font-semibold text-xand-text-dim uppercase tracking-wider px-4 py-3">pNode</th>
                <SortableHeader 
                  field="storage" 
                  currentField={sortField}
                  direction={sortDirection}
                  onSort={handleSort}
                >
                  Storage
                </SortableHeader>
                <SortableHeader 
                  field="uptime" 
                  currentField={sortField}
                  direction={sortDirection}
                  onSort={handleSort}
                >
                  Uptime
                </SortableHeader>
                <SortableHeader 
                  field="fee" 
                  currentField={sortField}
                  direction={sortDirection}
                  onSort={handleSort}
                >
                  Fee
                </SortableHeader>
                <th className="text-left text-xs font-semibold text-xand-text-dim uppercase tracking-wider px-4 py-3 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                // Loading skeleton
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-xand-border">
                    {onSelectionChange && <td className="px-4 py-4"><div className="h-4 w-4 bg-xand-border/50 rounded animate-pulse" /></td>}
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-4 py-4 text-sm">
                        <div className="h-4 bg-xand-border/50 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : sortedNodes.length === 0 ? (
                <tr>
                  <td colSpan={onSelectionChange ? 8 : 7} className="px-4 py-4 text-sm text-center text-xand-text-dim py-12">
                    <Server className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No pNodes found</p>
                    <p className="text-xs mt-1">Waiting for pnRPC data...</p>
                  </td>
                </tr>
              ) : (
                sortedNodes.map((node) => (
                  <NodeRow 
                    key={node.id} 
                    node={node}
                    expanded={expandedRow === node.id}
                    onToggle={() => setExpandedRow(expandedRow === node.id ? null : node.id)}
                    selected={selectedIds.includes(node.id)}
                    onSelect={onSelectionChange ? () => toggleSelection(node.id) : undefined}
                    selectionDisabled={!selectedIds.includes(node.id) && selectedIds.length >= 5}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Expanded Detail - renders outside table */}
      {expandedRow && (
        <MobileExpandedDetail 
          node={sortedNodes.find(n => n.id === expandedRow)!}
          onClose={() => setExpandedRow(null)}
        />
      )}
    </div>
  );
}

interface SortableHeaderProps {
  field: SortField;
  currentField: SortField;
  direction: SortDirection;
  onSort: (field: SortField) => void;
  children: React.ReactNode;
}

function SortableHeader({ field, currentField, direction, onSort, children }: SortableHeaderProps) {
  const isActive = field === currentField;
  
  return (
    <th 
      className="text-left text-xs font-semibold text-xand-text-dim uppercase tracking-wider px-4 py-3 cursor-pointer hover:text-xand-text transition-colors group"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        <span className={`transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`}>
          {isActive && direction === 'asc' ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </span>
      </div>
    </th>
  );
}

interface NodeRowProps {
  node: PNode;
  expanded: boolean;
  onToggle: () => void;
  selected?: boolean;
  onSelect?: () => void;
  selectionDisabled?: boolean;
}

function NodeRow({ node, expanded, onToggle, selected, onSelect, selectionDisabled }: NodeRowProps) {
  const [copied, setCopied] = useState(false);
  
  // Generate historical data for this node (memoized in real app)
  const historicalData = useMemo(() => 
    generateHistoricalData(node.uptime, node.performanceScore, 30),
    [node.uptime, node.performanceScore]
  );

  const copyKey = () => {
    navigator.clipboard.writeText(node.publicKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <tr 
        className={`border-b border-xand-border hover:bg-xand-card-hover cursor-pointer transition-colors ${expanded ? 'bg-xand-card-hover' : ''} ${selected ? 'bg-xand-purple/5' : ''}`}
        onClick={onToggle}
      >
        {/* Checkbox */}
        {onSelect && (
          <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={onSelect}
              disabled={selectionDisabled}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                selected 
                  ? 'bg-xand-purple border-xand-purple' 
                  : selectionDisabled
                    ? 'border-xand-border opacity-30 cursor-not-allowed'
                    : 'border-xand-border hover:border-xand-purple'
              }`}
            >
              {selected && <Check className="h-3 w-3 text-white" />}
            </button>
          </td>
        )}
        {/* Rank */}
        <td className="px-4 py-4 text-sm">
          <div className="flex items-center gap-2">
            <span className={`font-bold ${
              node.rank === 1 ? 'text-xand-yellow' :
              node.rank === 2 ? 'text-xand-text-dim' :
              node.rank === 3 ? 'text-amber-600' :
              'text-xand-text'
            }`}>
              #{node.rank}
            </span>
          </div>
        </td>

        {/* Score */}
        <td className="px-4 py-4 text-sm">
          <div className="flex items-center gap-2">
            <div 
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: getGradientColor(node.performanceScore) }}
            />
            <span className="font-mono font-semibold">{node.performanceScore.toFixed(1)}</span>
          </div>
        </td>

        {/* pNode name/key */}
        <td className="px-4 py-4 text-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-xand-teal/20 to-xand-blue/20 flex items-center justify-center">
              <Server className="h-4 w-4 text-xand-teal" />
            </div>
            <div>
              <p className="font-medium text-xand-text">{node.name || truncateKey(node.publicKey)}</p>
              <p className="text-xs text-xand-text-muted font-mono">{truncateKey(node.publicKey, 6)}</p>
            </div>
          </div>
        </td>

        {/* Storage */}
        <td className="px-4 py-4 text-sm">
          <span className="font-mono">{formatBytes(node.storage.dedicated)}</span>
        </td>

        {/* Uptime */}
        <td className="px-4 py-4 text-sm">
          <span 
            className="font-mono"
            style={{ color: getGradientColor(node.uptime) }}
          >
            {formatPercent(node.uptime)}
          </span>
        </td>

        {/* Fee */}
        <td className="px-4 py-4 text-sm">
          <span className="font-mono">{formatPercent(node.fee)}</span>
        </td>

        {/* Expand icon */}
        <td className="px-4 py-4 text-sm">
          <ChevronDown className={`h-4 w-4 text-xand-text-muted transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </td>
      </tr>

      {/* Expanded row detail - DESKTOP ONLY */}
      {expanded && (
        <tr className="bg-xand-dark/30 hidden lg:table-row">
          <td colSpan={onSelect ? 8 : 7} className="p-0 relative">
            {/* Mobile: fixed width card that doesn't stretch with table */}
            <div className="w-screen lg:w-auto -ml-4 lg:ml-0 p-4 lg:p-6 bg-xand-dark/50 lg:bg-transparent">
              <div className="max-w-[calc(100vw-2rem)] lg:max-w-none mx-auto lg:mx-0">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
                  {/* Status */}
                  <div className="bg-xand-card/50 lg:bg-transparent rounded-lg p-3 lg:p-0 space-y-2">
                    <h4 className="text-xs font-semibold text-xand-text-dim uppercase">Status</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-xand-text-muted">Online</span>
                        <span className={node.online ? 'text-xand-green' : 'text-xand-red'}>
                          {node.online ? '● Online' : '○ Offline'}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-xand-text-muted">Version</span>
                        <span className="text-xand-text">{node.softwareVersion}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-xand-text-muted">Challenges</span>
                        <span className="text-xand-text">{node.challengesPassed}/{node.challengesTotal}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-xand-text-muted">Success</span>
                        <span className="text-xand-text">{formatPercent(node.challengeSuccessRate)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Staking */}
                  <div className="bg-xand-card/50 lg:bg-transparent rounded-lg p-3 lg:p-0 space-y-2">
                    <h4 className="text-xs font-semibold text-xand-text-dim uppercase">Staking</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-xand-text-muted">Stake</span>
                        <span className="text-xand-text">{formatStake(node.totalStake)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-xand-text-muted">Delegators</span>
                        <span className="text-xand-text">{node.delegatorCount}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-xand-text-muted">Fee</span>
                        <span className="text-xand-text">{formatPercent(node.fee)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-xand-text-muted">Efficiency</span>
                        <span className="text-xand-text">{formatPercent(node.storage.efficiency)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Identity */}
                  <div className="bg-xand-card/50 lg:bg-transparent rounded-lg p-3 lg:p-0 space-y-2">
                    <h4 className="text-xs font-semibold text-xand-text-dim uppercase">Identity</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs items-center">
                        <span className="text-xand-text-muted">Key</span>
                        <button 
                          onClick={(e) => { e.stopPropagation(); copyKey(); }}
                          className="font-mono text-xand-teal flex items-center gap-1"
                        >
                          {truncateKey(node.publicKey, 4)}
                          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        </button>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-xand-text-muted">Location</span>
                        <span className="text-xand-text">{node.location?.country || '—'}</span>
                      </div>
                      {node.operator?.name && (
                        <div className="flex justify-between text-xs">
                          <span className="text-xand-text-muted">Operator</span>
                          <span className="text-xand-text truncate max-w-[80px]">{node.operator.name}</span>
                        </div>
                      )}
                      {node.operator?.website && (
                        <div className="flex justify-between text-xs">
                          <span className="text-xand-text-muted">Website</span>
                          <a 
                            href={node.operator.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-xand-teal"
                          >
                            Visit ↗
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Chart */}
                  <div className="bg-xand-card/50 lg:bg-transparent rounded-lg p-3 lg:p-0 space-y-2">
                    <h4 className="text-xs font-semibold text-xand-text-dim uppercase">30-Day</h4>
                    <div className="h-[80px] lg:h-[100px]">
                      <PerformanceChart data={historicalData} height={80} />
                    </div>
                    <div className="flex justify-center gap-3 text-xs">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-xand-teal" /> Up</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-xand-purple" /> Perf</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-xand-text-muted">{label}</span>
      <span className="text-sm text-xand-text">{value}</span>
    </div>
  );
}

function MobileDetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-0.5">
      <span className="text-xs text-xand-text-muted">{label}</span>
      <span className="text-xs sm:text-sm text-xand-text">{value}</span>
    </div>
  );
}

// Mobile expanded detail - renders outside the table
function MobileExpandedDetail({ node, onClose }: { node: PNode; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  
  const historicalData = useMemo(() => 
    generateHistoricalData(node.uptime, node.performanceScore, 30),
    [node.uptime, node.performanceScore]
  );

  const copyKey = () => {
    navigator.clipboard.writeText(node.publicKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="lg:hidden bg-xand-card border border-xand-border rounded-xl p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-xand-teal/20 to-xand-blue/20 flex items-center justify-center">
            <Server className="h-5 w-5 text-xand-teal" />
          </div>
          <div>
            <p className="font-semibold text-xand-text">{node.name}</p>
            <p className="text-xs text-xand-text-muted">Rank #{node.rank} • Score {node.performanceScore.toFixed(1)}</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-2 text-xand-text-muted hover:text-xand-text"
        >
          <ChevronUp className="h-5 w-5" />
        </button>
      </div>

      {/* 2x2 Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Status */}
        <div className="bg-xand-dark/30 rounded-lg p-3 space-y-2">
          <h4 className="text-xs font-semibold text-xand-text-dim uppercase">Status</h4>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-xand-text-muted">Online</span>
              <span className={node.online ? 'text-xand-green' : 'text-xand-red'}>
                {node.online ? '● Yes' : '○ No'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-xand-text-muted">Version</span>
              <span className="text-xand-text">{node.softwareVersion}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xand-text-muted">Challenges</span>
              <span className="text-xand-text">{node.challengesPassed}/{node.challengesTotal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xand-text-muted">Success</span>
              <span className="text-xand-text">{formatPercent(node.challengeSuccessRate)}</span>
            </div>
          </div>
        </div>

        {/* Staking */}
        <div className="bg-xand-dark/30 rounded-lg p-3 space-y-2">
          <h4 className="text-xs font-semibold text-xand-text-dim uppercase">Staking</h4>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-xand-text-muted">Stake</span>
              <span className="text-xand-text">{formatStake(node.totalStake)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xand-text-muted">Delegators</span>
              <span className="text-xand-text">{node.delegatorCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xand-text-muted">Fee</span>
              <span className="text-xand-text">{formatPercent(node.fee)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xand-text-muted">Efficiency</span>
              <span className="text-xand-text">{formatPercent(node.storage.efficiency)}</span>
            </div>
          </div>
        </div>

        {/* Identity */}
        <div className="bg-xand-dark/30 rounded-lg p-3 space-y-2">
          <h4 className="text-xs font-semibold text-xand-text-dim uppercase">Identity</h4>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-xand-text-muted">Key</span>
              <button 
                onClick={copyKey}
                className="font-mono text-xand-teal flex items-center gap-1"
              >
                {truncateKey(node.publicKey, 4)}
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </button>
            </div>
            <div className="flex justify-between">
              <span className="text-xand-text-muted">Location</span>
              <span className="text-xand-text">{node.location?.country || '—'}</span>
            </div>
            {node.operator?.name && (
              <div className="flex justify-between">
                <span className="text-xand-text-muted">Operator</span>
                <span className="text-xand-text truncate max-w-[80px]">{node.operator.name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Chart */}
        <div className="bg-xand-dark/30 rounded-lg p-3 space-y-2">
          <h4 className="text-xs font-semibold text-xand-text-dim uppercase">30-Day</h4>
          <div className="h-[70px]">
            <PerformanceChart data={historicalData} height={70} />
          </div>
          <div className="flex justify-center gap-3 text-xs">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-xand-teal" /> Up
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-xand-purple" /> Perf
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
