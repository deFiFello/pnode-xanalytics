import type { TokenPrice } from '@/types';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const XANDEUM_ID = 'xandeum';

export async function getXandPrice(): Promise<TokenPrice> {
  try {
    const response = await fetch(
      `${COINGECKO_API}/simple/price?ids=${XANDEUM_ID}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true`,
      {
        next: { revalidate: 60 }, // Cache for 60 seconds
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch price');
    }
    
    const data = await response.json();
    const xand = data[XANDEUM_ID];
    
    if (!xand) {
      throw new Error('XAND data not found');
    }
    
    return {
      usd: xand.usd ?? 0,
      change24h: xand.usd_24h_change ?? 0,
      volume24h: xand.usd_24h_vol ?? 0,
      marketCap: xand.usd_market_cap ?? 0,
    };
  } catch (error) {
    console.error('Error fetching XAND price:', error);
    // Return placeholder data on error
    return {
      usd: 0,
      change24h: 0,
      volume24h: 0,
      marketCap: 0,
    };
  }
}

export async function getXandPriceHistory(days: number = 30): Promise<{
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}> {
  try {
    const response = await fetch(
      `${COINGECKO_API}/coins/${XANDEUM_ID}/market_chart?vs_currency=usd&days=${days}`,
      {
        next: { revalidate: 300 }, // Cache for 5 minutes
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch price history');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching price history:', error);
    return {
      prices: [],
      market_caps: [],
      total_volumes: [],
    };
  }
}

// Format price for display
export function formatPrice(price: number): string {
  if (price === 0) return '$0.00';
  if (price < 0.01) return `$${price.toFixed(6)}`;
  if (price < 1) return `$${price.toFixed(4)}`;
  return `$${price.toFixed(2)}`;
}

// Format percentage change
export function formatChange(change: number): string {
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(2)}%`;
}

// Format large numbers
export function formatLargeNumber(num: number): string {
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
  return `$${num.toFixed(2)}`;
}
