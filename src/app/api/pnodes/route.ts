import { NextResponse } from 'next/server';
// @ts-ignore
import fetch from 'node-fetch';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PodCredit {
  pod_id: string;
  credits: number;
}

interface PodCreditsResponse {
  pods_credits: PodCredit[];
  status: string;
}

interface PrpcNode {
  address: string;
  is_public: boolean;
  last_seen_timestamp: number;
  pubkey: string;
  rpc_port: number;
  storage_committed: number;
  storage_usage_percent: number;
  storage_used: number;
  uptime: number;
  version: string;
}

interface GeoLocation {
  country: string;
  countryCode: string;
  city: string;
  lat: number;
  lon: number;
}

// Simple in-memory cache for geolocation (persists across requests in same instance)
const geoCache = new Map<string, GeoLocation | null>();

// pRPC nodes by network
const PRPC_NODES = {
  devnet: [
    '192.190.136.36',  // confirmed working
    '207.244.255.1',
    '161.97.97.41',
    '62.171.138.27',
  ],
  mainnet: [
    '173.212.220.65',  // from official xandeum-prpc crate docs
  ],
};

async function fetchGeoLocation(ip: string): Promise<GeoLocation | null> {
  // Check cache first
  if (geoCache.has(ip)) {
    return geoCache.get(ip) || null;
  }
  
  try {
    // ip-api.com - free, no API key, 45 requests/minute
    const res = await fetch(
      `https://ip-api.com/json/${ip}?fields=status,country,countryCode,city,lat,lon`,
      { timeout: 3000 }
    );
    const data = await res.json();
    
    if (data.status === 'success') {
      const location: GeoLocation = {
        country: data.country,
        countryCode: data.countryCode,
        city: data.city || 'Unknown',
        lat: data.lat,
        lon: data.lon,
      };
      geoCache.set(ip, location);
      return location;
    }
    
    geoCache.set(ip, null);
    return null;
  } catch (err) {
    console.log(`Geo lookup failed for ${ip}`);
    geoCache.set(ip, null);
    return null;
  }
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h`;
  return `${Math.floor(seconds / 60)}m`;
}

function formatBytes(bytes: number): string {
  if (bytes >= 1e12) return `${(bytes / 1e12).toFixed(2)} TB`;
  if (bytes >= 1e9) return `${(bytes / 1e9).toFixed(2)} GB`;
  if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(2)} MB`;
  return `${bytes} B`;
}

async function fetchPrpcStats(network: 'mainnet' | 'devnet' = 'devnet'): Promise<Map<string, PrpcNode>> {
  const statsMap = new Map<string, PrpcNode>();
  const nodesToTry = PRPC_NODES[network] || PRPC_NODES.devnet;
  
  for (const ip of nodesToTry) {
    try {
      console.log(`Trying pRPC at ${ip}:6000 (${network})...`);
      
      const res = await fetch(`http://${ip}:6000/rpc`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'get-pods-with-stats',
          id: 1
        }),
        timeout: 30000, // 30 second timeout
      });
      
      const text = await res.text();
      
      if (text === 'Host not allowed') {
        console.log(`${ip}: Host not allowed`);
        continue;
      }
      
      const data = JSON.parse(text);
      const pods = data.result?.pods || data.result;
      if (pods && pods.length > 10) {
        pods.forEach((node: PrpcNode) => {
          statsMap.set(node.pubkey, node);
        });
        console.log(`pRPC SUCCESS (${network}): Got ${pods.length} nodes from ${ip}`);
        break;
      }
    } catch (err: any) {
      console.log(`pRPC ${ip} failed:`, err.message || err);
      continue;
    }
  }
  
  return statsMap;
}

export async function GET(request: Request) {
  try {
    

// Get network from query params (default to mainnet)
const { searchParams } = new URL(request.url);
const networkParam = searchParams.get('network') || 'mainnet';

// SECURITY: Whitelist validation to prevent SSRF attacks
const ALLOWED_NETWORKS = ['mainnet', 'devnet', 'testnet'];
const network = ALLOWED_NETWORKS.includes(networkParam) ? networkParam : 'mainnet';
  
// SECURITY: Whitelist valid networks to prevent SSRF
const VALID_NETWORKS = ['mainnet', 'devnet', 'testnet'];
if (!VALID_NETWORKS.includes(network)) {
  return NextResponse.json(
    { success: false, error: 'Invalid network parameter' },
    { status: 400 }
  );
}

    
    // Network-specific endpoints
    const endpoints = {
      mainnet: {
        credits: 'https://podcredits.xandeum.network/api/mainnet-pod-credits',
        rpc: 'https://api.mainnet.xandeum.com:8899',
      },
      devnet: {
        credits: 'https://podcredits.xandeum.network/api/pods-credits',
        rpc: 'https://api.devnet.xandeum.com:8899',
      },
    };
    
    const activeEndpoints = endpoints[network as keyof typeof endpoints] || endpoints.mainnet;
    
    // Fetch credits (use global fetch for HTTPS)
    const creditsResponse = await globalThis.fetch(activeEndpoints.credits, {
      headers: { 'Accept': 'application/json' },
    });

    // Fetch pRPC stats (uses node-fetch for HTTP port 6000)
    const prpcStats = await fetchPrpcStats(network as 'mainnet' | 'devnet');

    // Fetch epoch (may fail on mainnet alpha)
    let currentEpoch = 0;
    try {
      const epochResponse = await globalThis.fetch(activeEndpoints.rpc, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'getEpochInfo',
        }),
      });
      const epochData = await epochResponse.json();
      currentEpoch = epochData.result?.epoch || 0;
    } catch (e) {
      console.log('Epoch fetch failed');
    }

    if (!creditsResponse.ok) {
      throw new Error(`Credits API responded with status: ${creditsResponse.status}`);
    }

    const data: PodCreditsResponse = await creditsResponse.json();
    
    if (data.status === 'success' && data.pods_credits?.length > 0) {
      const sortedNodes = data.pods_credits
        .filter(p => p.credits > 0)
        .sort((a, b) => b.credits - a.credits);

      const totalCredits = sortedNodes.reduce((sum, p) => sum + p.credits, 0);

      // First pass: build nodes without geolocation
      const nodesWithoutGeo = sortedNodes.map((pod, index) => {
        const stats = prpcStats.get(pod.pod_id);
        
        // Calculate time since last seen
        let lastSeenAgo = null;
        if (stats?.last_seen_timestamp) {
          const secondsAgo = Math.floor(Date.now() / 1000) - stats.last_seen_timestamp;
          if (secondsAgo < 60) lastSeenAgo = 'Just now';
          else if (secondsAgo < 3600) lastSeenAgo = `${Math.floor(secondsAgo / 60)}m ago`;
          else if (secondsAgo < 86400) lastSeenAgo = `${Math.floor(secondsAgo / 3600)}h ago`;
          else lastSeenAgo = `${Math.floor(secondsAgo / 86400)}d ago`;
        }
        
        return {
          id: pod.pod_id,
          credits: pod.credits,
          rank: index + 1,
          ip: stats?.address?.split(':')[0] || null,
          version: stats?.version || null,
          uptime: stats?.uptime || null,
          uptimeFormatted: stats?.uptime ? formatUptime(stats.uptime) : null,
          storage_committed: stats?.storage_committed || null,
          storage_committed_formatted: stats?.storage_committed ? formatBytes(stats.storage_committed) : null,
          storage_used: stats?.storage_used || null,
          storage_used_formatted: stats?.storage_used ? formatBytes(stats.storage_used) : null,
          storage_utilization: stats?.storage_usage_percent || null,
          last_seen_timestamp: stats?.last_seen_timestamp || null,
          last_seen_ago: lastSeenAgo,
          activityRate: stats?.uptime && stats.uptime > 0 
            ? Math.round(pod.credits / (stats.uptime / 86400)) 
            : null,
          hasStats: !!stats,
        };
      });

      // Fetch geolocation for nodes with IPs (limit to 40 to stay under rate limit)
      const uniqueIps = Array.from(new Set(nodesWithoutGeo.filter(n => n.ip).map(n => n.ip as string)));
      const ipsToFetch = uniqueIps.filter(ip => !geoCache.has(ip)).slice(0, 40);
      
      // Batch fetch geolocation (parallel but limited)
      if (ipsToFetch.length > 0) {
        await Promise.all(ipsToFetch.map(ip => fetchGeoLocation(ip)));
      }

      // Second pass: add geolocation data
      const nodes = nodesWithoutGeo.map(node => ({
        ...node,
        location: node.ip ? geoCache.get(node.ip) || null : null,
      }));

      // Calculate country distribution
      const countryCount = new Map<string, number>();
      nodes.forEach(n => {
        if (n.location?.countryCode) {
          countryCount.set(n.location.countryCode, (countryCount.get(n.location.countryCode) || 0) + 1);
        }
      });
      const countries = Array.from(countryCount.entries())
        .map(([code, count]) => ({ code, count }))
        .sort((a, b) => b.count - a.count);

      const nodesWithStats = nodes.filter(n => n.hasStats).length;
      const totalStorage = nodes.reduce((sum, n) => sum + (n.storage_committed || 0), 0);
      const totalStorageUsed = nodes.reduce((sum, n) => sum + (n.storage_used || 0), 0);
      
      // Calculate average uptime (only for nodes with stats)
      const uptimes = nodes.filter(n => n.uptime).map(n => n.uptime as number);
      const avgUptime = uptimes.length > 0 ? uptimes.reduce((a, b) => a + b, 0) / uptimes.length : 0;
      
      // Calculate average activity rate
      const activityRates = nodes.filter(n => n.activityRate).map(n => n.activityRate as number);
      const avgActivityRate = activityRates.length > 0 
        ? Math.round(activityRates.reduce((a, b) => a + b, 0) / activityRates.length) 
        : 0;
      
      // Version distribution - extract base version (before any dash)
      const versions = nodes.filter(n => n.version).map(n => (n.version as string).split('-')[0]);
      const versionCounts = versions.reduce((acc, v) => {
        acc[v] = (acc[v] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      // Find most common version
      const sortedVersions = Object.entries(versionCounts).sort((a, b) => b[1] - a[1]);
      const latestVersion = sortedVersions.length > 0 ? sortedVersions[0][0] : null;
      const onLatestVersion = latestVersion ? versionCounts[latestVersion] : 0;

      return NextResponse.json({
        success: true,
        network,
        source: prpcStats.size > 0 ? 'podcredits + pRPC' : 'podcredits.xandeum.network',
        count: nodes.length,
        nodes,
        totalCredits,
        epoch: currentEpoch,
        timestamp: new Date().toISOString(),
        stats: {
          nodesWithStats,
          totalStorage,
          totalStorageFormatted: formatBytes(totalStorage),
          totalStorageUsed,
          totalStorageUsedFormatted: formatBytes(totalStorageUsed),
          avgUptime,
          avgUptimeFormatted: formatUptime(avgUptime),
          avgActivityRate,
          avgActivityRateFormatted: `${avgActivityRate.toLocaleString()}/day`,
          latestVersion,
          onLatestVersion,
          prpcSource: prpcStats.size > 0 ? 'live' : 'unavailable',
          countries,
          countryCount: countries.length,
          versionDistribution: sortedVersions.map(([version, count]) => ({ version, count })),
        }
      });
    }

    throw new Error('Invalid response format');
  } catch (error) {
    console.error('Error fetching pNode data:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch data',
      count: 0,
      nodes: [],
      totalCredits: 0,
      epoch: 0,
      timestamp: new Date().toISOString(),
    });
  }
}
