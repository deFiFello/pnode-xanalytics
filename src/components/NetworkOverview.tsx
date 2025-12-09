'use client';

import { 
  Server, 
  HardDrive, 
  Coins, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  Activity,
  RefreshCw
} from 'lucide-react';
import type { NetworkStats, TokenPrice } from '@/types';
import { formatBytes, formatNumber, formatPercent, formatTimeAgo } from '@/lib/utils';
import { formatPrice, formatChange } from '@/lib/coingecko';

interface NetworkOverviewProps {
  stats: NetworkStats | null;
  price: TokenPrice | null;
  loading?: boolean;
  onRefresh?: () => void;
}

export function NetworkOverview({ stats, price, loading, onRefresh }: NetworkOverviewProps) {
  return (
    <div className="space-y-4">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-xand-text">Network Overview</h2>
          <p className="text-sm text-xand-text-dim">
            Real-time statistics from Xandeum DevNet
          </p>
        </div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-xand-text-dim hover:text-xand-text rounded-lg border border-xand-border hover:border-xand-teal/50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        )}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active pNodes */}
        <StatCard
          icon={<Server className="h-5 w-5" />}
          label="Active pNodes"
          value={stats ? formatNumber(stats.activePNodes) : '—'}
          subValue={stats ? `${formatNumber(stats.totalPNodes)} total` : undefined}
          color="teal"
          loading={loading}
        />

        {/* Network Storage */}
        <StatCard
          icon={<HardDrive className="h-5 w-5" />}
          label="Network Storage"
          value={stats?.totalStorage ? formatBytes(stats.totalStorage.dedicated) : '—'}
          subValue={stats?.totalStorage ? `${formatPercent(stats.totalStorage.utilizationPercent)} utilized` : undefined}
          color="blue"
          loading={loading}
        />

        {/* XAND Price */}
        <StatCard
          icon={<Coins className="h-5 w-5" />}
          label="XAND Price"
          value={price ? formatPrice(price.usd) : '—'}
          subValue={price ? formatChange(price.change24h) : undefined}
          subValueColor={price && price.change24h >= 0 ? 'green' : 'red'}
          trend={price ? (price.change24h >= 0 ? 'up' : 'down') : undefined}
          color="purple"
          loading={loading}
        />

        {/* Current Epoch */}
        <StatCard
          icon={<Clock className="h-5 w-5" />}
          label="Current Epoch"
          value={stats ? formatNumber(stats.currentEpoch) : '—'}
          subValue={stats ? `${formatPercent(stats.epochProgress)} complete` : undefined}
          progress={stats?.epochProgress}
          color="yellow"
          loading={loading}
        />
      </div>

      {/* Last updated */}
      {stats && (
        <div className="flex items-center gap-2 text-xs text-xand-text-muted">
          <Activity className="h-3 w-3" />
          <span>Last synced {formatTimeAgo(stats.lastUpdated)}</span>
          <span className="text-xand-border">•</span>
          <span>Slot #{formatNumber(stats.currentSlot)}</span>
        </div>
      )}
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subValue?: string;
  subValueColor?: 'green' | 'red' | 'default';
  trend?: 'up' | 'down';
  progress?: number;
  color: 'teal' | 'blue' | 'purple' | 'yellow';
  loading?: boolean;
}

function StatCard({ 
  icon, 
  label, 
  value, 
  subValue, 
  subValueColor = 'default',
  trend,
  progress,
  color,
  loading 
}: StatCardProps) {
  const gradientClasses = {
    teal: 'from-xand-teal/20',
    blue: 'from-xand-blue/20',
    purple: 'from-xand-purple/20',
    yellow: 'from-xand-yellow/20',
  };

  const iconColorClasses = {
    teal: 'text-xand-teal',
    blue: 'text-xand-blue',
    purple: 'text-xand-purple',
    yellow: 'text-xand-yellow',
  };

  const progressColorClasses = {
    teal: 'bg-xand-teal',
    blue: 'bg-xand-blue',
    purple: 'bg-xand-purple',
    yellow: 'bg-xand-yellow',
  };

  const subValueColorClasses = {
    green: 'text-xand-green',
    red: 'text-xand-red',
    default: 'text-xand-text-dim',
  };

  return (
    <div className={`bg-xand-card border border-xand-border rounded-xl p-6 relative overflow-hidden bg-gradient-to-br ${gradientClasses[color]} to-transparent`}>
      {/* Background glow */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradientClasses[color]} rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2`} />
      
      <div className="relative">
        {/* Icon */}
        <div className={`inline-flex p-2 rounded-lg bg-xand-dark/50 ${iconColorClasses[color]}`}>
          {icon}
        </div>

        {/* Value */}
        <div className="mt-4">
          {loading ? (
            <div className="h-8 w-24 bg-xand-border/50 rounded animate-pulse" />
          ) : (
            <p className="text-3xl font-bold text-xand-text tracking-tight">{value}</p>
          )}
        </div>

        {/* Label */}
        <p className="text-sm text-xand-text-dim uppercase tracking-wider mt-1">{label}</p>

        {/* Sub value */}
        {subValue && !loading && (
          <div className={`flex items-center gap-1 mt-2 text-sm ${subValueColorClasses[subValueColor]}`}>
            {trend === 'up' && <TrendingUp className="h-3 w-3" />}
            {trend === 'down' && <TrendingDown className="h-3 w-3" />}
            <span>{subValue}</span>
          </div>
        )}

        {/* Progress bar */}
        {progress !== undefined && !loading && (
          <div className="mt-3 h-1.5 bg-xand-dark/50 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${progressColorClasses[color]}`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
