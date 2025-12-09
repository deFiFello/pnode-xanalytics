import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import type { ClusterNode, VoteAccount, EpochInfo, NetworkStats, StorageStats } from '@/types';

// Xandeum DevNet RPC endpoint
const XANDEUM_DEVNET_RPC = 'https://api.devnet.xandeum.com:8899';

// Create connection singleton
let connection: Connection | null = null;

export function getConnection(): Connection {
  if (!connection) {
    connection = new Connection(XANDEUM_DEVNET_RPC, {
      commitment: 'confirmed',
      confirmTransactionInitialTimeout: 60000,
    });
  }
  return connection;
}

// Get current epoch info
export async function getEpochInfo(): Promise<EpochInfo> {
  const conn = getConnection();
  const epochInfo = await conn.getEpochInfo();
  return {
    epoch: epochInfo.epoch,
    slotIndex: epochInfo.slotIndex,
    slotsInEpoch: epochInfo.slotsInEpoch,
    absoluteSlot: epochInfo.absoluteSlot,
    blockHeight: epochInfo.blockHeight ?? 0,
    transactionCount: epochInfo.transactionCount ?? undefined,
  };
}

// Get cluster nodes
export async function getClusterNodes(): Promise<ClusterNode[]> {
  const conn = getConnection();
  const nodes = await conn.getClusterNodes();
  return nodes.map((node) => ({
    pubkey: node.pubkey,
    gossip: node.gossip,
    tpu: node.tpu,
    rpc: node.rpc,
    version: node.version,
    featureSet: null,
    shredVersion: null,
  }));
}

// Get vote accounts (validators)
export async function getVoteAccounts(): Promise<{
  current: VoteAccount[];
  delinquent: VoteAccount[];
}> {
  const conn = getConnection();
  const voteAccounts = await conn.getVoteAccounts();
  
  const mapVoteAccount = (va: typeof voteAccounts.current[0]): VoteAccount => ({
    votePubkey: va.votePubkey,
    nodePubkey: va.nodePubkey,
    activatedStake: va.activatedStake,
    epochVoteAccount: va.epochVoteAccount,
    commission: va.commission,
    lastVote: va.lastVote,
    epochCredits: va.epochCredits,
    rootSlot: 0,
  });
  
  return {
    current: voteAccounts.current.map(mapVoteAccount),
    delinquent: voteAccounts.delinquent.map(mapVoteAccount),
  };
}

// Get current slot
export async function getCurrentSlot(): Promise<number> {
  const conn = getConnection();
  return conn.getSlot();
}

// Get block height
export async function getBlockHeight(): Promise<number> {
  const conn = getConnection();
  return conn.getBlockHeight();
}

// Get network version
export async function getVersion(): Promise<string> {
  const conn = getConnection();
  const version = await conn.getVersion();
  return version['solana-core'];
}

// Get health status via slot check
export async function getHealth(): Promise<'ok' | 'error'> {
  try {
    const conn = getConnection();
    await conn.getSlot();
    return 'ok';
  } catch {
    return 'error';
  }
}

// Aggregate network statistics
export async function getNetworkStats(): Promise<NetworkStats> {
  const [epochInfo, clusterNodes, voteAccounts] = await Promise.all([
    getEpochInfo(),
    getClusterNodes(),
    getVoteAccounts(),
  ]);
  
  const activeNodes = clusterNodes.filter((n) => n.gossip !== null);
  const epochProgress = (epochInfo.slotIndex / epochInfo.slotsInEpoch) * 100;
  
  // Placeholder storage stats until pnRPC is available
  const storageStats: StorageStats = {
    dedicated: 0,
    used: 0,
    available: 0,
    utilizationPercent: 0,
  };
  
  return {
    totalPNodes: clusterNodes.length,
    activePNodes: activeNodes.length,
    totalStorage: storageStats,
    currentEpoch: epochInfo.epoch,
    currentSlot: epochInfo.absoluteSlot,
    epochProgress,
    lastUpdated: new Date(),
  };
}

// Get account balance
export async function getBalance(publicKey: string): Promise<number> {
  const conn = getConnection();
  const pk = new PublicKey(publicKey);
  const balance = await conn.getBalance(pk);
  return balance / 1e9; // Convert lamports to SOL/XAND
}

// XAND Token mint address
export const XAND_MINT = 'XANDuUoVoUqniKkpcKhrxmvYJybpJvUxJLr21Gaj3Hx';

// Check RPC connection health
export async function checkConnection(): Promise<boolean> {
  try {
    const conn = getConnection();
    await conn.getSlot();
    return true;
  } catch {
    return false;
  }
}
