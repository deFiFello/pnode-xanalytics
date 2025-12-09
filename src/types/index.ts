// Network-level statistics
export interface NetworkStats {
  totalPNodes: number;
  activePNodes: number;
  totalStorage: StorageStats;
  currentEpoch: number;
  currentSlot: number;
  epochProgress: number;
  lastUpdated: Date;
}

export interface StorageStats {
  dedicated: number; // bytes
  used: number; // bytes
  available: number; // bytes
  utilizationPercent: number;
}

// XAND token data
export interface TokenPrice {
  usd: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
}

// Individual pNode data
export interface PNode {
  id: string;
  publicKey: string;
  name?: string;
  rank: number;
  performanceScore: number;
  
  // Status
  online: boolean;
  softwareVersion: string;
  lastSeen: Date;
  
  // Storage metrics
  storage: {
    dedicated: number;
    used: number;
    available: number;
    efficiency: number;
  };
  
  // Performance metrics
  uptime: number; // percentage
  latency: number; // ms
  challengesPassed: number;
  challengesTotal: number;
  challengeSuccessRate: number;
  
  // Staking
  fee: number; // percentage
  totalStake: number;
  delegatorCount: number;
  
  // Operator info
  operator?: {
    name?: string;
    description?: string;
    website?: string;
    avatar?: string;
  };
  
  // Location
  location?: {
    country?: string;
    city?: string;
    asn?: string;
    latitude?: number;
    longitude?: number;
  };
}

// Cluster node from Solana RPC
export interface ClusterNode {
  pubkey: string;
  gossip: string | null;
  tpu: string | null;
  rpc: string | null;
  version: string | null;
  featureSet: number | null;
  shredVersion: number | null;
}

// Vote account from Solana RPC
export interface VoteAccount {
  votePubkey: string;
  nodePubkey: string;
  activatedStake: number;
  epochVoteAccount: boolean;
  commission: number;
  lastVote: number;
  epochCredits: [number, number, number][];
  rootSlot: number;
}

// Epoch info from Solana RPC
export interface EpochInfo {
  epoch: number;
  slotIndex: number;
  slotsInEpoch: number;
  absoluteSlot: number;
  blockHeight: number;
  transactionCount?: number;
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}

// Leaderboard sorting
export type SortField = 'rank' | 'performanceScore' | 'uptime' | 'storage' | 'fee' | 'stake';
export type SortDirection = 'asc' | 'desc';

export interface LeaderboardFilters {
  minUptime?: number;
  maxFee?: number;
  minStorage?: number;
  onlineOnly?: boolean;
  search?: string;
}

// For comparison tool
export interface ComparisonWeights {
  uptime: number;
  performance: number;
  storage: number;
  fee: number;
  stake: number;
}
