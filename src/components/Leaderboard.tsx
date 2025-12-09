'use client';

import { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Search, 
  Filter,
  ExternalLink,
  Copy,
  Check,
  Server
} from 'lucide-react';
import type { PNode, SortField, SortDirection } from '@/types';
import { formatBytes, formatPercent, truncateKey, formatStake, getGradientColor } from '@/lib/utils';

interface LeaderboardProps {
  nodes: PNode[];
  loading?: boolean;
}

export function Leaderboard({ nodes, loading }: LeaderboardProps) {
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
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-2">
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
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-xand-border bg-xand-dark/50">
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
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-4 py-4 text-sm">
                        <div className="h-4 bg-xand-border/50 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : sortedNodes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-4 text-sm text-center text-xand-text-dim py-12">
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
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
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
}

function NodeRow({ node, expanded, onToggle }: NodeRowProps) {
  const [copied, setCopied] = useState(false);

  const copyKey = () => {
    navigator.clipboard.writeText(node.publicKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <tr 
        className={`border-b border-xand-border hover:bg-xand-card-hover cursor-pointer transition-colors ${expanded ? 'bg-xand-card-hover' : ''}`}
        onClick={onToggle}
      >
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

      {/* Expanded row detail */}
      {expanded && (
        <tr className="bg-xand-dark/30">
          <td colSpan={7} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Status */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-xand-text-dim uppercase tracking-wider">Status</h4>
                <div className="space-y-2">
                  <DetailRow label="Online" value={
                    <span className={node.online 
                      ? 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-xand-green/20 text-xand-green' 
                      : 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-xand-red/20 text-xand-red'}>
                      {node.online ? 'Online' : 'Offline'}
                    </span>
                  } />
                  <DetailRow label="Version" value={node.softwareVersion} />
                  <DetailRow label="Challenges" value={`${node.challengesPassed}/${node.challengesTotal}`} />
                  <DetailRow label="Success Rate" value={formatPercent(node.challengeSuccessRate)} />
                </div>
              </div>

              {/* Staking */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-xand-text-dim uppercase tracking-wider">Staking</h4>
                <div className="space-y-2">
                  <DetailRow label="Total Stake" value={`${formatStake(node.totalStake)} XAND`} />
                  <DetailRow label="Delegators" value={node.delegatorCount.toString()} />
                  <DetailRow label="Fee" value={formatPercent(node.fee)} />
                </div>
              </div>

              {/* Identity */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-xand-text-dim uppercase tracking-wider">Identity</h4>
                <div className="space-y-2">
                  <DetailRow 
                    label="Public Key" 
                    value={
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs">{truncateKey(node.publicKey, 8)}</span>
                        <button 
                          onClick={(e) => { e.stopPropagation(); copyKey(); }}
                          className="text-xand-text-muted hover:text-xand-text"
                        >
                          {copied ? <Check className="h-3 w-3 text-xand-green" /> : <Copy className="h-3 w-3" />}
                        </button>
                      </div>
                    } 
                  />
                  {node.location && (
                    <DetailRow label="Location" value={`${node.location.city || '—'}, ${node.location.country || '—'}`} />
                  )}
                  {node.operator?.website && (
                    <DetailRow label="Website" value={
                      <a 
                        href={node.operator.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-xand-teal hover:underline flex items-center gap-1"
                      >
                        Visit <ExternalLink className="h-3 w-3" />
                      </a>
                    } />
                  )}
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
