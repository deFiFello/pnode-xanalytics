'use client';

import { useEffect, useState, useCallback } from 'react';
import { NetworkOverview } from '@/components/NetworkOverview';
import { Leaderboard } from '@/components/Leaderboard';
import { getNetworkStats } from '@/lib/xandeum';
import { getXandPrice } from '@/lib/coingecko';
import type { NetworkStats, TokenPrice, PNode } from '@/types';

// Mock pNode data until pnRPC is available
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
    operator: { name: 'Alpha Ops', website: 'https://example.com' },
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
    location: { country: 'Netherlands', city: 'Amsterdam' },
  },
  {
    id: '5',
    publicKey: '8dPSz7e7LHi0TUlerV9pOzRueFujW2Z9uwD5Bd6a',
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
];

export default function Dashboard() {
  const [stats, setStats] = useState<NetworkStats | null>(null);
  const [price, setPrice] = useState<TokenPrice | null>(null);
  const [nodes, setNodes] = useState<PNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch network stats from Xandeum DevNet
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
      
      // Use mock pNode data until pnRPC is available
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
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

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
        <Leaderboard nodes={nodes} loading={loading} />
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
              pNode-specific metrics (storage, challenges, uptime) are using placeholder data. 
              Full integration pending pnRPC API documentation from Xandeum&apos;s Herrenberg release.
              Network stats are live from DevNet RPC.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
