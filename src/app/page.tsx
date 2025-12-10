'use client';

import { useEffect, useState, useCallback } from 'react';
import { NetworkOverview } from '@/components/NetworkOverview';
import { Leaderboard } from '@/components/Leaderboard';
import { ComparisonTool } from '@/components/ComparisonTool';
import { NetworkMap } from '@/components/NetworkMap';
import { getNetworkStats } from '@/lib/xandeum';
import { getXandPrice } from '@/lib/coingecko';
import type { NetworkStats, TokenPrice, PNode } from '@/types';

// Expanded mock pNode data (21 nodes) until pnRPC is available
const mockPNodes: PNode[] = [
  {
    id: '1',
    publicKey: '7vNDz3a3FEg6PQhbpR5mKxNnbYQh5qgS8V5qsZ1yXz2w',
    name: 'XandNode Alpha',
    rank: 1,
    performanceScore: 98.7,
    online: true,
    softwareVersion: 'v0.6.2',
    lastSeen: new Date(),
    storage: { dedicated: 4 * 1024 ** 4, used: 2.1 * 1024 ** 4, available: 1.9 * 1024 ** 4, efficiency: 95 },
    uptime: 99.92,
    latency: 12,
    challengesPassed: 2847,
    challengesTotal: 2850,
    challengeSuccessRate: 99.89,
    fee: 2,
    totalStake: 125000 * 1e9,
    delegatorCount: 47,
    operator: { name: 'Alpha Ops', website: 'https://alpha-ops.io' },
    location: { country: 'Germany', city: 'Frankfurt' },
  },
  {
    id: '2',
    publicKey: '9kMPz4b4HEg7QRibpS6mLxOnbZRi6rgT9W6rtA2yYa3x',
    name: 'StorageMax Pro',
    rank: 2,
    performanceScore: 97.2,
    online: true,
    softwareVersion: 'v0.6.2',
    lastSeen: new Date(),
    storage: { dedicated: 8 * 1024 ** 4, used: 5.2 * 1024 ** 4, available: 2.8 * 1024 ** 4, efficiency: 92 },
    uptime: 99.45,
    latency: 18,
    challengesPassed: 2812,
    challengesTotal: 2850,
    challengeSuccessRate: 98.67,
    fee: 3,
    totalStake: 98000 * 1e9,
    delegatorCount: 32,
    operator: { name: 'StorageMax Inc' },
    location: { country: 'USA', city: 'Virginia' },
  },
  {
    id: '3',
    publicKey: '3bNQy5c5JFg8RSjcqT7nMxPocaSTj7shU0X7suB3Zb4y',
    name: 'DecentralStore',
    rank: 3,
    performanceScore: 95.8,
    online: true,
    softwareVersion: 'v0.6.1',
    lastSeen: new Date(),
    storage: { dedicated: 2 * 1024 ** 4, used: 1.4 * 1024 ** 4, available: 0.6 * 1024 ** 4, efficiency: 88 },
    uptime: 98.12,
    latency: 25,
    challengesPassed: 2789,
    challengesTotal: 2850,
    challengeSuccessRate: 97.86,
    fee: 5,
    totalStake: 67000 * 1e9,
    delegatorCount: 18,
    location: { country: 'Singapore', city: 'Singapore' },
  },
  {
    id: '4',
    publicKey: '5cORz6d6KGh9STkdrU8oNyQpdbtUk8tiV1Y8tvC4Ac5z',
    name: 'NodeRunner EU',
    rank: 4,
    performanceScore: 94.1,
    online: true,
    softwareVersion: 'v0.6.2',
    lastSeen: new Date(),
    storage: { dedicated: 6 * 1024 ** 4, used: 4.8 * 1024 ** 4, available: 1.2 * 1024 ** 4, efficiency: 85 },
    uptime: 97.88,
    latency: 22,
    challengesPassed: 2756,
    challengesTotal: 2850,
    challengeSuccessRate: 96.70,
    fee: 4,
    totalStake: 52000 * 1e9,
    delegatorCount: 24,
    operator: { name: 'NodeRunner', website: 'https://noderunner.eu' },
    location: { country: 'Netherlands', city: 'Amsterdam' },
  },
  {
    id: '5',
    publicKey: '8dPSz7e7LHi0TUlerV9pOzRueFujW2Z9uwD5Bd6aMk2',
    name: 'CryptoVault Node',
    rank: 5,
    performanceScore: 91.5,
    online: false,
    softwareVersion: 'v0.6.0',
    lastSeen: new Date(Date.now() - 3600000),
    storage: { dedicated: 1 * 1024 ** 4, used: 0.7 * 1024 ** 4, available: 0.3 * 1024 ** 4, efficiency: 78 },
    uptime: 95.23,
    latency: 45,
    challengesPassed: 2698,
    challengesTotal: 2850,
    challengeSuccessRate: 94.67,
    fee: 8,
    totalStake: 31000 * 1e9,
    delegatorCount: 11,
    location: { country: 'Japan', city: 'Tokyo' },
  },
  {
    id: '6',
    publicKey: 'AqR7z8e8MIj1VWmfsW0qPaRvgGukX3a0vxE6Cf7bNm3',
    name: 'Nordic Storage',
    rank: 6,
    performanceScore: 96.3,
    online: true,
    softwareVersion: 'v0.6.2',
    lastSeen: new Date(),
    storage: { dedicated: 5 * 1024 ** 4, used: 3.2 * 1024 ** 4, available: 1.8 * 1024 ** 4, efficiency: 91 },
    uptime: 99.21,
    latency: 15,
    challengesPassed: 2831,
    challengesTotal: 2850,
    challengeSuccessRate: 99.33,
    fee: 3,
    totalStake: 89000 * 1e9,
    delegatorCount: 29,
    operator: { name: 'Nordic Cloud AB' },
    location: { country: 'Sweden', city: 'Stockholm' },
  },
  {
    id: '7',
    publicKey: 'BsS8z9f9NJk2WXngtX1rQbSwgHvlY4b1wyF7Dg8cOn4',
    name: 'DataHaven Asia',
    rank: 7,
    performanceScore: 93.7,
    online: true,
    softwareVersion: 'v0.6.2',
    lastSeen: new Date(),
    storage: { dedicated: 3 * 1024 ** 4, used: 2.1 * 1024 ** 4, available: 0.9 * 1024 ** 4, efficiency: 87 },
    uptime: 97.65,
    latency: 28,
    challengesPassed: 2745,
    challengesTotal: 2850,
    challengeSuccessRate: 96.32,
    fee: 4,
    totalStake: 45000 * 1e9,
    delegatorCount: 15,
    location: { country: 'South Korea', city: 'Seoul' },
  },
  {
    id: '8',
    publicKey: 'CtT9z0g0OKl3XYohvY2sTcTxhIwmZ5c2xzG8Eh9dPo5',
    name: 'Swiss Vault',
    rank: 8,
    performanceScore: 97.9,
    online: true,
    softwareVersion: 'v0.6.2',
    lastSeen: new Date(),
    storage: { dedicated: 10 * 1024 ** 4, used: 7.5 * 1024 ** 4, available: 2.5 * 1024 ** 4, efficiency: 94 },
    uptime: 99.78,
    latency: 14,
    challengesPassed: 2845,
    challengesTotal: 2850,
    challengeSuccessRate: 99.82,
    fee: 5,
    totalStake: 156000 * 1e9,
    delegatorCount: 63,
    operator: { name: 'Swiss Data AG', website: 'https://swissvault.ch' },
    location: { country: 'Switzerland', city: 'Zurich' },
  },
  {
    id: '9',
    publicKey: 'DuU0z1h1PLm4YZpiwZ3tUdUyjJxnA6d3yaH9Fi0eQp6',
    name: 'Outback Node',
    rank: 9,
    performanceScore: 92.4,
    online: true,
    softwareVersion: 'v0.6.1',
    lastSeen: new Date(),
    storage: { dedicated: 2 * 1024 ** 4, used: 1.3 * 1024 ** 4, available: 0.7 * 1024 ** 4, efficiency: 82 },
    uptime: 96.89,
    latency: 35,
    challengesPassed: 2712,
    challengesTotal: 2850,
    challengeSuccessRate: 95.16,
    fee: 6,
    totalStake: 38000 * 1e9,
    delegatorCount: 14,
    operator: { name: 'Outback Digital' },
    location: { country: 'Australia', city: 'Sydney' },
  },
  {
    id: '10',
    publicKey: 'EvV1z2i2QMn5ZAqjxA4uVeVzkKyoB7e4zbI0Gj1fRq7',
    name: 'LatAm Storage',
    rank: 10,
    performanceScore: 90.8,
    online: true,
    softwareVersion: 'v0.6.1',
    lastSeen: new Date(),
    storage: { dedicated: 1.5 * 1024 ** 4, used: 1.0 * 1024 ** 4, available: 0.5 * 1024 ** 4, efficiency: 79 },
    uptime: 95.45,
    latency: 42,
    challengesPassed: 2678,
    challengesTotal: 2850,
    challengeSuccessRate: 93.96,
    fee: 7,
    totalStake: 28000 * 1e9,
    delegatorCount: 9,
    location: { country: 'Brazil', city: 'São Paulo' },
  },
  {
    id: '11',
    publicKey: 'FwW2z3j3RNo6ABrkYB5vWfWAlLzpC8f5acJ1Hk2gSr8',
    name: 'UK Data Hub',
    rank: 11,
    performanceScore: 94.6,
    online: true,
    softwareVersion: 'v0.6.2',
    lastSeen: new Date(),
    storage: { dedicated: 4 * 1024 ** 4, used: 2.8 * 1024 ** 4, available: 1.2 * 1024 ** 4, efficiency: 89 },
    uptime: 98.34,
    latency: 19,
    challengesPassed: 2798,
    challengesTotal: 2850,
    challengeSuccessRate: 98.18,
    fee: 4,
    totalStake: 61000 * 1e9,
    delegatorCount: 22,
    operator: { name: 'UK Data Solutions' },
    location: { country: 'UK', city: 'London' },
  },
  {
    id: '12',
    publicKey: 'GxX3z4k4SOp7BCslZC6wXgXBmMaqD9g6bdK2Il3hTs9',
    name: 'Hong Kong Node',
    rank: 12,
    performanceScore: 93.2,
    online: true,
    softwareVersion: 'v0.6.2',
    lastSeen: new Date(),
    storage: { dedicated: 3 * 1024 ** 4, used: 2.4 * 1024 ** 4, available: 0.6 * 1024 ** 4, efficiency: 86 },
    uptime: 97.12,
    latency: 26,
    challengesPassed: 2734,
    challengesTotal: 2850,
    challengeSuccessRate: 95.93,
    fee: 5,
    totalStake: 42000 * 1e9,
    delegatorCount: 17,
    location: { country: 'Hong Kong', city: 'Hong Kong' },
  },
  {
    id: '13',
    publicKey: 'HyY4z5l5TPq8CDtmAD7xYhYCnNbrE0h7ceL3Jm4iUt0',
    name: 'Canada Node',
    rank: 13,
    performanceScore: 95.1,
    online: true,
    softwareVersion: 'v0.6.2',
    lastSeen: new Date(),
    storage: { dedicated: 5 * 1024 ** 4, used: 3.5 * 1024 ** 4, available: 1.5 * 1024 ** 4, efficiency: 90 },
    uptime: 98.67,
    latency: 21,
    challengesPassed: 2815,
    challengesTotal: 2850,
    challengeSuccessRate: 98.77,
    fee: 3,
    totalStake: 73000 * 1e9,
    delegatorCount: 26,
    operator: { name: 'MapleNode Inc' },
    location: { country: 'Canada', city: 'Toronto' },
  },
  {
    id: '14',
    publicKey: 'IzZ5z6m6UQr9DEunBE8yZiZDoOcsF1i8dfM4Kn5jVu1',
    name: 'Poland Storage',
    rank: 14,
    performanceScore: 92.8,
    online: true,
    softwareVersion: 'v0.6.1',
    lastSeen: new Date(),
    storage: { dedicated: 2.5 * 1024 ** 4, used: 1.8 * 1024 ** 4, available: 0.7 * 1024 ** 4, efficiency: 84 },
    uptime: 96.95,
    latency: 24,
    challengesPassed: 2721,
    challengesTotal: 2850,
    challengeSuccessRate: 95.47,
    fee: 4,
    totalStake: 35000 * 1e9,
    delegatorCount: 13,
    location: { country: 'Poland', city: 'Warsaw' },
  },
  {
    id: '15',
    publicKey: 'J0A6z7n7VRs0EFvoCF9zAjAEpPdtG2j9egN5Lo6kWv2',
    name: 'India Data',
    rank: 15,
    performanceScore: 91.2,
    online: true,
    softwareVersion: 'v0.6.1',
    lastSeen: new Date(),
    storage: { dedicated: 2 * 1024 ** 4, used: 1.5 * 1024 ** 4, available: 0.5 * 1024 ** 4, efficiency: 81 },
    uptime: 95.78,
    latency: 38,
    challengesPassed: 2689,
    challengesTotal: 2850,
    challengeSuccessRate: 94.35,
    fee: 6,
    totalStake: 29000 * 1e9,
    delegatorCount: 11,
    location: { country: 'India', city: 'Mumbai' },
  },
  {
    id: '16',
    publicKey: 'K1B7z8o8WSt1FGwpDG0ABkBFqQeuH3k0fhO6Mp7lXw3',
    name: 'Finland Node',
    rank: 16,
    performanceScore: 96.8,
    online: true,
    softwareVersion: 'v0.6.2',
    lastSeen: new Date(),
    storage: { dedicated: 6 * 1024 ** 4, used: 4.2 * 1024 ** 4, available: 1.8 * 1024 ** 4, efficiency: 93 },
    uptime: 99.45,
    latency: 16,
    challengesPassed: 2838,
    challengesTotal: 2850,
    challengeSuccessRate: 99.58,
    fee: 3,
    totalStake: 95000 * 1e9,
    delegatorCount: 34,
    operator: { name: 'Nordic Vault Oy' },
    location: { country: 'Finland', city: 'Helsinki' },
  },
  {
    id: '17',
    publicKey: 'L2C8z9p9XTu2GHxqEH1BCmCGrRfvI4l1giP7Nq8mYx4',
    name: 'UAE Storage',
    rank: 17,
    performanceScore: 93.5,
    online: true,
    softwareVersion: 'v0.6.2',
    lastSeen: new Date(),
    storage: { dedicated: 4 * 1024 ** 4, used: 3.0 * 1024 ** 4, available: 1.0 * 1024 ** 4, efficiency: 88 },
    uptime: 97.56,
    latency: 32,
    challengesPassed: 2756,
    challengesTotal: 2850,
    challengeSuccessRate: 96.70,
    fee: 5,
    totalStake: 48000 * 1e9,
    delegatorCount: 19,
    location: { country: 'UAE', city: 'Dubai' },
  },
  {
    id: '18',
    publicKey: 'M3D9z0q0YUv3HIyrFI2CDnDHsSgwJ5m2hjQ8Or9nZy5',
    name: 'Spain Node',
    rank: 18,
    performanceScore: 92.1,
    online: true,
    softwareVersion: 'v0.6.1',
    lastSeen: new Date(),
    storage: { dedicated: 2 * 1024 ** 4, used: 1.4 * 1024 ** 4, available: 0.6 * 1024 ** 4, efficiency: 83 },
    uptime: 96.34,
    latency: 23,
    challengesPassed: 2701,
    challengesTotal: 2850,
    challengeSuccessRate: 94.77,
    fee: 5,
    totalStake: 32000 * 1e9,
    delegatorCount: 12,
    location: { country: 'Spain', city: 'Madrid' },
  },
  {
    id: '19',
    publicKey: 'N4E0z1r1ZVw4IJzsGJ3DEoEItThxK6n3ikR9Ps0oAz6',
    name: 'Taiwan Storage',
    rank: 19,
    performanceScore: 94.3,
    online: true,
    softwareVersion: 'v0.6.2',
    lastSeen: new Date(),
    storage: { dedicated: 3.5 * 1024 ** 4, used: 2.5 * 1024 ** 4, available: 1.0 * 1024 ** 4, efficiency: 89 },
    uptime: 98.12,
    latency: 27,
    challengesPassed: 2787,
    challengesTotal: 2850,
    challengeSuccessRate: 97.79,
    fee: 4,
    totalStake: 56000 * 1e9,
    delegatorCount: 20,
    location: { country: 'Taiwan', city: 'Taipei' },
  },
  {
    id: '20',
    publicKey: 'O5F1z2s2AWx5JKAtHK4EFpFJuUiyL7o4jlS0Qt1pBa7',
    name: 'Italy Node',
    rank: 20,
    performanceScore: 91.9,
    online: false,
    softwareVersion: 'v0.6.0',
    lastSeen: new Date(Date.now() - 7200000),
    storage: { dedicated: 1.5 * 1024 ** 4, used: 1.1 * 1024 ** 4, available: 0.4 * 1024 ** 4, efficiency: 80 },
    uptime: 94.56,
    latency: 29,
    challengesPassed: 2656,
    challengesTotal: 2850,
    challengeSuccessRate: 93.19,
    fee: 6,
    totalStake: 27000 * 1e9,
    delegatorCount: 10,
    location: { country: 'Italy', city: 'Milan' },
  },
  {
    id: '21',
    publicKey: 'P6G2z3t3BXy6KLBuIL5FGqGKvVjzM8p5kmT1Ru2qCb8',
    name: 'France Data',
    rank: 21,
    performanceScore: 95.5,
    online: true,
    softwareVersion: 'v0.6.2',
    lastSeen: new Date(),
    storage: { dedicated: 4.5 * 1024 ** 4, used: 3.2 * 1024 ** 4, available: 1.3 * 1024 ** 4, efficiency: 91 },
    uptime: 98.89,
    latency: 18,
    challengesPassed: 2823,
    challengesTotal: 2850,
    challengeSuccessRate: 99.05,
    fee: 4,
    totalStake: 71000 * 1e9,
    delegatorCount: 25,
    operator: { name: 'French Cloud SAS' },
    location: { country: 'France', city: 'Paris' },
  },
];

export default function Dashboard() {
  const [stats, setStats] = useState<NetworkStats | null>(null);
  const [price, setPrice] = useState<TokenPrice | null>(null);
  const [nodes, setNodes] = useState<PNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [networkStats, tokenPrice] = await Promise.all([
        getNetworkStats().catch((err) => {
          console.error('Failed to fetch network stats:', err);
          return null;
        }),
        getXandPrice().catch((err) => {
          console.error('Failed to fetch price:', err);
          return null;
        }),
      ]);

      setStats(networkStats);
      setPrice(tokenPrice);
      setNodes(mockPNodes);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to connect to Xandeum DevNet');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleClearComparison = () => setSelectedIds([]);
  const handleRemoveFromComparison = (id: string) => {
    setSelectedIds(prev => prev.filter(i => i !== id));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Error banner */}
      {error && (
        <div className="bg-xand-red/10 border border-xand-red/30 rounded-xl p-4 text-xand-red text-sm">
          {error}
        </div>
      )}

      {/* Network Overview */}
      <section className="animate-fade-in">
        <NetworkOverview 
          stats={stats} 
          price={price} 
          loading={loading}
          onRefresh={fetchData}
        />
      </section>

      {/* pNode Leaderboard */}
      <section className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <Leaderboard 
          nodes={nodes} 
          loading={loading}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
        />
      </section>

      {/* Comparison Tool - only shown when nodes are selected */}
      {selectedIds.length > 0 && (
        <section className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <ComparisonTool 
            nodes={nodes}
            selectedIds={selectedIds}
            onRemove={handleRemoveFromComparison}
            onClear={handleClearComparison}
          />
        </section>
      )}

      {/* Network Topology Map */}
      <section className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <NetworkMap nodes={nodes} />
      </section>

      {/* Development notice */}
      <section className="bg-xand-card border border-xand-border rounded-xl p-6 bg-xand-teal/5 border-xand-teal/20">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-xand-teal/20 flex items-center justify-center flex-shrink-0">
            <span className="text-xl">🚧</span>
          </div>
          <div>
            <h3 className="font-semibold text-xand-text">Development Preview</h3>
            <p className="text-sm text-xand-text-dim mt-1">
              pNode-specific metrics are using simulated data. 
              Full integration pending pnRPC API documentation from Xandeum&apos;s Herrenberg release.
              Network stats (epoch, slot, node count) are live from DevNet RPC.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
