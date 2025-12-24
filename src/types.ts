export interface PNode {
  id: string;
  name: string;
  shortKey: string;
  fullKey: string;
  score: number;
  uptime: number;
  fee: number;
  credits: number;
  version: string;
  isOnline: boolean;
  totalStake: number;
  delegators: number;
  location: string;
  performanceHistory: number[];
  uptimeHistory: number[];
}

export interface NetworkStats {
  totalNodes: number;
  activeNodes: number;
  currentEpoch: number;
}

export interface XandPrice {
  usd: number;
  usd_24h_change: number;
}
