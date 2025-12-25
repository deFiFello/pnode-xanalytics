import { NextResponse } from 'next/server';

interface PodCredit {
  pod_id: string;
  credits: number;
}

interface PodCreditsResponse {
  pods_credits: PodCredit[];
  status: string;
}

export async function GET() {
  try {
    // Fetch REAL pNode data from Xandeum pRPC
    const creditsResponse = await fetch('https://podcredits.xandeum.network/api/pods-credits', {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 60 },
    });

    // Fetch epoch from DevNet RPC
    let currentEpoch = 0;
    try {
      const epochResponse = await fetch('https://api.devnet.xandeum.com:8899', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'getEpochInfo',
        }),
        next: { revalidate: 60 },
      });
      const epochData = await epochResponse.json();
      currentEpoch = epochData.result?.epoch || 0;
    } catch (e) {
      console.log('Epoch fetch failed');
    }

    if (!creditsResponse.ok) {
      throw new Error(`API responded with status: ${creditsResponse.status}`);
    }

    const data: PodCreditsResponse = await creditsResponse.json();
    
    if (data.status === 'success' && data.pods_credits?.length > 0) {
      // Sort by credits (descending) and map to clean structure
      const sortedNodes = data.pods_credits
        .filter(p => p.credits > 0)
        .sort((a, b) => b.credits - a.credits);

      const totalCredits = sortedNodes.reduce((sum, p) => sum + p.credits, 0);

      // Return ONLY real data from API
      const nodes = sortedNodes.map((pod, index) => ({
        id: pod.pod_id,           // Real: pNode public key
        credits: pod.credits,     // Real: activity credits from network
        rank: index + 1,          // Derived: position by credits
      }));

      return NextResponse.json({
        success: true,
        source: 'podcredits.xandeum.network',
        dataType: 'pRPC (real network data)',
        count: nodes.length,
        nodes,
        totalCredits,
        epoch: currentEpoch,
        timestamp: new Date().toISOString(),
      });
    }

    throw new Error('Invalid response format');
  } catch (error) {
    console.error('Error fetching pNode data:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch from pRPC endpoint',
      source: 'error',
      count: 0,
      nodes: [],
      totalCredits: 0,
      epoch: 0,
      timestamp: new Date().toISOString(),
    });
  }
}
